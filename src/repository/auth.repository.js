const ErrorQueryException = require('../../exception/error-query.exception').ErrorQueryException;
const errorFormat = require('../../utility/error-format');

const EncryptDecryptClass = require('../../utility/encrypt-decrypt');

//mongo configuration
const mongoDb = require('../../database/mongo.connection');

// create main Model
const db = require('../../database/mysql.connection');
const Account = db.account;
const Role = db.role;
const AccountStatus = db.account_status;

// for login (check account)
const findLogin = async (account_credential) => {
    try {
        const encDec = new EncryptDecryptClass();
        const username = encDec.decrypt(account_credential);

        let config = {};
        config.where = {
            user_name: username
        };

        // table relation
        config.include = {
            model: Role,
            as: 'role',
            attributes: ['role_id', 'name', 'description']
        };

        return await Account.findOne(config);
    } catch (error) {
        const errObj = await errorFormat.sequelizeDB(error);
        throw new ErrorQueryException(errObj.metaData.message, errObj);
    }
};

// for auth check token
const getOne = async (where = {}, options = {}) => {
    try {
        const { attributes } = options;

        let config = {};
        config.where = { account_id: where };

        if (attributes) {
            config.attributes = attributes;
        }

        // table relation
        config.include = [
            {
                model: Role,
                as: 'role',
                attributes: ['role_id', 'name', 'description']
            },
            {
                model: AccountStatus,
                as: 'account_status',
                attributes: ['account_status_id', 'name', 'description']
            }
        ];

        return await Account.findOne(config);
    } catch (error) {
        const errObj = await errorFormat.sequelizeDB(error);
        throw new ErrorQueryException(errObj.metaData.message, errObj);
    }
};

// for update last_login on login process
const update = async (data = {}, where, options = {}) => {
    try {
        const { transaction } = options;

        let config = {
            where: where
        };

        if (transaction) config.transaction = transaction;

        return await Account.update(data, config);
    } catch (error) {
        const errObj = await errorFormat.sequelizeDB(error);
        throw new ErrorQueryException(errObj.metaData.message, errObj);
    }
};

// for forgot password (check account)
const findAccount = async (account_credential) => {
    try {
        const encDec = new EncryptDecryptClass();
        const email = encDec.decrypt(account_credential);

        let config = {};
        config.attributes;
        ['account_id'];
        config.where = { email: email };

        return await Account.findOne(config);
    } catch (error) {
        const errObj = await errorFormat.sequelizeDB(error);
        throw new ErrorQueryException(errObj.metaData.message, errObj);
    }
};

const create = async (data, transaction) => {
    try {
        let config = {};

        if (transaction) config.transaction = transaction;

        return await Account.create(data, config);
    } catch (error) {
        const errObj = await errorFormat.sequelizeDB(error);
        throw new ErrorQueryException(errObj.metaData.message, errObj);
    }
};

module.exports = {
    findLogin,
    getOne,
    update,
    findAccount,
    create
};