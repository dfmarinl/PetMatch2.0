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
  authorizeRoles("empleado", "administrador"),
  createFollowUp
);

router.put(
  "/followups/:id",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  updateFollowUp
);

router.delete(
  "/followups/:id",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  deleteFollowUp
);

router.get(
  "/followups/byAdoption/:completedAdoptionId",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  getFollowUpsByAdoption
);

module.exports = router;
