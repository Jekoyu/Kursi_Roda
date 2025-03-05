"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rental extends Model {
    static associate(models) {
      this.belongsTo(models.wheelchair, {
        foreignKey: "wheelchair_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Rental.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      wheelchair_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      customer_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      customer_phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      rental_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      return_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rental_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Ongoing", "Completed", "Cancelled"),
        allowNull: false,
        defaultValue: "Pending",
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: "rental",
      tableName: "rentals",
      timestamps: false,
    }
  );

  return Rental;
};
