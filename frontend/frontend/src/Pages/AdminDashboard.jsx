import React, { useState } from 'react';
import { Heart, User, Bell, LogOut, Search, Filter, Plus, Edit, Trash2, Eye, Users, Printer as PawPrint, CheckCircle, XCircle, Clock, BarChart3, Mail, Phone } from 'lucide-react';
import { usePets } from '../hooks/usePets';
import PetModal from '../components/Modales/PetModal';
import PetDetailsModal from '../components/Modales/PetDetailsModal';
import DeleteConfirmModal from '../components/Modales/DeleteConfirmModal';

// Mock auth hook
const useAuth = () => ({
  user: { name: 'Admin', email: 'admin@petadopt.com' },
  logout: () => console.log('Logging out...')
});

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const {
    pets,
    allPets,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    createPet,
    updatePet,
    deletePet,
    getPetById
  } = usePets();

  const [activeTab, setActiveTab] = useState('overview');
  const [showPetModal, setShowPetModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Estadísticas calculadas
  const stats = [
    {
      title: "Total Mascotas",
      value: allPets.length.toString(),
      change: "+12",
      changeType: "positive",
      icon: PawPrint,
      color: "bg-blue-500"
    },
    {
      title: "Solicitudes Pendientes",
      value: "23",
      change: "+5",
      changeType: "positive",
      icon: Clock,
      color: "bg-yellow-500"
    },
    {
      title: "Adopciones Completadas",
      value: allPets.filter(p => p.status === 'Adoptado').length.toString(),
      change: "+8",
      changeType: "positive",
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Usuarios Registrados",
      value: "342",
      change: "+15",
      changeType: "positive",
      icon: Users,
      color: "bg-purple-500"
    }
  ];

  // Datos de solicitudes de adopción (mock)
  const adoptionRequests = [
    {
      id: 1,
      petName: "Luna",
      applicantName: "María García",
      applicantEmail: "maria@email.com",
      applicantPhone: "+58 412 123 4567",
      status: "Pendiente",
      dateSubmitted: "2024-01-15",
      priority: "Alta"
    },
    {
      id: 2,
      petName: "Milo",
      applicantName: "Carlos Rodríguez",
      applicantEmail: "carlos@email.com",
      applicantPhone: "+58 414 987 6543",
      status: "En revisión",
      dateSubmitted: "2024-01-14",
      priority: "Media"
    },
    {
      id: 3,
      petName: "Max",
      applicantName: "Ana López",
      applicantEmail: "ana@email.com",
      applicantPhone: "+58 416 555 1234",
      status: "Aprobada",
      dateSubmitted: "2024-01-13",
      priority: "Alta"
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const handleCreatePet = () => {
    setSelectedPet(null);
    setShowPetModal(true);
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setShowPetModal(true);
  };

  const handleViewPet = (pet) => {
    setSelectedPet(pet);
    setShowDetailsModal(true);
  };

  const handleDeletePet = (pet) => {
    setSelectedPet(pet);
    setShowDeleteModal(true);
  };

  const handlePetSubmit = async (formData) => {
    if (selectedPet) {
      await updatePet(selectedPet.id, formData);
    } else {
      await createPet(formData);
    }
    setShowPetModal(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedPet) {
      await deletePet(selectedPet.id);
      setShowDeleteModal(false);
      setSelectedPet(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'En proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Adoptado':
        return 'bg-blue-100 text-blue-800';
      case 'En cuidado médico':
        return 'bg-red-100 text-red-800';
      case 'Pendiente':
        return 'bg-red-100 text-red-800';
      case 'En revisión':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aprobada':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta':
        return 'text-red-600';
      case 'Media':
        return 'text-yellow-600';
      case 'Baja':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">PetAdopt Admin</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  3
                </span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Admin - {user?.name || user?.email}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('pets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mascotas
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Solicitudes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usuarios
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <span className={`ml-2 text-sm ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Pets */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Mascotas Recientes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {allPets.slice(0, 3).map((pet) => (
                      <div key={pet.id} className="flex items-center space-x-4">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{pet.name}</p>
                          <p className="text-sm text-gray-500">{pet.breed} • {pet.age}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pet.status)}`}>
                          {pet.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Requests */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Solicitudes Recientes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {adoptionRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{request.applicantName}</p>
                          <p className="text-sm text-gray-500">Solicita adoptar a {request.petName}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <p className={`text-xs mt-1 ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pets Tab */}
        {activeTab === 'pets' && (
          <div className="space-y-6">
            {/* Header with Search and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Mascotas</h2>
              <button
                onClick={handleCreatePet}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Mascota
              </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar mascotas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-5 h-5 mr-2 text-gray-400" />
                  Filtros
                </button>
              </div>

              {/* Filtros expandibles */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Todos los estados</option>
                        <option value="Disponible">Disponible</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Adoptado">Adoptado</option>
                        <option value="En cuidado médico">En cuidado médico</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Todos los tipos</option>
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setFilterStatus('all');
                          setFilterType('all');
                          setSearchTerm('');
                        }}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Limpiar Filtros
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pets Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Cargando mascotas...</p>
                </div>
              ) : pets.length === 0 ? (
                <div className="p-8 text-center">
                  <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron mascotas</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                      ? 'Intenta ajustar los filtros de búsqueda.' 
                      : 'Comienza agregando tu primera mascota.'}
                  </p>
                  {(!searchTerm && filterStatus === 'all' && filterType === 'all') && (
                    <button
                      onClick={handleCreatePet}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Agregar Primera Mascota
                    </button>
                  )}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mascota
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo/Raza
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Edad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Agregada
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pets.map((pet) => (
                      <tr key={pet.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={pet.image}
                              alt={pet.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pet.type}</div>
                          <div className="text-sm text-gray-500">{pet.breed}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pet.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pet.status)}`}>
                            {pet.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pet.dateAdded}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewPet(pet)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditPet(pet)}
                              className="text-gray-600 hover:text-gray-900 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePet(pet)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Solicitudes de Adopción</h2>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mascota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioridad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adoptionRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.applicantName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.petName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-1 text-gray-400" />
                          {request.applicantEmail}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="w-4 h-4 mr-1 text-gray-400" />
                          {request.applicantPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.dateSubmitted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Aprobar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Rechazar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gestión de Usuarios</h3>
              <p className="text-gray-500">
                Esta sección estará disponible próximamente para gestionar todos los usuarios registrados.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PetModal
        isOpen={showPetModal}
        onClose={() => setShowPetModal(false)}
        onSubmit={handlePetSubmit}
        pet={selectedPet}
        loading={loading}
      />

      <PetDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        pet={selectedPet}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        petName={selectedPet?.name || ''}
        loading={loading}
      />
    </div>
  );
};

export default AdminDashboard;