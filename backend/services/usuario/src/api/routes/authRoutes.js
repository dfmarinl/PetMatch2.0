const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  verifyCurrentPassword,
} = require("../views/authController");
const { verifyToken } = require("../../middleware/authentication");

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/verify-password", verifyToken, verifyCurrentPassword);

module.exports = router;
