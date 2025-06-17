const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUsersPages,
  getUserById,
  updateUser,
  deleteUser,
} = require("../views/userController");

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/paginado", getUsersPages);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
