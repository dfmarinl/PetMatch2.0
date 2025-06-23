import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Cerrar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>

        {/* Título */}
        {title && <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>}

        {/* Contenido */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
