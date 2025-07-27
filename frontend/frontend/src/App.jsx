
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import io from "socket.io-client";

// Tus páginas
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import PetRegistration from "./Pages/PetRegistration";
import PetsCatalog from "./Pages/PetsCatalog";
import ClientProfile from "./pages/ClientProfile";
import StaffProfile from "./pages/StaffProfile";
import ResetPasswordPage from "./Pages/ResetPasswordPage";

// Contexto de autenticación
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

// URL del backend
const SOCKET_URL = "http://localhost:3001"; // ajusta si tu backend está en otro puerto/URL

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);
          setUser({ ...userData, token: savedToken });
        }
      } catch (error) {
        console.error('Error recuperando datos de autenticación:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_URL, {
        auth: { token: user.token },
      });

      newSocket.on("connect", () => {
        console.log("🔌 Socket conectado:", newSocket.id);
      });

      newSocket.on("receiveNotification", (data) => {
        toast(data.message, {
          icon: "🔔",
        });
      });

      newSocket.on("disconnect", () => {
        console.log("🔌 Socket desconectado");
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem('token', userData.token);
      const { token, ...userWithoutToken } = userData;
      localStorage.setItem('user', JSON.stringify(userWithoutToken));
    } else {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    if (socket) {
      socket.disconnect();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/pets/new" element={<PetRegistration />} />
            <Route path="/pets" element={<PetsCatalog />} />
            <Route path="/profile" element={<ClientProfile />} />
            <Route path="/staff-profile" element={<StaffProfile />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
