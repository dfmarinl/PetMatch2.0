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
  petIsHealthy: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: "La mascota presenta buen estado de salud general.",
  },
  hasProperNutrition: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: "La mascota recibe alimentación adecuada.",
  },
  showsAffectionBond: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: "Se observa un vínculo afectivo entre el adoptante y la mascota.",
  },
  otherPetsAreFriendly: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: "Otras mascotas conviven de forma pacífica (si aplica).",
  },

  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Observaciones adicionales del seguimiento.",
  },
  image: {
    type: DataTypes.TEXT("long"), // Para cadenas Base64 largas
    allowNull: true,
    comment: "Base64-encoded image string",
  },
});

module.exports = AdoptionFollowUp;
