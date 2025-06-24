import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { deletePetById } from "../../api/pet"; // Ajusta la ruta si es necesario

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  petId,
  petName,
  onDeleted, // función callback para notificar al padre
}) => {
  const [loading, setLoading] = useState(false);
  console.log("ID de la mascota a eliminar:", petId);
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deletePetById(petId);
      if (onDeleted) onDeleted(); // refrescar lista o mostrar mensaje en el padre
      onClose();
    } catch (error) {
      console.error("Error al eliminar la mascota:", error);
      // Aquí podrías mostrar un mensaje de error al usuario si lo deseas
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Confirmar Eliminación
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                ¿Estás seguro?
              </h3>
              <p className="text-sm text-gray-500">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-6">
            Estás a punto de eliminar a <strong>{petName}</strong> del sistema.
            Toda la información asociada se perderá permanentemente.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Advertencia
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Esta acción eliminará todos los datos de la mascota,
                  incluyendo historial médico y solicitudes de adopción
                  asociadas.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
