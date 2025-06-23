import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { getAllUsers, deleteUser, updateUser, createUser } from '../api/users';
import DeleteUserConfirmModal from './Modales/DeleteUserConfirmModal';
import UserModal from './Modales/UserModal';
import UserDetailsModal from './Modales/UserDetailsModal';

const UsersTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.identificationNumber?.toLowerCase().includes(term) ||
      user.city?.toLowerCase().includes(term) ||
      user.direction?.toLowerCase().includes(term)
    );
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteUserModal(true);
  };

  const handleConfirmDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteUserModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const handleUserSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
      };
      if (selectedUser) {
        await updateUser(selectedUser.id, payload);
      } else {
        await createUser(payload);
      }
      setShowUserModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Error guardando usuario:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <button
          onClick={handleAddUser}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" /> Agregar Usuario
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar usuarios..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          onClick={() => setSearchTerm('')}
          className="bg-gray-100 px-4 py-3 rounded-lg text-sm"
        >
          Limpiar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 text-center">Cargando usuarios...</div>
        ) : error ? (
          <div className="p-6 text-red-600 text-center">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6 text-center">No se encontraron usuarios.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Ciudad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Edad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Rol</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.city}</td>
                  <td className="px-6 py-4">{user.age}</td>
                  <td className="px-6 py-4">{user.rol}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleViewUser(user)} className="text-blue-600 hover:underline">
                      <Eye className="inline w-4 h-4" />
                    </button>
                    <button onClick={() => handleEditUser(user)} className="text-yellow-600 hover:underline">
                      <Edit className="inline w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteUser(user)} className="text-red-600 hover:underline">
                      <Trash2 className="inline w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
        onConfirm={handleConfirmDeleteUser}
        item={selectedUser}
      />
    </div>
  );
};

export default UsersTab;


