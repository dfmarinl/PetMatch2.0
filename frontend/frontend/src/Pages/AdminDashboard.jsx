import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Settings, LogOut, Bell, Search, Filter, Plus, Edit, Trash2, Eye, Users, Printer as PawPrint, FileText, CheckCircle, XCircle, Clock, BarChart3, Calendar, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Datos de ejemplo
  const stats = [
    {
      title: "Total Mascotas",
      value: "156",
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
      value: "89",
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

  const recentPets = [
    {
      id: 1,
      name: "Luna",
      type: "Perro",
      breed: "Golden Retriever",
      age: "2 años",
      status: "Disponible",
      image: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=150",
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      name: "Milo",
      type: "Gato",
      breed: "Siamés",
      age: "1 año",
      status: "En proceso",
      image: "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=150",
      dateAdded: "2024-01-14"
    },
    {
      id: 3,
      name: "Max",
      type: "Perro",
      breed: "Labrador",
      age: "3 años",
      status: "Adoptado",
      image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=150",
      dateAdded: "2024-01-13"
    }
  ];

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'En proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Adoptado':
        return 'bg-blue-100 text-blue-800';
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
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
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
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-500" />
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
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('pets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pets'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mascotas
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Solicitudes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
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
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
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
                    {recentPets.map((pet) => (
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
              <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5 mr-2 text-gray-400" />
                  Filtros
                </button>
              </div>
            </div>

            {/* Pets Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  {recentPets.map((pet) => (
                    <tr key={pet.id} className="hover:bg-gray-50">
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
                          <button className="text-primary-600 hover:text-primary-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
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
                    <tr key={request.id} className="hover:bg-gray-50">
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
                          <button className="text-green-600 hover:text-green-900" title="Aprobar">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Rechazar">
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button className="text-primary-600 hover:text-primary-900" title="Ver detalles">
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
    </div>
  );
};

export default AdminDashboard;