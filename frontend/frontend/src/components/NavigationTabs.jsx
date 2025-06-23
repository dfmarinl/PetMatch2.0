import React from 'react';
import {
  BarChart3,
  PawPrint,
  Users,
  FileText
} from 'lucide-react';

const NavigationTabs = ({ activeTab, setActiveTab, userRole }) => {
  return (
    <div className="flex space-x-4 mb-6 border-b pb-2">
      <button
        onClick={() => setActiveTab('overview')}
        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
          activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        <span>Resumen</span>
      </button>

      <button
        onClick={() => setActiveTab('pets')}
        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
          activeTab === 'pets' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
        }`}
      >
        <PawPrint className="w-4 h-4" />
        <span>Mascotas</span>
      </button>

      <button
        onClick={() => setActiveTab('requests')}
        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
          activeTab === 'requests' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
        }`}
      >
        <FileText className="w-4 h-4" />
        <span>Solicitudes</span>
      </button>

      {userRole !== 'empleado' && (
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
            activeTab === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Usuarios</span>
        </button>
      )}
    </div>
  );
};

export default NavigationTabs;
