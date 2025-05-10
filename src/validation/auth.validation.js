const { body } = require('express-validator');

// prettier-ignore
module.exports = {
    // login
    login: [
        body("username", "Must be filled").exists({ checkFalsy: true }),
        body("password", "Must be filled").exists({ checkFalsy: true }),
    ],

    // 1/3 forgot password (send otp)
    forgotPasswordRequest: [
        body("email", "Must be filled").exists({ checkFalsy: true }).
            isEmail().withMessage('Email must be email format!'),
    ],
    
    // 2/3 forgot password (verify otp)
    forgotPasswordVerify: [
        body("token", "Must be filled").exists({ checkFalsy: true }),
        body("code", "Must be filled").exists({ checkFalsy: true }).
            isInt().withMessage("Code must be number format!"),
    ],

    // 3/3 forgot password (change password)
    forgotPasswordChangePassword: [
        body("token", "Must be filled").exists({ checkFalsy: true }),
        body("password", "Must be filled").exists({ checkFalsy: true }).
            isLength({min: 8}).withMessage("Minimum password length is 8!").
            matches(/^\S*$/).withMessage('Password cannot contain spaces!'),
    ]
};