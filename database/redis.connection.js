const IORedis = require('ioredis');
const dbConfig = require('../config/db.config')['redis'];

// Konfigurasi Redis
const redisConfig = {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    password: dbConfig.PASSWORD,
    db: dbConfig.DB
};

const redis = new IORedis(redisConfig);

redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
});

module.exports = redis;
