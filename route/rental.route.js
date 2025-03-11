const express = require("express");
const router = express.Router();

const requestValidation = require("../middleware/request-validation.middleware"); // validation request

const pathGroup = "rental";

// Controller
const rentalController = require("../src/controller/rental.controller");

// Validasi
const rentalValidationRules = require("../src/validation/rental.validation");

router.get(`/${pathGroup}`, rentalController.showAll);

router.get(`/${pathGroup}/:id`, rentalController.showDetail);

router.post(
  `/${pathGroup}`,
  rentalValidationRules.create,
  requestValidation,
  rentalController.create
);

router.patch(
  `/${pathGroup}/:id`,
  rentalValidationRules.update,
  requestValidation,
  rentalController.update
);

router.delete(
  `/${pathGroup}/:id`,
  rentalValidationRules.cancel,
  requestValidation,
  rentalController.cancel
);

module.exports = router;
