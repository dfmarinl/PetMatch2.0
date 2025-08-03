const express = require("express");
const router = express.Router();

const {
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
  getFollowUpsByAdoption,
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

module.exports = router;
