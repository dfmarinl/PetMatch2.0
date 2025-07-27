const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Ya no es obligatorio
    comment: "ID del usuario que recibe la notificación (null si es general)",
  },
  rol: {
    type: DataTypes.ENUM("administrador", "empleado", "cliente"),
    allowNull: true,
    
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Contenido de la notificación",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Tipo de notificación: aprobacion, rechazo, nuevaSolicitud, etc.",
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "Indica si la notificación ha sido leída",
  },
}, {
  timestamps: true,
});

module.exports = Notification;

