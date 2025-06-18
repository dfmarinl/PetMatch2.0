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

router.post("/", verifyToken, authorizeRoles("administrador"), createUser);

router.get("/", verifyToken, authorizeRoles("administrador"), getAllUsers);

router.get(
  "/paginado",
  verifyToken,
  authorizeRoles("administrador"),
  getUsersPages
);

router.get("/:id", verifyToken, authorizeRoles("administrador"), getUserById);

router.put("/:id", verifyToken, authorizeRoles("administrador"), updateUser);

router.delete("/:id", verifyToken, authorizeRoles("administrador"), deleteUser);

module.exports = router;
