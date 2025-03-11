const express = require("express");
const router = express.Router();

const requestValidation = require("../middleware/request-validation.middleware"); // validation request

const pathGroup = "wheelchair";

// controller
const wheelchairController = require("../src/controller/wheelchair.controller");

// validation
const wheelchairValidation = require("../src/validation/wheelchair.validation");

router.get(`/${pathGroup}`, wheelchairController.showAll);

router.get(`/${pathGroup}/:id`, wheelchairController.showDetail);

router.post(
  `/${pathGroup}`,
  wheelchairValidation.create,
  requestValidation,
  wheelchairController.create
);

router.patch(
  `/${pathGroup}/:id`,
  wheelchairValidation.update,
  requestValidation,
  wheelchairController.update
);

router.delete(`/${pathGroup}/:id`, wheelchairController.Delete);

module.exports = router;
