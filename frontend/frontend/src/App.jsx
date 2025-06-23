import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import LandingPage from './Pages/LandingPage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import AdminDashboard from './Pages/AdminDashboard';
import PetRegistration from './Pages/PetRegistration';
import PetsCatalog from './Pages/PetsCatalog';



// Context para manejar el estado del usuario
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

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
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;