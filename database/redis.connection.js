const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
  db: process.env.REDIS_DB,
});

redis.on("error", (err) => console.error("Redis Error: ", err));

module.exports = redis;
