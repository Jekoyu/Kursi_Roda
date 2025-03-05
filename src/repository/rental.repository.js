const ErrorQueryException =
  require("../../exception/error-query.exception").ErrorQueryException;
const errorFormat = require("../../utility/error-format");

const db = require("../../database/mysql.connection");
const Rental = db.rental;

const findAll = async (options, filter) => {
  try {
    const { pagination } = options;
    const { search = null } = filter;

    const config = {
      attributes: [
        "id",
        "wheelchair_id",
        "customer_name",
        "customer_phone",
        "rental_date",
        "return_date",
        "rental_price",
        "total_price",
        "status",
      ],
      include: [
        {
          model: db.wheelchair,
          as: "wheelchair",
          attributes: ["brand", "type"],
        },
      ],
      order: [["rental_date", "DESC"]],
      limit: pagination.limit,
      offset: pagination.offset,
    };

    if (search) {
      config.where = {
        [db.Op.or]: {
          "$wheelchair.brand$": {
            [db.Op.like]: `%${search}%`,
          },
          "$wheelchair.type$": {
            [db.Op.like]: `%${search}%`,
          },
          customer_name: {
            [db.Op.like]: `%${search}%`,
          },
          customer_phone: {
            [db.Op.like]: `%${search}%`,
          },
        },
      };
    }

    return await Rental.findAll(config);
  } catch (error) {
    const errObj = await errorFormat.sequelizeDB(error);
    throw new ErrorQueryException(errObj.metaData.message, errObj);
  }
};

const count = async (filter) => {
  try {
    const { search = null } = filter;

    const config = {
      include: [
        {
          model: db.wheelchair,
          as: "wheelchair",
          attributes: ["brand", "type"],
        },
      ],
    };

    if (search) {
      config.where = {
        [db.Op.or]: {
          "$wheelchair.brand$": {
            [db.Op.like]: `%${search}%`,
          },
          "$wheelchair.type$": {
            [db.Op.like]: `%${search}%`,
          },
          customer_name: {
            [db.Op.like]: `%${search}%`,
          },
          customer_phone: {
            [db.Op.like]: `%${search}%`,
          },
        },
      };
    }

    return await Rental.count(config);
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
        "wheelchair_id",
        "customer_name",
        "customer_phone",
        "rental_date",
        "return_date",
        "rental_price",
        "total_price",
        "status",
      ],
      include: [
        {
          model: db.wheelchair,
          as: "wheelchair",
          attributes: ["brand", "type"],
        },
      ],
      where: where,
    };

    return await Rental.findOne(config);
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

    return await Rental.create(payload, config);
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

    return await Rental.update(payload, config);
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
