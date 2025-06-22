import React from 'react';
import { X, MapPin, Heart, Phone, Mail, Calendar, Stethoscope, Shield, AlertTriangle } from 'lucide-react';

const PetDetailsModal = ({ isOpen, onClose, pet }) => {
  if (!isOpen || !pet) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'En proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Adoptado':
        return 'bg-blue-100 text-blue-800';
      case 'En cuidado médico':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Detalles de {pet.name}</h2>
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
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pet.status)}`}>
                      {pet.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">ID:</span>
                    <span className="text-sm text-gray-900">{pet.id}</span>
                  </div>
                </div>
              </div>

              {/* Información Principal */}
              <div className="lg:col-span-2 space-y-6">
                {/* Información Básica */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Nombre</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Tipo</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Raza</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.breed}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Edad</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.age}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Género</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Tamaño</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.size}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Peso</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.weight} kg</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Color</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.color}</p>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{pet.description}</p>
                </div>

                {/* Salud */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Información de Salud
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Estado de Salud</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.healthStatus}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Necesidades Especiales</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.specialNeeds || 'Ninguna'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <Shield className={`w-5 h-5 mr-2 ${pet.vaccinated ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="text-sm text-gray-700">
                            {pet.vaccinated ? 'Vacunado' : 'No vacunado'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Heart className={`w-5 h-5 mr-2 ${pet.sterilized ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="text-sm text-gray-700">
                            {pet.sterilized ? 'Esterilizado' : 'No esterilizado'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ubicación y Contacto */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Ubicación y Contacto
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{pet.location}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-gray-400 mr-3 flex items-center">
                        🏠
                      </div>
                      <span className="text-sm text-gray-900">{pet.contactInfo.shelter}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <a
                        href={`tel:${pet.contactInfo.phone}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {pet.contactInfo.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <a
                        href={`mailto:${pet.contactInfo.email}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {pet.contactInfo.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Fechas Importantes
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Fecha de Registro</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.dateAdded}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Última Actualización</label>
                      <p className="mt-1 text-sm text-gray-900">{pet.dateUpdated}</p>
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