const ErrorAuthenticationException = require('../../exception/error-authentication.exception').ErrorAuthenticationException;
const EncryptDecryptClass = require('../../utility/encrypt-decrypt');
const tokenService = require('./token.service');

const encryptDecrypt = new EncryptDecryptClass();

// repository
const repoAuth = require('../repository/auth.repository');

// login
const login = async (req) => {
    const body = req.body;
    const username = body.username;
    const password = body.password;

    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({ message: "Invalid request: Missing username or password" });
    }
    // get timezone from req header
    const timezone = req.get('timezone');
    const utcOffset = req.get('utc-offset');

    // 1. is email/phone exist
    if (!username || !password) {
        throw new ErrorAuthenticationException();
    }

    // 2. check credential is exist on db
    const encryptedUsername = encryptDecrypt.encrypt(username);
    const findData = await repoAuth.findLogin(encryptedUsername);
    if (!findData || findData.user_name !== username) {
        throw new ErrorAuthenticationException();
    }

    // 3. check is account active
    if (findData.account_status_id != 'ACT') {
        throw new ErrorAuthenticationException('Account inactive, please contact customer service for more information.');
    }

    // 4. wrong password
    const checkPassword = await encryptDecrypt.checkBcrypt(password, findData.pass_word);
    if (!checkPassword) {
        throw new ErrorAuthenticationException();
    }

    // 5. create token for redis (and response)
    const keyAccess = await tokenService.generateAccess(findData.account_id);
    const generatePublicToken = tokenService.generatePublicToken(keyAccess);

    // store token to redis
    let payloadRedis = {
        account_id: findData.account_id,
        role_id: findData.role_id,
        key: generatePublicToken.public_key,
        login_time: new Date().getTime(),
        refresh_token: new Date().getTime()
    };
    // await tokenService.storeTokenToRedis(keyAccess, payloadRedis);

    // 6. store last_login
    const data = { last_login: new Date() };
    const where = { account_id: findData.account_id };
    await repoAuth.update(data, where);

    return {
        name: findData.name,
        user_name: findData.user_name,
        role: findData.role.name,
        key: generatePublicToken.public_key,
        token: generatePublicToken.public_token,
        timezone: timezone,
        utcOffset: utcOffset
    };
};

// login
const validator = async (req) => {
    const user = req.user;

    // get timezone from req header
    const timezone = req.get('timezone');
    const utcOffset = req.get('utc-offset');

    // 1. check credential is exist on db
    const encryptedUsername = encryptDecrypt.encrypt(user.user_name);
    const findData = await repoAuth.findLogin(encryptedUsername);
    if (!findData || findData.user_name !== user.user_name) {
        throw new ErrorAuthenticationException();
    }

    // 2. check is account active
    if (findData.account_status_id != 'ACT') {
        throw new ErrorAuthenticationException('Account inactive, please contact customer service for more information.');
    }

    // 3. create token for redis (and response)
    const keyAccess = await tokenService.generateAccess(findData.account_id);
    const generatePublicToken = tokenService.generatePublicToken(keyAccess);

    // 4. store token to redis
    let payloadRedis = {
        account_id: findData.account_id,
        role_id: findData.role_id,
        key: generatePublicToken.public_key,
        login_time: new Date().getTime(),
        refresh_token: new Date().getTime()
    };
    await tokenService.storeTokenToRedis(keyAccess, payloadRedis);

    // 5. store last_login
    const data = { last_login: new Date() };
    const where = { account_id: findData.account_id };
    await repoAuth.update(data, where);

    return {
        name: findData.name,
        user_name: findData.user_name,
        role: findData.role.name,
        key: generatePublicToken.public_key,
        token: generatePublicToken.public_token,
        timezone: timezone,
        utcOffset: utcOffset
    };
};

// logout
const logout = async (req) => {
    // 1. get token
    const { key, tokenRemoveBearer } = await tokenService.getAuthAccount(req);

    // 2. remove token from redis
    return await tokenService.removeTokenFromRedis(tokenRemoveBearer, key);
};

module.exports = {
    login,
    validator,
    logout
};