const { Notification } = require("../../../../../models");

// Crear notificación
const createNotification = async (req, res) => {
  try {
    const { userId, title, message } = req.body;
    const io = req.io || req.app.get("io"); // ← Obtén instancia de Socket.IO

    const notification = await Notification.create({
      userId,
      title,
      message,
      read: false,
    });

    // Emitir al canal del usuario si existe
    if (io && userId) {
      io.to(`user_${userId}`).emit("new_notification", notification);
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: "Error al crear notificación", details: err });
  }
};

// Obtener notificaciones por usuario
const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener notificaciones", details: err });
  }
};

// Marcar como leída
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByPk(notificationId);
    if (!notification) return res.status(404).json({ error: "No encontrada" });

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notificación marcada como leída" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar notificación", details: err });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markAsRead,
};
