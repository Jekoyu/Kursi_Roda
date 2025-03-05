const { body, param } = require("express-validator");
const STATUS = require("../constant/status-data.constant");

// repository
const wheelchairRepo = require("../repository/wheelchair.repository");

// create data
// prettier-ignore
const create = [
    body('brand', 'Data is required')
        .exists({ checkFalsy: true })
        .trim(),
    body('type', 'Data is required')
        .exists({ checkFalsy: true })
        .trim(),
    body('price', 'Data is required')
        .exists({ checkFalsy: true })
        .isDecimal().withMessage('Price must be a decimal value!'),
    body('available', 'Data is required')
        .optional()
        .isBoolean().withMessage('Available must be a boolean value!')
];

// update data
// prettier-ignore
const update = [
    param('id', 'Data is required')
        .exists({ checkFalsy: true })
        .custom(async value => {
            const wheelchair = await wheelchairRepo.findOne({ id: value });
            if (!wheelchair) {
                throw new Error('Data not found!');
            }
            return true;
        }),
    body('brand', 'Data is required')
        .exists({ checkFalsy: true })
        .trim(),
    body('type', 'Data is required')
        .exists({ checkFalsy: true })
        .trim(),
    body('price', 'Data is required')
        .exists({ checkFalsy: true })
        .isDecimal().withMessage('Price must be a decimal value!'),
    body('available', 'Data is required')
        .optional()
        .isBoolean().withMessage('Available must be a boolean value!')
];

module.exports = {
  create,
  update,
};
