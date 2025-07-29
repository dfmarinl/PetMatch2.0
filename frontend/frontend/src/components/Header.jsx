import React from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getRoleLabel = (rol) => {
    if (rol === "administrador") return "Administrador";
    if (rol === "empleado") return "Empleado";
    return "Usuario";
  };

  return (
    <header className="bg-[#1f2937] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/dog.png" alt="Logo" className="w-6 h-6 object-contain" />
            <span className="ml-2 text-xl font-bold text-white">
              PetMatch {getRoleLabel(user?.rol)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="ml-auto">
                <NotificationBell   />
             </div>
            <div
              onClick={() =>
                user?.rol === "administrador" || user?.rol === "empleado"
                  ? navigate("/staff-profile")
                  : navigate("/profile")
              }
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              title="Ir a Mi Perfil"
            >
              
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
               
               <User className="w-4 h-4 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-white">
                {user?.firstName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
