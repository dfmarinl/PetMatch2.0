const sequelize = require("../config/database");
const Pet = require("./pet");
const User = require("./user");

module.exports = {
  sequelize,
  Pet,
  User,
};
