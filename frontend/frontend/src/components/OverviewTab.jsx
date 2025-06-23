
// components/OverviewTab.jsx
import React from 'react';
import { CheckCircle, Clock, Users, Printer as PawPrint } from 'lucide-react';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';

const OverviewTab = ({ pets, users }) => {
  // Calculate stats
  const getAdoptedCount = (pets) => {
    return pets.filter(p => !p.available).length;
  };

  const stats = [
    {
      title: "Total Mascotas",
      value: pets.length.toString(),
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
      value: getAdoptedCount(pets).toString(),
      change: "+8",
      changeType: "positive",
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Usuarios Registrados",
      value: users.length > 0 ? users.length.toString() : "0",
      change: "+15",
      changeType: "positive",
      icon: Users,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="space-y-8">
      <StatsCards stats={stats} />
      <RecentActivity pets={pets} />
    </div>
  );
};

export default OverviewTab;