import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";
import {
  getNotificationsByUserId,
  getNotificationsByRole,
  markNotificationAsRead,
} from "../api/Notifications";
import { useAuth } from "../App";

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [fetchedNotifications, setFetchedNotifications] = useState([]);
  const { user } = useAuth();
  const socketRef = useRef(null);

  const allNotifications = [...fetchedNotifications];
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      let data = [];

      if (user.rol === "cliente") {
        data = await getNotificationsByUserId(user.id);
      } else if (user.rol === "administrador" || user.rol === "empleado") {
        data = await getNotificationsByRole(user.rol);
      }

      setFetchedNotifications(data);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Socket.IO para actualizaciones en tiempo real
  useEffect(() => {
    if (!user) return;

    socketRef.current = io("http://localhost:3001"); // cambia por la URL de tu backend en producción

    // Unirse a una sala basada en el rol o ID de usuario
    if (user.rol === "cliente") {
      socketRef.current.emit("join", `user_${user.id}`);
    } else {
      socketRef.current.emit("join", user.rol); // "administrador" o "empleado"
    }

    // Escuchar el evento personalizado
    socketRef.current.on("nuevaNotificacion", () => {
      fetchNotifications();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = async (id) => {
    const updated = await markNotificationAsRead(id);
    if (updated) {
      setFetchedNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative focus:outline-none"
        title="Notificaciones"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b font-bold text-gray-700">
            Notificaciones
          </div>
          {allNotifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              Sin notificaciones
            </div>
          ) : (
            allNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n.id)}
                className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-100 ${
                  n.isRead ? "text-gray-500" : "text-black font-medium"
                }`}
              >
                {n.message}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;





