const sequelize = require("../config/database");

const AdoptionFollowUp = require("./adoptionFollowUp");
const AdoptionRequest = require("./adoptionRequest");
const CompletedAdoption = require("./completedAdoption");
const Pet = require("./pet");
const User = require("./user");
const Notification = require("./Notification"); // ✅ Nuevo modelo

// =============== RELACIONES ===================

// 1. User ↔ AdoptionRequest (One-to-Many)
User.hasMany(AdoptionRequest, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});
AdoptionRequest.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: false },
});

// 2. Pet ↔ AdoptionRequest (One-to-Many)
Pet.hasMany(AdoptionRequest, {
  foreignKey: { name: "petId", allowNull: false },
  onDelete: "CASCADE",
});
AdoptionRequest.belongsTo(Pet, {
  foreignKey: { name: "petId", allowNull: false },
});

// 3. AdoptionRequest ↔ CompletedAdoption (One-to-Many)
AdoptionRequest.hasMany(CompletedAdoption, {
  foreignKey: { name: "adoptionRequestId", allowNull: false },
  onDelete: "CASCADE",
});
CompletedAdoption.belongsTo(AdoptionRequest, {
  foreignKey: { name: "adoptionRequestId", allowNull: false },
});

// 4. CompletedAdoption ↔ AdoptionFollowUp (One-to-Many)
CompletedAdoption.hasMany(AdoptionFollowUp, {
  foreignKey: { name: "completedAdoptionId", allowNull: false },
  onDelete: "CASCADE",
});
AdoptionFollowUp.belongsTo(CompletedAdoption, {
  foreignKey: { name: "completedAdoptionId", allowNull: false },
});

// 5. ✅ User ↔ Notification (One-to-Many)
User.hasMany(Notification, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});
Notification.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: false },
});

// ==============================================

module.exports = {
  sequelize,
  AdoptionFollowUp,
  AdoptionRequest,
  CompletedAdoption,
  Pet,
  User,
  Notification, // ✅ Incluye el modelo en la exportación
};
