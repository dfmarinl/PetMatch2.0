import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";

import { getAllPets } from "../api/pet";
import { getMeRequest } from "../api/auth";
import PetDetailsModal from "../components/Modales/PetDetailsModal";
import AdoptionRequestModal from "../components/Modales/AdoptionRequestModal";
import NotificationBell from "../components/NotificationBell";
import { Bell } from "lucide-react";




const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");

  const [selectedPet, setSelectedPet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);
  const [petToAdopt, setPetToAdopt] = useState(null);

  const [userData, setUserData] = useState(null);

  const socket = useRef(null);

  // Conexión a Socket.IO
  
useEffect(() => {
  if (!user?.id) return;

  socket.current = io("https://petmatch2-0.onrender.com/");

  socket.current.emit("join", user.id);

  socket.current.on("nuevaNotificacion", ({ notification }) => {
    const { message } = notification;

    toast.custom((t) => (
      <div
        className={`max-w-sm w-full bg-white border-l-4 border-blue-500 shadow-lg rounded-lg p-4 flex gap-4 transition-all duration-300 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <div className="flex items-start justify-center pt-1">
          <Bell className="text-blue-600" size={24} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-800">Notificación</h4>
          <p className="text-sm text-gray-600 mt-1 leading-snug">
            {message}
          </p>
        </div>
      </div>
    ));

    console.log("📨 Notificación recibida:", notification);
     setTimeout(() => {
        navigate("/dashboard");
      }, 3000);

  });

  return () => {
    socket.current.disconnect();
  };
}, [user]);

  const openModal = (pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPet(null);
    setIsModalOpen(false);
  };

  const openAdoptionModal = (pet) => {
    setPetToAdopt(pet);
    setIsAdoptionModalOpen(true);
  };

  const closeAdoptionModal = () => {
    setPetToAdopt(null);
    setIsAdoptionModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const hasSentRequest = (petId) => {
    return userData?.AdoptionRequests?.some((req) => req.petId === petId);
  };

  useEffect(() => {
    const fetchPetsAndUser = async () => {
      try {
        const petsData = await getAllPets(token);
        const userInfo = await getMeRequest(token);
        setPets(petsData);
        setFilteredPets(petsData);
        setUserData(userInfo);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchPetsAndUser();
  }, [token]);

  useEffect(() => {
    let filtered = pets;

    if (searchTerm) {
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecies) {
      filtered = filtered.filter((pet) => pet.species === selectedSpecies);
    }

    if (selectedGender) {
      filtered = filtered.filter((pet) => pet.gender === selectedGender);
    }

    if (selectedAge) {
      if (selectedAge === "young") {
        filtered = filtered.filter((pet) => pet.age <= 2);
      } else if (selectedAge === "adult") {
        filtered = filtered.filter((pet) => pet.age > 2 && pet.age <= 6);
      } else if (selectedAge === "senior") {
        filtered = filtered.filter((pet) => pet.age > 6);
      }
    }

    setFilteredPets(filtered);
  }, [searchTerm, selectedSpecies, selectedGender, selectedAge, pets]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecies("");
    setSelectedGender("");
    setSelectedAge("");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
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
              <div className="ml-auto">
                <NotificationBell   />
             </div>
              <div
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                title="Ir a Mi Perfil"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-white">
                  {user?.firstName || user?.email}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre, raza o descripción"
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
          >
            <option value="">Todas las especies</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
          >
            <option value="">Todos los géneros</option>
            <option value="male">Macho</option>
            <option value="female">Hembra</option>
          </select>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
          >
            <option value="">Todas las edades</option>
            <option value="young">Joven (≤2 años)</option>
            <option value="adult">Adulto (3-6 años)</option>
            <option value="senior">Mayor (>6 años)</option>
          </select>
        </div>

        <div className="mb-6">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Lista de mascotas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {pet.name}
                  </h3>
                  <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    {pet.species}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {pet.breed} • {pet.age + " años" || "Edad no disponible"}
                </p>
                <p className="text-gray-600 text-sm mb-4">{pet.description}</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => openModal(pet)}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Ver Detalles
                  </button>
                  {!pet.available ? (
                    <span className="flex-1 text-center bg-red-100 text-red-600 py-2 px-4 rounded-lg cursor-not-allowed">
                      Ya adoptado
                    </span>
                  ) : hasSentRequest(pet.id) ? (
                    <span className="flex-1 text-center bg-yellow-100 text-yellow-600 py-2 px-4 rounded-lg cursor-not-allowed">
                      Ya enviaste solicitud
                    </span>
                  ) : (
                    <button
                      onClick={() => openAdoptionModal(pet)}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Adoptar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modales */}
      <PetDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pet={selectedPet}
      />

      <AdoptionRequestModal
        isOpen={isAdoptionModalOpen}
        onClose={closeAdoptionModal}
        pet={petToAdopt}
        user={user}
        navigate={navigate}
      />

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

export default Dashboard;
