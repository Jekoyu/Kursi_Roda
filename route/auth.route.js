const express = require('express');
const router = express.Router();

const { tokenValidation } = require('../middleware/token-validation.middleware'); // auth
const requestValidation = require('../middleware/request-validation.middleware'); // validation request

const pathGroup = 'auth';

// controller
const authController = require('../src/controller/auth.controller');
const authValidationRules = require('../src/validation/auth.validation');
router.post(`/${pathGroup}/login`, authValidationRules.login, requestValidation, authController.login);
router.get(`/${pathGroup}/validator`, tokenValidation, authController.validator);
router.delete(`/${pathGroup}/logout`, tokenValidation, authController.logout);

module.exports = router;