const ErrorAuthenticationException = require('../../exception/error-authentication.exception').ErrorAuthenticationException;
const ErrorCodeException = require('../../exception/error-code.exception').ErrorCodeException;
const md5 = require('md5');
const uniqid = require('uniqid');
const EncryptDecryptClass = require('../../utility/encrypt-decrypt');
const redisClient = require('../../database/redis.connection');
const tokenConfig = require('../../config/token.config');

const TokenExpiredTime = tokenConfig.expired * 60; // 2 hari dalam detik

const storeTokenToRedis = async (key, accountId, token) => {
    try {
        const data = {
            account_id: accountId,
            login_time: Date.now(), 
            refresh_token: Date.now() 
        };

        await redisClient.set(key, JSON.stringify(data), 'EX', TokenExpiredTime + 60);
        return true;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    storeTokenToRedis,
};
