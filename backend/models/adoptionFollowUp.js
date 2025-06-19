const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AdoptionFollowUp = sequelize.define("AdoptionFollowUp", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  visitDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  comments: {
    type: DataTypes.TEXT,
  },
});

module.exports = AdoptionFollowUp;
