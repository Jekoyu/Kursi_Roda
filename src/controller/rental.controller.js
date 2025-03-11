const resFormat = require("../../utility/response-api");

// service
const rentalService = require("../service/rental.service");

// get
const showAll = async (req, res, next) => {
  try {
    const data = await rentalService.getAllRentals(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

// get
const showDetail = async (req, res, next) => {
  try {
    const data = await rentalService.getRentalDetail(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

// create
const create = async (req, res, next) => {
  try {
    const data = await rentalService.createRental(req);
    return res.status(201).send(resFormat({ code: 201 }, data)); // Status 201 for creation
  } catch (error) {
    next(error);
  }
};

// update
const update = async (req, res, next) => {
  try {
    const data = await rentalService.updateRental(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

// cancel
const cancel = async (req, res, next) => {
  try {
    const data = await rentalService.cancelRental(req);
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
  cancel,
};
