// components/Header.jsx
import React from 'react';
import { Heart, User, Bell, LogOut } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-current" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">PetMatch Admin</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Admin - {user?.name || user?.email}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;