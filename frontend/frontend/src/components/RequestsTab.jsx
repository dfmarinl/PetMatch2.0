import React from 'react';
import { Eye, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';

const RequestTab = () => {
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
    },
    {
      id: 4,
      petName: "Bella",
      applicantName: "Pedro Martínez",
      applicantEmail: "pedro@email.com",
      applicantPhone: "+58 424 111 2222",
      status: "Rechazada",
      dateSubmitted: "2024-01-12",
      priority: "Baja"
    },
    {
      id: 5,
      petName: "Rocky",
      applicantName: "Laura Fernández",
      applicantEmail: "laura@email.com",
      applicantPhone: "+58 426 333 4444",
      status: "Pendiente",
      dateSubmitted: "2024-01-11",
      priority: "Media"
    }
  ];

  // Función para obtener el color del estado de la solicitud
  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-red-100 text-red-800';
      case 'En revisión':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aprobada':
        return 'bg-green-100 text-green-800';
      case 'Rechazada':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener el color de la prioridad
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

  // Funciones para manejar acciones de solicitudes
  const handleApproveRequest = (requestId) => {
    console.log('Aprobar solicitud:', requestId);
    // Aquí iría la lógica para aprobar la solicitud
  };

  const handleRejectRequest = (requestId) => {
    console.log('Rechazar solicitud:', requestId);
    // Aquí iría la lógica para rechazar la solicitud
  };

  const handleViewRequestDetails = (requestId) => {
    console.log('Ver detalles de solicitud:', requestId);
    // Aquí iría la lógica para mostrar los detalles de la solicitud
  };

  // Estadísticas de solicitudes
  const requestStats = {
    total: adoptionRequests.length,
    pending: adoptionRequests.filter(r => r.status === 'Pendiente').length,
    inReview: adoptionRequests.filter(r => r.status === 'En revisión').length,
    approved: adoptionRequests.filter(r => r.status === 'Aprobada').length,
    rejected: adoptionRequests.filter(r => r.status === 'Rechazada').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Solicitudes de Adopción</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{requestStats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{requestStats.pending}</p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{requestStats.inReview}</p>
            <p className="text-sm text-gray-600">En Revisión</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{requestStats.approved}</p>
            <p className="text-sm text-gray-600">Aprobadas</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">{requestStats.rejected}</p>
            <p className="text-sm text-gray-600">Rechazadas</p>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                    <div className="text-sm font-medium text-gray-900">
                      {request.applicantName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.petName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center mb-1">
                      <Mail className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="truncate max-w-32" title={request.applicantEmail}>
                        {request.applicantEmail}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="w-4 h-4 mr-1 text-gray-400" />
                      {request.applicantPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRequestStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.dateSubmitted).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {request.status === 'Pendiente' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Aprobar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Rechazar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewRequestDetails(request.id)}
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

      {/* Empty State */}
      {adoptionRequests.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay solicitudes de adopción
          </h3>
          <p className="text-gray-500">
            Las solicitudes de adopción aparecerán aquí cuando los usuarios las envíen.
          </p>
        </div>
      )}
    </div>
  );
};

export default RequestTab;