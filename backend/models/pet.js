const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pet = sequelize.define('Pet', {
  name: DataTypes.STRING,
  species: DataTypes.STRING,
  age: DataTypes.INTEGER,
  size: DataTypes.STRING,
  description: DataTypes.STRING,
  image: DataTypes.STRING,
  adopted: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Pet;
