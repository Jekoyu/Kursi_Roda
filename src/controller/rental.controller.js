const resFormat = require("../../utility/response-api");

// service
const rentalService = require("../service/rental.service");

// get all rentals (user's transactions)
const showAllRentals = async (req, res, next) => {
  try {
    const data = await rentalService.getAllRentals(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

// get rental detail
const rentalDetail = async (req, res, next) => {
  try {
    const data = await rentalService.getRentalDetail(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

// create rental transaction
const createRental = async (req, res, next) => {
  try {
    const data = await rentalService.createRental(req);
    return res.status(201).send(resFormat({ code: 201 }, data)); // Status 201 for creation
  } catch (error) {
    next(error);
  }
};

// update rental (return wheelchair)
const updateRental = async (req, res, next) => {
  try {
    const data = await rentalService.updateRental(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

// cancel rental transaction
const cancelRental = async (req, res, next) => {
  try {
    const data = await rentalService.cancelRental(req);
    return res.status(200).send(resFormat({ code: 200 }, data));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showAllRentals,
  rentalDetail,
  createRental,
  updateRental,
  cancelRental,
};
