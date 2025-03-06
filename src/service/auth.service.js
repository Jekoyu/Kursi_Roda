const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../../database/redis.connection");
const userRepository = require("../repository/auth.repository");
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  username: String,
  action: String,
  timestamp: Date,
});
const Log = mongoose.model("Log", logSchema);

class AuthService {
  async register(username, password) {
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.createUser({ username, password: hashedPassword });
    try {
      await Log.create({ username, action: "REGISTER", timestamp: new Date() });
    } catch (err) {
      console.error("❌ Failed to log to MongoDB:", err);
    }
    return { message: "User registered successfully" };
  }

  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user.id, username }, process.env.AES_KEY, {
      expiresIn: process.env.AUTH_TOKEN_EXPIRED_TIME_MINUTE * 60,
    });

    await redis.set(
      `auth:${user.id}`,
      token,
      "EX",
      process.env.AUTH_TOKEN_EXPIRED_TIME_MINUTE * 60
    );
    await Log.create({ username, action: "LOGIN", timestamp: new Date() });

    return { token };
  }

  async logout(userId) {
    await redis.del(`auth:${userId}`);
    return { message: "Logged out successfully" };
  }
}

module.exports = new AuthService();
