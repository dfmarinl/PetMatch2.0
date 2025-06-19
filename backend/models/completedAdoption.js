const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CompletedAdoption = sequelize.define("CompletedAdoption", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  approvalDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
  },
});

module.exports = CompletedAdoption;
