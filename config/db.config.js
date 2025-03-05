module.exports = {
    mysql: {
        HOST: process.env.MYSQL_HOST || '127.0.0.1',
        PORT: process.env.MYSQL_PORT || '3306',
        USERNAME: process.env.MYSQL_USER || 'root',
        PASSWORD: process.env.MYSQL_PASS || '',
        DB: process.env.MYSQL_DB || 'cybercampus',
        DIALECT: 'mysql',
        OPTIONS: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        LOGGING: console.log
    },
    redis: {
        HOST: process.env.REDIS_HOST || '127.0.0.1',
        PORT: process.env.REDIS_PORT || '3305',
        PASSWORD: process.env.REDIS_PASS || 'redis_pass',
        DB: process.env.REDIS_DB || 0
    },
    mongo: {
        uri: process.env.MONGO_URI || '',
    }
};
