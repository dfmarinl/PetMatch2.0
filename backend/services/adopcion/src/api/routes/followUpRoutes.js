const express = require("express");
const router = express.Router();

const {
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
  getFollowUpsByAdoption,
  getFollowUpsByPetId,
  setFollowUpSuccess,
} = require("../views/followUpController");

const {
  verifyToken,
  authorizeRoles,
} = require("../../../../usuario/src/middleware/authentication");

router.post(
  "/followups",
  verifyToken,
  authorizeRoles("cliente"),
  createFollowUp
);

router.put(
  "/followups/:id",
  verifyToken,
  authorizeRoles("empleado", "administrador", "cliente"),
  updateFollowUp
);

router.delete(
  "/followups/:id",
  verifyToken,
  authorizeRoles("empleado", "administrador", "cliente"),
  deleteFollowUp
);

router.get(
  "/followups/byAdoption/:completedAdoptionId",
  verifyToken,
  authorizeRoles("empleado", "administrador", "cliente"),
  getFollowUpsByAdoption
);

router.get(
  "/followups/byPet/:petId",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  getFollowUpsByPetId
);

router.patch(
  "/followups/:id/success",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  setFollowUpSuccess
);

module.exports = router;
