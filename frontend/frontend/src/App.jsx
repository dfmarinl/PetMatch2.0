import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import AdminDashboard from "./Pages/AdminDashboard";
import PetRegistration from "./Pages/PetRegistration";
import PetsCatalog from "./Pages/PetsCatalog";
import ClientProfile from "./pages/ClientProfile";
import StaffProfile from "./pages/StaffProfile";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";

// Context para manejar el estado del usuario
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga inicial

  // Efecto para recuperar el usuario del localStorage al cargar la app
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
        // Limpiar datos corruptos
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Guardar en localStorage
    if (userData.token) {
      localStorage.setItem('token', userData.token);
      // Guardar usuario sin el token para evitar duplicación
      const { token, ...userWithoutToken } = userData;
      localStorage.setItem('user', JSON.stringify(userWithoutToken));
    } else {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    // Limpiar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Mostrar una pantalla de carga mínima mientras se verifica la autenticación
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
            <Route path="/reset-password" element={<ResetPasswordForm />} />

          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;