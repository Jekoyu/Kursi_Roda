"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Wheelchair extends Model {
    static associate(models) {
      this.hasMany(models.rental, {
        foreignKey: "wheelchair_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Wheelchair.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      brand: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: "wheelchair",
      tableName: "wheelchairs",
      timestamps: false,
    }
  );

  return Wheelchair;
};
