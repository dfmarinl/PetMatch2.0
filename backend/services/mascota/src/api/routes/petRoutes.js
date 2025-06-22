const express = require("express");
const router = express.Router();
const {
  verifyToken,
  authorizeRoles,
} = require("../../../../usuario/src/middleware/authentication");

const {
  createPet,
  getAllPets,
  getPetsPages,
  getPetById,
  updatePet,
  deletePet,
} = require("../views/petController");

router.post(
  "/",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  createPet
);

router.get("/", getAllPets);

router.get("/paginado", getPetsPages);

router.get("/:id", getPetById);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  updatePet
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("empleado", "administrador"),
  deletePet
);

module.exports = router;
