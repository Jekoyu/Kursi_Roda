const { body, param } = require("express-validator");
const STATUS = require("../constant/status-data.constant");

// repository
const rentalRepo = require("../repository/rental.repository");
const wheelchairRepo = require("../repository/wheelchair.repository");

// create rental validation
// prettier-ignore
const create = [
    body('customer_name', 'Name is required')
        .exists({ checkFalsy: true })
        .trim(),
    body('customer_phone', 'Phone number is required')
        .exists({ checkFalsy: true })
        .trim()
        .isNumeric().withMessage('Phone number must be numeric'),
    body('wheelchair_id', 'Wheelchair ID is required')
        .exists({ checkFalsy: true })
        .isInt().withMessage('Wheelchair ID must be an integer')
        .custom(async (value) => {
            const wheelchair = await wheelchairRepo.findOne({ id: value });
            if (!wheelchair) {
                throw new Error('Wheelchair not found');
            }
            if (!wheelchair.available) {
                throw new Error('Wheelchair is not available');
            }
            return true;
        }),
    body('return_date', 'Return date is required')
        .exists({ checkFalsy: true })
        .isDate().withMessage('Return date must be a valid date')
];

// update rental validation
// prettier-ignore
const update = [
  param("id", "Rental ID is required")
    .exists({ checkFalsy: true })
    .custom(async (value) => {
      const rental = await rentalRepo.findOne({ id: value });
      if (!rental) {
        throw new Error("Rental not found");
      }
      return true;
    }),

  body("return_date", "Return date is required")
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage("Return date must be a valid date (YYYY-MM-DD)"),
];

// cancel rental validation
// prettier-ignore
const cancel = [
    param('id', 'Rental ID is required')
        .exists({ checkFalsy: true })
        .custom(async (value) => {
            const rental = await rentalRepo.findOne({ id: value });
            if (!rental) {
                throw new Error('Rental not found');
            }
            return true;
        }),
    body('customer_phone', 'Phone number is required')
        .exists({ checkFalsy: true })
        .trim()
        .isNumeric().withMessage('Phone number must be numeric')
];

module.exports = {
  create,
  update,
  cancel,
};
