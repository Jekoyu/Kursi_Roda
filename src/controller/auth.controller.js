const resFormat = require('../../utility/response-api');
const authService = require('../service/auth.service');

// login
const login = async (req, res, next) => {
    try {
        const data = await authService.login(req);
        return res.status(200).send(resFormat({ code: 200 }, data));
    } catch (error) {
        next(error);
    }
};

// validator
const validator = async (req, res, next) => {
    try {
        const data = await authService.validator(req);
        return res.status(200).send(resFormat({ code: 200 }, data));
    } catch (error) {
        next(error);
    }
};

// logout
const logout = async (req, res, next) => {
    try {
        await authService.logout(req);
        return res.status(200).send(resFormat({ code: 200 }, []));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    validator,
    logout
};