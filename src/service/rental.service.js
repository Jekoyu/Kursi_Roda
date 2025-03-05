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
      customerPhone: req.query.phone || false, // Filter by user phone
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

// get rental details based on phone number (without login)
const getRentalDetail = async (req) => {
  const rentalId = req.params.id;
  const customerPhone = req.query.phone;

  if (!rentalId || !isValidUUID(rentalId)) {
    throw new Error("Invalid Rental ID");
  }

  try {
    const data = await rentalRepo.findOne({
      where: {
        id: rentalId,
        customer_phone: customerPhone,
      },
    });

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

  try {
    const wheelchairId = req.body.wheelchair_id;

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
      created_by: req.body.customer_name, // Store customer name as creator
      modified_at: new Date(),
      modified_by: req.body.customer_name, // Store customer name as modifier
    };

    // Calculate total price based on rental duration and rental price
    const totalPrice = calculateTotalPrice(
      wheelchair.price,
      rentalPayload.rental_date,
      rentalPayload.return_date
    );

    rentalPayload.total_price = totalPrice; // Set the calculated total price

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
  try {
    const rentalId = req.params.id;
    const transaction = await db.sequelize.transaction();

    // Ambil rental berdasarkan rental_id
    const rental = await rentalRepo.findOne({
      where: {
        id: rentalId,
      },
    });

    if (!rental) {
      throw new Error("Rental not found"); // Menangani jika rental_id tidak ditemukan
    }

    // Set payload yang akan diupdate
    const updatePayload = {
      return_date: req.body.return_date, // Return date diterima dari body
      status: STATUS.PENDING, // Status sementara, akan diupdate oleh admin menjadi Completed
      modified_at: new Date(),
      modified_by: req.body.customer_name, // Nama penyewa yang mengubah data
    };

    // Pastikan return_date ada dalam request body
    if (!updatePayload.return_date) {
      throw new Error("Return date is required");
    }

    // Hitung total price berdasarkan durasi penyewaan
    const totalPrice = calculateTotalPrice(
      rental.rental_price, // Harga per hari dari kursi roda
      rental.rental_date, // Tanggal rental
      req.body.return_date // Tanggal pengembalian dari body
    );

    updatePayload.total_price = totalPrice; // Menambahkan total_price yang dihitung

    // Update rental dengan data yang baru
    await rentalRepo.update(
      updatePayload,
      { id: rentalId, customer_phone: req.body.customer_phone },
      transaction
    );

    // Menandai kursi roda sebagai tersedia setelah pengembalian
    await wheelchairRepo.update(
      { available: true },
      { id: rental.wheelchair_id },
      transaction
    );

    // Commit transaksi
    await transaction.commit();

    // Mengembalikan data yang telah diperbarui
    return updatePayload;
  } catch (error) {
    // Rollback transaksi jika terjadi error
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
    const cancelPayload = {
      status: STATUS.CANCELLED, // Cancelled if deleted
      modified_at: new Date(),
      modified_by: req.body.customer_name, // Store customer name as modifier
    };

    await rentalRepo.update(
      cancelPayload,
      { id: rentalId, customer_phone: req.body.customer_phone },
      transaction
    );

    // Make wheelchair available again after cancellation
    const rental = await rentalRepo.findOne({ id: rentalId });
    await wheelchairRepo.update(
      { available: true },
      { id: rental.wheelchair_id },
      transaction
    );

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

const isValidUUID = (id) => {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(id);
};

module.exports = {
  getAllRentals,
  getRentalDetail,
  createRental,
  updateRental,
  cancelRental,
  calculateTotalPrice,
};
