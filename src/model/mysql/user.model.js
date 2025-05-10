const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/db.config");
const { v7: uuidv7 } = require("uuid");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv7,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = User;
