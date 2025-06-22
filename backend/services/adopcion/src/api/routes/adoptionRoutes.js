const express = require("express");
const router = express.Router();
const {
  createAdoptionRequest,
  updateAdoptionRequestStatus,
  getAllRequests,
  getRequestsByUser,
  getCompletedAdoptionsByUser,
  deleteAdoptionRequest,
  getRequestsPaginated,
} = require("../views/adoptionController");
const {
  verifyToken,
  authorizeRoles,
} = require("../../../../usuario/src/middleware/authentication");

router.post("/", verifyToken, authorizeRoles("cliente"), createAdoptionRequest);

router.put(
  "/updateStatus/:id",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  updateAdoptionRequestStatus
);

router.get(
  "/all",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  getAllRequests
);

router.get(
  "/user",
  verifyToken,
  authorizeRoles("cliente", "empleado", "administrador"),
  getRequestsByUser
);

router.get(
  "/user/completed",
  verifyToken,
  authorizeRoles("cliente", "empleado", "administrador"),
  getCompletedAdoptionsByUser
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("cliente"),
  deleteAdoptionRequest
);

router.get(
  "/paginated",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  getRequestsPaginated
);

module.exports = router;
