// components/PetsTab.jsx
import React from 'react';
import { Plus, BarChart3, XCircle } from 'lucide-react';
import SearchAndFilters from './SearchAndFilters';
import PetsTable from './PetsTable';

const PetsTab = ({ 
  pets, 
  loading, 
  error, 
  onCreatePet, 
  onEditPet, 
  onViewPet, 
  onDeletePet, 
  onRefresh,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  showFilters,
  setShowFilters
}) => {
  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Mascotas</h2>
        <div className="flex space-x-2">
          <button
            onClick={onRefresh}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            disabled={loading}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button
            onClick={onCreatePet}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Mascota
          </button>
        </div>
      </div>

      {/* API Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={onRefresh}
              className="ml-auto text-red-600 hover:text-red-800 underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterType={filterType}
        setFilterType={setFilterType}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        placeholder="Buscar mascotas..."
      />

      {/* Pets Table */}
      <PetsTable
        pets={pets}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        filterType={filterType}
        onCreatePet={onCreatePet}
        onEditPet={onEditPet}
        onViewPet={onViewPet}
        onDeletePet={onDeletePet}
      />
    </div>
  );
};

export default PetsTab;