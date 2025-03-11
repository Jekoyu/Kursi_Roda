const ErrorNotFoundException =
  require("../../exception/error-not-found.exception").ErrorNotFoundException;
const { v7: uuidv7 } = require("uuid");
const db = require("../../database/mysql.connection");
const { getPagination } = require("../../utility/pagination.utility"); // utility: pagination
const STATUS = require("../constant/status-data.constant"); // constant

// repository
const rentalRepo = require("../repository/rental.repository");
const wheelchairRepo = require("../repository/wheelchair.repository");

// --- main service ---
// get all rentals (transactions for user based on phone)
const getAllRentals = async (req) => {
  try {
    const pageNumber = parseInt(req.query.batch || 1);
    const pageSize = parseInt(req.query.size || 10);
    const pagination = getPagination(pageNumber, pageSize);

    const options = {
      pagination: {
        limit: pagination.limit,
        offset: pagination.offset,
      },
    };

    const filter = {
      search: req.query.search || false,
      customerPhone: req.query.phone || false,
    };

    const [data, totalData] = await Promise.all([
      rentalRepo.findAll(options, filter),
      rentalRepo.count(filter),
    ]);

    return {
      page: {
        total_record_count: totalData,
        batch_number: pageNumber,
        batch_size: data.length,
        max_batch_size: pageSize,
      },
      records: data,
    };
  } catch (error) {
    console.error(`--- Service Error: ${error.message}`);
    throw error;
  }
};

// get rental details based on phone number
const getRentalDetail = async (req) => {
  const rentalId = req.params.id;
  const customerPhone = req.query.phone;

  // console.log("Rental ID:", rentalId, "Type:", typeof rentalId);
  // console.log("Customer Phone:", customerPhone, "Type:", typeof customerPhone);

  try {
    // Construct the where clause
    const whereClause = {
      id: rentalId,
    };

    // Add customer_phone to the where clause only if it's provided
    if (customerPhone) {
      whereClause.customer_phone = customerPhone;
    }

    // console.log("Where Clause in Service:", whereClause);

    // Call the repository
    const data = await rentalRepo.findOne(whereClause);

    if (!data) {
      throw new ErrorNotFoundException();
    }

    return data;
  } catch (error) {
    console.error(`--- Service Error: ${error.message}`);
    throw error;
  }
};

// create rental (user creates rental for a wheelchair)
const createRental = async (req) => {
  const transaction = await db.sequelize.transaction();
  const wheelchairId = req.body.wheelchair_id;

  try {
    // Check if the wheelchair exists and is available
    const wheelchair = await wheelchairRepo.findOne({ id: wheelchairId });
    if (!wheelchair || !wheelchair.available) {
      throw new ErrorNotFoundException("Wheelchair not available");
    }

    // Generate rental ID and set rental data
    const rentalId = uuidv7();
    const rentalPayload = {
      id: rentalId,
      wheelchair_id: wheelchairId,
      customer_name: req.body.customer_name,
      customer_phone: req.body.customer_phone,
      rental_date: req.body.rental_date,
      return_date: req.body.return_date || null,
      rental_price: wheelchair.price,
      status: STATUS.ONGOING,
      created_at: new Date(),
      created_by: req.body.customer_name,
      modified_at: new Date(),
      modified_by: req.body.customer_name,
    };

    // Calculate total price based on rental duration and rental price
    const totalPrice = calculateTotalPrice(
      wheelchair.price,
      rentalPayload.rental_date,
      rentalPayload.return_date
    );

    rentalPayload.total_price = totalPrice;

    const rentalData = await rentalRepo.create(rentalPayload, transaction);

    // Mark the wheelchair as unavailable
    await wheelchairRepo.update(
      { available: false },
      { id: wheelchairId },
      transaction
    );

    await transaction.commit();

    return rentalData;
  } catch (error) {
    await transaction.rollback();
    console.error(`--- Service Error: ${error.message}`);
    throw error;
  }
};

// update rental (user returns wheelchair)
const updateRental = async (req) => {
  const rentalId = req.params.id;
  const transaction = await db.sequelize.transaction();

  try {
    // Fetch the rental record based on rentalId
    const rental = await rentalRepo.findOne({ id: rentalId });
    if (!rental) {
      throw new Error("Rental not found");
    }

    // Prepare the update payload
    const updatePayload = {
      return_date: req.body.return_date,
      status: STATUS.PENDING,
      modified_at: new Date(),
      modified_by: req.body.customer_name,
    };

    // Calculate total price based on rental duration
    const totalPrice = calculateTotalPrice(
      rental.rental_price,
      rental.rental_date,
      req.body.return_date
    );

    // Add calculated total price to the update payload
    updatePayload.total_price = totalPrice;

    // Update the rental record
    await rentalRepo.update(updatePayload, { id: rentalId }, transaction);

    // Mark the wheelchair as available after return
    await wheelchairRepo.update(
      { available: true },
      { id: rental.wheelchair_id },
      transaction
    );

    // Commit the transaction
    await transaction.commit();

    // Return the updated payload
    return updatePayload;
  } catch (error) {
    await transaction.rollback();
    console.error(`--- Service Error: ${error.message}`);
    throw error;
  }
};

// cancel rental (soft-delete by user)
const cancelRental = async (req) => {
  const rentalId = req.params.id;
  const transaction = await db.sequelize.transaction();

  try {
    // Fetch the rental record based on rentalId
    const rental = await rentalRepo.findOne({ id: rentalId });
    if (!rental) {
      throw new Error("Rental not found");
    }

    const cancelPayload = {
      status: STATUS.CANCELLED,
      modified_at: new Date(),
      modified_by: req.body.customer_name,
    };

    // Update the rental record
    await rentalRepo.update(cancelPayload, { id: rentalId }, transaction);

    // Mark the wheelchair as available after return
    await wheelchairRepo.update(
      { available: true },
      { id: rental.wheelchair_id },
      transaction
    );

    // Commit the transaction
    await transaction.commit();

    return cancelPayload;
  } catch (error) {
    await transaction.rollback();
    console.error(`--- Service Error: ${error.message}`);
    throw error;
  }
};

const calculateTotalPrice = (rentalPrice, rentalDate, returnDate) => {
  const rentalDateObj = new Date(rentalDate);
  const returnDateObj = new Date(returnDate);

  if (isNaN(returnDateObj.getTime()) || isNaN(rentalDateObj.getTime())) {
    throw new Error("Invalid dates");
  }

  const duration = (returnDateObj - rentalDateObj) / (1000 * 60 * 60 * 24); // Duration in days
  const days = Math.max(duration, 1);
  const totalPrice = days * rentalPrice;

  return parseFloat(totalPrice.toFixed(2));
};

module.exports = {
  getAllRentals,
  getRentalDetail,
  createRental,
  updateRental,
  cancelRental,
  calculateTotalPrice,
};
