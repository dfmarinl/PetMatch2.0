const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotificationsByUserId,
  getNotificationsByRole,
  markAsRead,
} = require("../views/notificationController");

router.post("/", createNotification);
router.get("/:userId", getNotificationsByUserId);
router.get("/role/:role", getNotificationsByRole);
router.patch("/read/:notificationId", markAsRead);

module.exports = router;
