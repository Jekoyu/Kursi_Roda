const {
  ErrorNotFoundException,
} = require("../../exception/error-not-found.exception");
const {
  ErrorQueryException,
} = require("../../exception/error-query.exception");
const db = require("../../database/mysql.connection");
const { getPagination } = require("../../utility/pagination.utility"); // utility: pagination
const STATUS = require("../constant/status-data.constant"); // constant

// repository
const wheelchairRepo = require("../repository/wheelchair.repository");

// --- main service ---
// get all
const getAll = async (req) => {
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

    // set search and/or filter
    const filter = {
      search: req.query.search || false,
    };

    // prettier-ignore
    const [data, totalData] = await Promise.all([
            wheelchairRepo.findAll(options, filter),
            wheelchairRepo.count(filter),
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

// get detail
const getDetail = async (req) => {
  try {
    const wheelchairId = req.params.id;

    // get data by 'id'
    const data = await wheelchairRepo.findOne({ id: wheelchairId });

    if (!data) {
      throw new ErrorNotFoundException();
    }

    return data;
  } catch (error) {
    console.error(`--- Service Error: ${error.message}`);
    throw error;
  }
};

// create
const create = async (req) => {
  // set transaction
  const transaction = await db.sequelize.transaction();

  try {
    const payload = {
      brand: req.body.brand,
      type: req.body.type,
      price: req.body.price,
      available: req.body.available || true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createData = await wheelchairRepo.create(payload, transaction);

    // commit transaction
    await transaction.commit();

    return createData;
  } catch (error) {
    // rollback transaction
    await transaction.rollback();

    console.error(`--- Service Error: ${error.message}`);
    throw new ErrorQueryException(error.message, error);
  }
};

// update
const update = async (req) => {
  const wheelchairId = req.params.id;

  // set transaction
  const transaction = await db.sequelize.transaction();

  try {
    const payload = {
      brand: req.body.brand,
      type: req.body.type,
      price: req.body.price,
      available: req.body.available,
      updated_at: new Date(),
    };

    const updatedData = await wheelchairRepo.update(
      payload,
      { id: wheelchairId },
      transaction
    );

    if (updatedData[0] === 0) {
      throw new ErrorNotFoundException();
    }

    // commit transaction
    await transaction.commit();

    return payload;
  } catch (error) {
    // rollback transaction
    await transaction.rollback();

    console.error(`--- Service Error: ${error.message}`);
    throw new ErrorQueryException(error.message, error);
  }
};

// soft delete
const softDelete = async (req) => {
  const wheelchairId = req.params.id;

  // set transaction
  const transaction = await db.sequelize.transaction();

  try {
    const payload = {
      available: false,
      updated_at: new Date(),
    };

    const updatedData = await wheelchairRepo.update(
      payload,
      { id: wheelchairId },
      transaction
    );

    if (updatedData[0] === 0) {
      throw new ErrorNotFoundException();
    }

    // commit transaction
    await transaction.commit();

    return payload;
  } catch (error) {
    // rollback transaction
    await transaction.rollback();

    console.error(`--- Service Error: ${error.message}`);
    throw new ErrorQueryException(error.message, error);
  }
};

module.exports = {
  getAll,
  getDetail,
  create,
  update,
  softDelete,
};
