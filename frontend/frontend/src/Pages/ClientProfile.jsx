import { useEffect, useState } from "react";
import {
  getMeRequest,
  updateProfileRequest,
  verifyCurrentPasswordRequest,
  updatePasswordRequest,
} from "../api/auth";
import UpdateProfileModal from "../components/Modales/UpdateProfileModal";
import UpdatePasswordModal from "../components/Modales/UpdatePasswordModal";
import { User, Settings, Lock, FileText, PawPrint, LogOut } from "lucide-react";
import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";

const ClientProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fetchUser = async () => {
    try {
      const data = await getMeRequest();
      setUserData(data);
    } catch (err) {
      setError("Error al obtener usuario");
      console.error("Error al obtener los datos del usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdate = async (updatedData) => {
    try {
      await updateProfileRequest(updatedData);
      await fetchUser();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error actualizando información:", err);
    }
  };

  if (loading)
    return <div className="text-center py-10">Cargando información...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Modales */}
      <UpdateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userData}
        onSave={handleUpdate}
      />

      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Header */}
      <header className="bg-[#1f2937] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/dog.png"
                alt="Logo"
                className="w-6 h-6 object-contain"
              />
              <span className="ml-2 text-xl font-bold text-white">
                PetMatch
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                title="Ir a Mi Perfil"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-white">
                  {userData.firstName || userData.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Volver atrás
          </button>
          <h1 className="text-2xl font-bold text-gray-900 text-center flex-1">
            Perfil de {userData.firstName}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-300 mb-8">
          {/* Información Personal */}
          <div className="mb-6 text-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6 text-primary-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-center">
              <p>
                <strong>ID:</strong> {userData.id}
              </p>
              <p>
                <strong>Nombre:</strong> {userData.firstName}{" "}
                {userData.lastName}
              </p>
              <p>
                <strong>Número de Identificación:</strong>{" "}
                {userData.identificationNumber}
              </p>
              <p>
                <strong>Edad:</strong> {userData.age}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Ciudad:</strong> {userData.city}
              </p>
              <p>
                <strong>Dirección:</strong> {userData.direction}
              </p>
              <p>
                <strong>Rol:</strong> {userData.rol}
              </p>
              <p className="md:col-span-2">
                <strong>Registrado:</strong>{" "}
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              <Settings className="w-6 h-6 mx-auto text-orange-500 mb-2" />
              <p className="font-medium text-gray-900">
                Actualizar Información Personal
              </p>
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              <Lock className="w-6 h-6 mx-auto text-blue-500 mb-2" />
              <p className="font-medium text-gray-900">Actualizar Contraseña</p>
            </button>
          </div>

          {/* Tabla de solicitudes */}
          <div className="border border-gray-300 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Solicitudes De Adopción Realizadas
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Mascota</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Motivo</th>
                    <th className="px-4 py-2">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.AdoptionRequests.map((req) => (
                    <tr key={req.id} className="border-t">
                      <td className="px-4 py-2">{req.id}</td>
                      <td className="px-4 py-2">{req.Pet.name}</td>
                      <td className="px-4 py-2">{req.adoptionStatus}</td>
                      <td className="px-4 py-2 truncate max-w-xs">
                        {req.reasonForAdoption}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla de mascotas adoptadas */}
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-center mb-4">
              <PawPrint className="w-6 h-6 text-purple-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Mascotas Adoptadas
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700 border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Especie</th>
                    <th className="px-4 py-2">Raza</th>
                    <th className="px-4 py-2">Edad</th>
                    <th className="px-4 py-2">Género</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.AdoptedPets.map((pet) => (
                    <tr key={pet.id} className="border-t">
                      <td className="px-4 py-2">{pet.id}</td>
                      <td className="px-4 py-2">{pet.name}</td>
                      <td className="px-4 py-2">{pet.species}</td>
                      <td className="px-4 py-2">{pet.breed}</td>
                      <td className="px-4 py-2">{pet.age}</td>
                      <td className="px-4 py-2">
                        {pet.gender === "female" ? "Hembra" : "Macho"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1f2937] text-gray-300 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-300">
          © 2025 PetMatch. Todos los derechos reservados. Desarrollado por el
          equipo de PetMatch.
        </div>
      </footer>
    </div>
  );
};

export default ClientProfile;
