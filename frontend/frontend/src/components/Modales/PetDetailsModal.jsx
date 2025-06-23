import React from "react";
import { X, Calendar, Heart } from "lucide-react";

const PetDetailsModal = ({ isOpen, onClose, pet }) => {
  if (!isOpen || !pet) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (available) => {
    return available
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalles de {pet.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Imagen */}
              <div className="lg:col-span-1">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Estado:
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        pet.available
                      )}`}
                    >
                      {pet.available ? "Disponible" : "Adoptado"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      ID:
                    </span>
                    <span className="text-sm text-gray-900">{pet.id}</span>
                  </div>
                </div>
              </div>

              {/* Información Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Información Básica */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información Básica
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Nombre
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{pet.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Especie
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {pet.species}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Raza
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{pet.breed}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Edad
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {pet.age} año(s)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Género
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {pet.gender === "female" ? "Hembra" : "Macho"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Descripción
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {pet.description}
                  </p>
                </div>

                {/* Fechas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Fechas Importantes
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Fecha de Registro
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(pet.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Última Actualización
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(pet.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsModal;
