const express = require("express");
const router = express.Router();
const {
  verifyToken,
  authorizeRoles,
} = require("../../middleware/authentication");

const {
  createUser,
  getAllUsers,
  getUsersPages,
  getUserById,
  updateUser,
  deleteUser,
} = require("../views/userController");

router.post("/", verifyToken, authorizeRoles("administrador","empleado"), createUser);

router.get("/", verifyToken, authorizeRoles("administrador","empleado"), getAllUsers);

router.get(
  "/paginado",
  verifyToken,
  authorizeRoles("administrador"),
  getUsersPages
);

router.get("/:id", verifyToken, authorizeRoles("administrador","empleado"), getUserById);

router.put("/:id", verifyToken, authorizeRoles("administrador","empleado"), updateUser);

router.delete("/:id", verifyToken, authorizeRoles("administrador","empleado"), deleteUser);

module.exports = router;
