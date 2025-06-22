import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Filter, ArrowLeft, MapPin, Calendar, User, Phone, Mail } from 'lucide-react';
import { getAllPets } from '../api/pet'; // Importa la función que usa Axios

const PetsCatalog = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAge, setSelectedAge] = useState('');

  useEffect(() => {
    const loadPets = async () => {
      setLoading(true);
      const data = await getAllPets();
      setPets(data);
      setFilteredPets(data);
      setLoading(false);
    };

    loadPets();
  }, []);

  useEffect(() => {
    let filtered = pets;

    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecies) {
      filtered = filtered.filter(pet => pet.species === selectedSpecies);
    }

    if (selectedGender) {
      filtered = filtered.filter(pet => pet.gender === selectedGender);
    }

    if (selectedAge) {
      if (selectedAge === 'young') {
        filtered = filtered.filter(pet => pet.age <= 2);
      } else if (selectedAge === 'adult') {
        filtered = filtered.filter(pet => pet.age > 2 && pet.age <= 6);
      } else if (selectedAge === 'senior') {
        filtered = filtered.filter(pet => pet.age > 6);
      }
    }

    setFilteredPets(filtered);
  }, [searchTerm, selectedSpecies, selectedGender, selectedAge, pets]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecies('');
    setSelectedGender('');
    setSelectedAge('');
  };

  const getGenderLabel = (gender) => {
    return gender === 'male' ? 'Macho' : 'Hembra';
  };

  const getAgeGroup = (age) => {
    if (age <= 2) return 'Joven';
    if (age <= 6) return 'Adulto';
    return 'Senior';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mascotas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">PetMatch</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-primary-500 px-3 py-2 text-sm font-medium transition-colors">Iniciar Sesión</Link>
              <Link to="/register" className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">Registrarse</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mascotas Disponibles para Adopción</h1>
          <p className="text-gray-600">Encuentra a tu compañero perfecto entre nuestras {filteredPets.length} mascotas disponibles.</p>
        </div>

        {/* Filtros */}
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
                {searchTerm && <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">Búsqueda: "{searchTerm}"</span>}
                {selectedSpecies && <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">Especie: {selectedSpecies}</span>}
                {selectedGender && <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">Género: {getGenderLabel(selectedGender)}</span>}
                {selectedAge && <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm">Edad: {selectedAge === 'young' ? 'Jóvenes' : selectedAge === 'adult' ? 'Adultos' : 'Seniors'}</span>}
              </div>
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Limpiar filtros</button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-600">Mostrando {filteredPets.length} de {pets.length} mascotas</p>
        </div>

        {/* Resultados */}
        {filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron mascotas</h3>
            <p className="text-gray-500 mb-4">Intenta ajustar tus filtros de búsqueda</p>
            <button onClick={clearFilters} className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">Ver todas las mascotas</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredPets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                <div className="relative">
                  <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      pet.species === 'Perro' ? 'bg-blue-100 text-blue-700' :
                      pet.species === 'Gato' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>{pet.species}</span>
                  </div>
                  <button className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
                    <span className="text-sm text-gray-500">{getAgeGroup(pet.age)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span>{pet.breed}</span>
                    <span className="mx-2">•</span>
                    <span>{pet.age} {pet.age === 1 ? 'año' : 'años'}</span>
                    <span className="mx-2">•</span>
                    <span>{getGenderLabel(pet.gender)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{pet.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pet.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Agregado {new Date(pet.createdAt).toLocaleDateString()}</span>

                    </div>
                    <button className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary-500 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">¿Encontraste a tu compañero ideal?</h2>
          <p className="text-primary-100 mb-6">Regístrate para comenzar el proceso de adopción y darle un hogar lleno de amor.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-500 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">Comenzar Adopción</Link>
            <div className="flex items-center justify-center space-x-4 text-primary-100">
              <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /><span>+58 412 123 4567</span></div>
              <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /><span>info@petadopt.com</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PetsCatalog;
