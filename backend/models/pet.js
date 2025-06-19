const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pet = sequelize.define("Pet", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("male", "female"),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  image: {
    type: DataTypes.TEXT("long"), // Para cadenas Base64 largas
    allowNull: true,
    comment: "Base64-encoded image string",
  },
});

module.exports = Pet;
