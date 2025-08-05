const { Sequelize } = require("sequelize");
require("dotenv").config({ path: "../.env" }); // o solo ".env" si está en la raíz

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Necesario para Railway
    },
  },
});

module.exports = sequelize;

