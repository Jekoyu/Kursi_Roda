const express = require("express");
const router = express.Router();

const requestValidation = require("../middleware/request-validation.middleware"); // validation request

const pathGroup = "wheelchair";

// controller
const wheelchairController = require("../src/controller/wheelchair.controller");

// validation
const wheelchairValidation = require("../src/validation/wheelchair.validation");

// route for getting all wheelchairs
router.get(`/${pathGroup}`, wheelchairController.showAll);

// route for getting wheelchair details by id
router.get(`/${pathGroup}/:id`, wheelchairController.detail);

// route for creating a wheelchair
router.post(
  `/${pathGroup}`,
  wheelchairValidation.create,
  requestValidation,
  wheelchairController.create
);

// route for updating wheelchair details by id
router.patch(
  `/${pathGroup}/:id`,
  wheelchairValidation.update,
  requestValidation,
  wheelchairController.update
);

// route for soft deleting a wheelchair by id
router.delete(`/${pathGroup}/:id`, wheelchairController.softDelete);

module.exports = router;
