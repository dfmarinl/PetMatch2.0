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
  getAllCompletedAdoptions,
  getCompletedAdoptionsPaginated,
  getCompletedAdoptionsByUserId,
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

router.get(
  "/completedAdoptions",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  getAllCompletedAdoptions
);

router.get(
  "/paginatedAdoptions/paginated",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  getCompletedAdoptionsPaginated
);

router.get(
  "/completedAdoptions/user/:userId",
  verifyToken,
  authorizeRoles("empleado", "administrador","cliente"),
  getCompletedAdoptionsByUserId
);
module.exports = router;
