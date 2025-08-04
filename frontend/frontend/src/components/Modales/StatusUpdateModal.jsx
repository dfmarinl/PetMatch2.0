import React, { useState } from "react";
import { X } from "lucide-react";

const StatusUpdateModal = ({ isOpen, onClose, onConfirm, actionType }) => {
  const [observations, setObservations] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onConfirm(observations);
    setObservations("");
  };

  const getModalTitle = () => {
    switch (actionType) {
      case "approved":
        return "Aprobar solicitud";
      case "rejected":
        return "Rechazar solicitud";
      case "suspended":
        return "Suspender solicitud";
      case "pending":
        return "Reactivar solicitud";
      default:
        return "Actualizar solicitud";
    }
  };

  const getButtonColor = () => {
    switch (actionType) {
      case "approved":
        return "bg-green-600 hover:bg-green-700";
      case "rejected":
        return "bg-red-600 hover:bg-red-700";
      case "suspended":
        return "bg-purple-600 hover:bg-purple-700";
      case "pending":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">{getModalTitle()}</h2>

        <label className="block mb-2 font-medium">
          Observaciones (opcional):
        </label>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          className="w-full p-2 border rounded resize-none h-24"
          placeholder="Escribe tus comentarios aquí..."
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded text-white ${getButtonColor()}`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
