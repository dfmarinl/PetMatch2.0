// src/context/SocketContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket debe ser usado dentro de SocketProvider");
  return context;
};

export const SocketProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?.id) {
      const newSocket = io("https://petmatch2-0.onrender.com/", {
        query: { userId: user.id }, // Enviamos ID al conectar
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [user?.id]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
