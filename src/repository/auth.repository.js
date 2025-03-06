const User = require("../model/mysql/user.model");

class UserRepository {
  async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  async createUser(userData) {
    return await User.create(userData);
  }
}

module.exports = new UserRepository();
