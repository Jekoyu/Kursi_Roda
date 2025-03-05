const ErrorQueryException =
  require("../../exception/error-query.exception").ErrorQueryException;
const errorFormat = require("../../utility/error-format");

const db = require("../../database/mysql.connection");
const Wheelchair = db.wheelchair;

const findAll = async (options, filter) => {
  try {
    const { pagination } = options;
    const { search = null } = filter;

    const config = {
      attributes: [
        "id",
        "brand",
        "type",
        "price",
        "available",
        "created_at",
        "updated_at",
      ],
      order: [["created_at", "DESC"]],
      limit: pagination.limit,
      offset: pagination.offset,
    };

    if (search) {
      config.where = {
        [db.Op.or]: {
          brand: {
            [db.Op.like]: `%${search}%`,
          },
          type: {
            [db.Op.like]: `%${search}%`,
          },
        },
      };
    }

    return await Wheelchair.findAll(config);
  } catch (error) {
    const errObj = await errorFormat.sequelizeDB(error);
    throw new ErrorQueryException(errObj.metaData.message, errObj);
  }
};

const count = async (filter) => {
  try {
    const { search = null } = filter;

    const config = {};

    if (search) {
      config.where = {
        [db.Op.or]: {
          brand: {
            [db.Op.like]: `%${search}%`,
          },
          type: {
            [db.Op.like]: `%${search}%`,
          },
        },
      };
    }

    return await Wheelchair.count(config);
  } catch (error) {
    const errObj = await errorFormat.sequelizeDB(error);
    throw new ErrorQueryException(errObj.metaData.message, errObj);
  }
};

const findOne = async (where) => {
  try {
    const config = {
      attributes: [
        "id",
        "brand",
        "type",
        "price",
        "available",
        "created_at",
        "updated_at",
      ],
      where: where,
    };

    return await Wheelchair.findOne(config);
  } catch (error) {
    const errObj = await errorFormat.sequelizeDB(error);
    throw new ErrorQueryException(errObj.metaData.message, errObj);
  }
};

const create = async (payload, transaction = null) => {
  try {
    const config = {};

    if (transaction) {
      config.transaction = transaction;
    }

    return await Wheelchair.create(payload, config);
  } catch (error) {
    const errObj = await errorFormat.sequelizeDB(error);
    throw new ErrorQueryException(errObj.metaData.message, errObj);
  }
};

const update = async (payload, where, transaction = null) => {
  try {
    const config = {
      where: where,
    };

    if (transaction) {
      config.transaction = transaction;
    }

    return await Wheelchair.update(payload, config);
  } catch (error) {
    const errObj = await errorFormat.sequelizeDB(error);
    throw new ErrorQueryException(errObj.metaData.message, errObj);
  }
};

module.exports = {
  findAll,
  count,
  findOne,
  create,
  update,
};
