const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotificationsByUserId,
  markAsRead,
} = require("../views/notificationController");

router.post("/", createNotification);
router.get("/:userId", getNotificationsByUserId);
router.patch("/read/:notificationId", markAsRead);

module.exports = router;
