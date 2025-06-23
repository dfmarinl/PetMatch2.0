import React from 'react';

const RecentActivity = ({
  allPetsForStats = [],
  adoptionRequests = [],
  getStatusColor,
  getDisplayStatus,
  getRequestStatusColor,
  getPriorityColor,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Mascotas recientes */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Mascotas Recientes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {allPetsForStats.slice(0, 5).map((pet) => (
              <div key={pet.id} className="flex items-center space-x-4">
                <img
                  src={pet.image || pet.imageUrl || '/placeholder-pet.jpg'}
                  alt={pet.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-pet.jpg';
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{pet.name}</p>
                  <p className="text-sm text-gray-500">
                    {pet.breed} • {pet.age}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pet.available)}`}>
                  {getDisplayStatus(pet.available)}
                </span>
              </div>
            ))}
          </div>
          {allPetsForStats.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No hay mascotas registradas</p>
            </div>
          )}
        </div>
      </div>

      {/* Solicitudes recientes */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Solicitudes Recientes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {adoptionRequests.slice(0, 5).map((request) => (
              <div key={request.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Usuario ID: {request.userId}
                  </p>
                  <p className="text-sm text-gray-500">
                    Solicita adoptar a {request.Pet?.name || 'Mascota desconocida'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRequestStatusColor(request.adoptionStatus)}`}>
                    {request.adoptionStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {adoptionRequests.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No hay solicitudes recientes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;


