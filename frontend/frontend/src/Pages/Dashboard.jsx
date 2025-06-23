import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";
import { Heart, User, LogOut, Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllPets } from "../api/pet";
import PetDetailsModal from "../components/Modales/PetDetailsModal";

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

  const openModal = (pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPet(null);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getAllPets(token);
        setPets(data);
        setFilteredPets(data);
      } catch (error) {
        console.error("Error al obtener mascotas:", error);
      }
    };

    fetchPets();
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

  const getGenderLabel = (gender) => {
    return gender === "male" ? "Macho" : "Hembra";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                PetMatch
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                title="Ir a Mi Perfil"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName || user?.email}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido(a), {user?.firstName || "Usuario"}!
          </h1>
          <p className="text-gray-600">
            Explora nuestras mascotas disponibles y encuentra a tu compañero
            perfecto.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, raza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas las especies</option>
              <option value="Perro">Perros</option>
              <option value="Gato">Gatos</option>
              <option value="Conejo">Conejos</option>
              <option value="Ave">Aves</option>
            </select>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos los géneros</option>
              <option value="male">Machos</option>
              <option value="female">Hembras</option>
            </select>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas las edades</option>
              <option value="young">Jóvenes (0-2 años)</option>
              <option value="adult">Adultos (3-6 años)</option>
              <option value="senior">Seniors (7+ años)</option>
            </select>
          </div>
          {(searchTerm || selectedSpecies || selectedGender || selectedAge) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                    Búsqueda: "{searchTerm}"
                  </span>
                )}
                {selectedSpecies && (
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                    Especie: {selectedSpecies}
                  </span>
                )}
                {selectedGender && (
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                    Género: {getGenderLabel(selectedGender)}
                  </span>
                )}
                {selectedAge && (
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">
                    Edad:{" "}
                    {selectedAge === "young"
                      ? "Jóvenes"
                      : selectedAge === "adult"
                      ? "Adultos"
                      : "Seniors"}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredPets.length} de {pets.length} mascotas
          </p>
        </div>

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
                  {pet.breed} • {pet.age || "Edad no disponible"}
                </p>
                <p className="text-gray-600 text-sm mb-4">{pet.description}</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => openModal(pet)}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Ver Detalles
                  </button>

                  <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                    Adoptar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <PetDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pet={selectedPet}
      />

      <footer className="bg-white border-t shadow-sm py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2025 PetMatch. Todos los derechos reservados. Desarrollado por el
          equipo de PetMatch.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
