const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AdoptionRequest = sequelize.define("AdoptionRequest", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reasonForAdoption: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  hadPetsBefore: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  dailyTimeForPet: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: "Estimated hours per day the user can dedicate to the pet",
  },
  livesAlone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  hasChildrenAtHome: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  residenceType: {
    type: DataTypes.ENUM("house", "apartment", "farm", "other"),
    allowNull: false,
  },
  otherPetsAtHome: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  adoptionStatus: {
    type: DataTypes.ENUM("pending", "approved", "rejected", "suspended"),
    allowNull: false,
    defaultValue: "pending",
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Comments from staff after reviewing the request",
  },
});

module.exports = AdoptionRequest;
