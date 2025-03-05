const ErrorAuthenticationException = require('../../exception/error-authentication.exception').ErrorAuthenticationException;
const ErrorCodeException = require('../../exception/error-code.exception').ErrorCodeException;
const md5 = require('md5');
const uniqid = require('uniqid');
const EncryptDecryptClass = require('../../utility/encrypt-decrypt');
const redisClient = require('../../database/redis.connection');
const tokenConfig = require('../../config/token.config');

const TokenExpiredTime = tokenConfig.expired * 60; // 2 hari dalam detik

const generateAccess = async (text) => {
    return md5(text + new Date().getTime());
};

const generatePublicToken = (key_access) => {
    let encDec = new EncryptDecryptClass();
    const publicKey = uniqid.process(13);

    return {
        public_key: publicKey,
        public_token: encDec.encrypt(`${key_access}-${publicKey}`) // (account_id + datetime) + random public key
    };
};

const storeTokenToRedis = async (key, payload) => {
    try {
        await redisClient.set(key, JSON.stringify(payload), 'EX', TokenExpiredTime + 60); // redis TTL/exp = TokenExpiredTime + 60s

        return true;
    } catch (error) {
        throw new Error(error);
    }
};

const checkAuthToken = async (token, key) => {
    // 1. check valid token (is 'key' on header token match with header x-api-key?)
    const decToken = getAccessKey(token);
    if (decToken.public_key != key) {
        throw new ErrorAuthenticationException('Token expired or not authorized.');
    }

    // 2. get data token from redis (by akses_key)
    const getRecord = await redisClient.get(decToken.akses_key);
    if (getRecord === null) {
        throw new ErrorAuthenticationException('Token expired or not authorized.');
    }

    // 3. check key on redis (is 'key' on redis token match with header x-api-key?)
    const parseRecord = JSON.parse(getRecord);
    if (parseRecord.key != key) {
        throw new ErrorAuthenticationException('Token expired or not authorized.');
    }

    // 4. check token expired (if not, get refresh time)
    const refreshTokenTime = isExpired(parseRecord.refresh_token);

    // 5. store token to redis (generate refresh token)
    const payloadRefreshToken = {
        account_id: parseRecord.account_id,
        role_id: parseRecord.role_id,
        key: parseRecord.key,
        login_time: parseRecord.login_time,
        refresh_token: refreshTokenTime
    };
    await storeTokenToRedis(decToken.akses_key, payloadRefreshToken);

    return parseRecord.account_id;
};

const getAccessKey = (token) => {
    try {
        const encDec = new EncryptDecryptClass();
        const decodeToken = encDec.decrypt(token);
        const string = decodeToken.split('-');

        return {
            akses_key: string[0],
            public_key: string[1]
        };
    } catch (error) {
        throw new Error(error);
    }
};

const isExpired = (unixTimestamp) => {
    try {
        const currentMillis = new Date().getTime();

        // expiredTime = token created + 2 days (token exp)
        const expiredTime = parseInt(unixTimestamp) + TokenExpiredTime * 1000;

        // token expired
        if (currentMillis > expiredTime) {
            throw new ErrorAuthenticationException('Token expired!');
        }

        // curent millis (refresh time)
        return currentMillis;
    } catch (error) {
        throw new ErrorAuthenticationException('Token expired!');
    }
};

const getAuthAccount = async (req) => {
    // 1. check token on header 'Authorization' and 'x-api-key'
    const key = req.get('x-api-key');
    if (!req.get('Authorization') || !req.get('x-api-key')) {
        throw new ErrorAuthenticationException('Token not found!');
    }

    // 2. check token validation
    const tokenRemoveBearer = removeBearerPrefix(req.get('Authorization'));
    const account_id = await checkAuthToken(tokenRemoveBearer, key);
    if (!account_id) {
        throw new ErrorAuthenticationException('Token expired or not authorized.');
    }

    return {
        account_id,
        key,
        tokenRemoveBearer
    };
};

const removeTokenFromRedis = async (token, key) => {
    // 1. check valid token (is 'key' on header token match with header x-api-key?)
    const decToken = getAccessKey(token);
    if (decToken.public_key != key) {
        throw new ErrorAuthenticationException('Token expired or not authorized.');
    }

    // 2. delete token from redis
    const deleteRedis = await redisClient.del(decToken.akses_key);
    if (!deleteRedis) {
        throw new ErrorCodeException('Failed delete token!');
    }

    return deleteRedis;
};

const removeBearerPrefix = (tokenWithBearer) => {
    if (tokenWithBearer?.startsWith('Bearer ')) {
        const tokenWithoutBearer = tokenWithBearer.substr(7);

        return tokenWithoutBearer;
    } else {
        throw new ErrorAuthenticationException('Invalid Bearer token format!');
    }
};

module.exports = {
    isExpired,
    generateAccess,
    generatePublicToken,
    storeTokenToRedis,
    checkAuthToken,
    getAuthAccount,
    removeTokenFromRedis
};