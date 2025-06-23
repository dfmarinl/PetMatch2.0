import React, { useState, useEffect } from 'react';
import { getAllPets } from '../api/pet';
import { getAllUsers, deleteUser, updateUser } from '../api/users';

// Components
import Header from '../components/Header';
import NavigationTabs from '../components/NavigationTabs';
import OverviewTab from '../components/OverviewTab';
import PetsTab from '../components/PetsTab';
import RequestsTab from '../components/RequestsTab';
import UsersTab from '../components/UsersTab';

// Modals
import PetModal from '../components/Modales/PetModal';
import PetDetailsModal from '../components/Modales/PetDetailsModal';
import DeleteConfirmModal from '../components/Modales/DeleteConfirmModal';

import UserModal from '../components/Modales/UserModal';
import UserDetailsModal from '../components/Modales/UserDetailsModal';
import DeleteUserConfirmModal from '../components/Modales/DeleteUserConfirmModal';

const useAuth = () => ({
  user: { name: 'Admin', email: 'admin@petadopt.com' },
  logout: () => console.log('Logging out...')
});

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [apiPets, setApiPets] = useState([]);
  const [apiUsers, setApiUsers] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiUsersLoading, setApiUsersLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiUsersError, setApiUsersError] = useState(null);

  const [showPetModal, setShowPetModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchApiPets = async () => {
    setApiLoading(true);
    try {
      const response = await getAllPets();
      setApiPets(response || []);
    } catch (error) {
      setApiError('Error al cargar las mascotas desde la API');
      setApiPets([]);
    } finally {
      setApiLoading(false);
    }
  };

  const fetchApiUsers = async () => {
    setApiUsersLoading(true);
    try {
      const response = await getAllUsers();
      setApiUsers(response || []);
    } catch (error) {
      setApiUsersError('Error al cargar los usuarios desde la API');
      setApiUsers([]);
    } finally {
      setApiUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pets') fetchApiPets();
    else if (activeTab === 'users') fetchApiUsers();
  }, [activeTab]);

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
    try {
      // create or update logic here...
      setShowPetModal(false);
      if (activeTab === 'pets') await fetchApiPets();
    } catch (error) {
      console.error('Error submitting pet:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // delete logic here...
      setShowDeleteModal(false);
      setSelectedPet(null);
      await fetchApiPets();
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const handleUserSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
      }
      setShowUserModal(false);
      await fetchApiUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleConfirmDeleteUser = async () => {
    try {
      if (selectedUser) {
        await deleteUser(selectedUser.id);
        setSelectedUser(null);
        setShowDeleteUserModal(false);
        await fetchApiUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'overview' && (
          <OverviewTab pets={apiPets} users={apiUsers} />
        )}

        {activeTab === 'pets' && (
          <PetsTab
            pets={apiPets}
            loading={apiLoading}
            error={apiError}
            onCreatePet={handleCreatePet}
            onEditPet={handleEditPet}
            onViewPet={handleViewPet}
            onDeletePet={handleDeletePet}
            onRefresh={fetchApiPets}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterType={filterType}
            setFilterType={setFilterType}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        )}

        {activeTab === 'requests' && <RequestsTab />}

        {activeTab === 'users' && (
          <UsersTab
          users={apiUsers}
          loading={apiUsersLoading}
          error={apiUsersError}
          onRefresh={fetchApiUsers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          showUserModal={showUserModal}
          setShowUserModal={setShowUserModal}
          showUserDetailsModal={showUserDetailsModal}
          setShowUserDetailsModal={setShowUserDetailsModal}
          showDeleteUserModal={showDeleteUserModal}
          setShowDeleteUserModal={setShowDeleteUserModal}
        />

        )}
      </div>

      {/* Modals */}
      <PetModal
        isOpen={showPetModal}
        onClose={() => setShowPetModal(false)}
        onSubmit={handlePetSubmit}
        pet={selectedPet}
        loading={apiLoading}
      />

      <PetDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        pet={selectedPet}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        petId={selectedPet?.id}
        petName={selectedPet?.name || ''}
        onDeleted={handleConfirmDelete}
      />

      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSubmit={handleUserSubmit}
        user={selectedUser}
      />

      <UserDetailsModal
        isOpen={showUserDetailsModal}
        onClose={() => setShowUserDetailsModal(false)}
        user={selectedUser}
      />

      <DeleteUserConfirmModal
        isOpen={showDeleteUserModal}
        onClose={() => setShowDeleteUserModal(false)}
        userName={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
        onConfirm={handleConfirmDeleteUser}
      />
    </div>
  );
};

export default AdminDashboard;
