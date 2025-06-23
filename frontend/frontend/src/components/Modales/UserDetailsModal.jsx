import React from 'react';
import { X, Mail, MapPin, Calendar, CreditCard } from 'lucide-react';

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const getFullName = () => `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Detalles del Usuario</h3>
          <button onClick={onClose}><X className="w-6 h-6 text-gray-500" /></button>
        </div>
        <div className="space-y-3">
          <div className="font-medium text-lg">{getFullName()}</div>
          <div className="text-sm text-gray-600 flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</div>
          <div className="text-sm text-gray-600 flex items-center gap-2"><CreditCard className="w-4 h-4" /> {user.identificationNumber}</div>
          <div className="text-sm text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4" /> {user.city}, {user.direction}</div>
          <div className="text-sm text-gray-600 flex items-center gap-2"><Calendar className="w-4 h-4" /> {user.age} años</div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
