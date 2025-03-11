const resFormat = require("../../utility/response-api");

// service
const wheelchairService = require("../service/wheelchair.service");

// get
const showAll = async (req, res, next) => {
  try {
    const data = await wheelchairService.getAll(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

// get
const showDetail = async (req, res, next) => {
  try {
    const data = await wheelchairService.getDetail(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

// create
const create = async (req, res, next) => {
  try {
    const data = await wheelchairService.create(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

// update
const update = async (req, res, next) => {
  try {
    const data = await wheelchairService.update(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

// delete
const Delete = async (req, res, next) => {
  try {
    const data = await wheelchairService.softDelete(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showAll,
  showDetail,
  create,
  update,
  Delete,
};
