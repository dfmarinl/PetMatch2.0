import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/notificaciones";

// Obtener todas las notificaciones de un usuario
export const getNotificationsByUserId = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return [];
  }
};

// Crear una nueva notificación
export const createNotification = async (notificationData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_BASE_URL, notificationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear notificación:", error);
    throw error;
  }
};

// Marcar una notificación como leída
export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/read/${notificationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al marcar la notificación como leída:", error);
    throw error;
  }
};
