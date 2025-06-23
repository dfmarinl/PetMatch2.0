import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Settings, LogOut, Bell, Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllPets } from '../api/pet';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getAllPets(token);
        setPets(data);
      } catch (error) {
        console.error('Error al obtener mascotas:', error);
      }
    };

    fetchPets();
  }, [token]);

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
              <span className="ml-2 text-xl font-bold text-gray-900">PetMatch</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || user?.email}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, {user?.name || 'Usuario'}!
          </h1>
          <p className="text-gray-600">
            Explora nuestras mascotas disponibles y encuentra a tu compañero perfecto.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar mascotas..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 mr-2 text-gray-400" />
              Filtros
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mascotas Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Solicitudes Activas</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Perfil Completado</p>
                <p className="text-2xl font-bold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pets Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mascotas Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
                    <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      {pet.species}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{pet.breed} • {pet.age || 'Edad no disponible'}</p>
                  <p className="text-gray-600 text-sm mb-4">{pet.description}</p>
                 <div className="flex flex-col sm:flex-row gap-2">
                <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
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
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                <Heart className="w-4 h-4 text-primary-500" />
              </div>
              <p className="font-medium text-gray-900">Mis Favoritos</p>
              <p className="text-sm text-gray-600">Ver mascotas guardadas</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <User className="w-4 h-4 text-green-500" />
              </div>
              <p className="font-medium text-gray-900">Mi Perfil</p>
              <p className="text-sm text-gray-600">Actualizar información</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <Settings className="w-4 h-4 text-orange-500" />
              </div>
              <p className="font-medium text-gray-900">Solicitudes</p>
              <p className="text-sm text-gray-600">Estado de adopciones</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Bell className="w-4 h-4 text-blue-500" />
              </div>
              <p className="font-medium text-gray-900">Notificaciones</p>
              <p className="text-sm text-gray-600">Configurar alertas</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
