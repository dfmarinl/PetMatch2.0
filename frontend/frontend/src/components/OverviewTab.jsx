import React from 'react';
import { Users, PawPrint, ClipboardList } from 'lucide-react';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';

const OverviewTab = ({ pets, users, adoptionRequests }) => {
  // Estadísticas a mostrar en tarjetas
  const stats = [
    {
      title: 'Mascotas Registradas',
      value: pets?.length || 0,
      icon: PawPrint,
      color: 'bg-blue-500',
    },
    {
      title: 'Usuarios activos',
      value: users?.length || 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Solicitudes de adopción',
      value: adoptionRequests?.length || 0,
      icon: ClipboardList,
      color: 'bg-yellow-500',
    },
  ];

  // Funciones auxiliares
  const getStatusColor = (available) =>
    available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const getDisplayStatus = (available) => (available ? 'Disponible' : 'Adoptado');

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Tarjetas de estadísticas */}
      <StatsCards stats={stats} />

      {/* Actividad reciente */}
      <RecentActivity
        allPetsForStats={pets}
        adoptionRequests={adoptionRequests}
        getStatusColor={getStatusColor}
        getDisplayStatus={getDisplayStatus}
        getRequestStatusColor={getRequestStatusColor}
        getPriorityColor={() => 'text-gray-500'}
      />
    </div>
  );
};

export default OverviewTab;
