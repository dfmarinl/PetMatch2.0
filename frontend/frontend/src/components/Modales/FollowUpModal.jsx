import React, { useState } from "react";
import { XCircle } from "lucide-react";

const FollowUpModal = ({
  isOpen,
  onClose,
  adoption,
  followUps = [],
  loading = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!isOpen) return null;

  const pet = adoption?.AdoptionRequest?.Pet;
  const user = adoption?.AdoptionRequest?.User;

  const renderBooleanValue = (value) => {
    if (value === null) return "No aplica";
    return value ? "Sí" : "No";
  };

  return (
    <>
      {/* Fondo con blur */}
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 max-w-6xl w-full shadow-lg relative overflow-auto max-h-[80vh]">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <XCircle size={24} />
          </button>

          {/* Header con información de la mascota */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Seguimientos Post-Adopción
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={pet?.image}
                  alt={pet?.name}
                  className="w-16 h-16 object-cover rounded-full border"
                />
                <div>
                  <h3 className="text-lg font-bold">{pet?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {pet?.breed} ({pet?.species})
                  </p>
                  <p className="text-sm text-gray-600">
                    Adoptado por: {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Cargando seguimientos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-gray-300 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2">Salud</th>
                    <th className="px-4 py-2">Nutrición</th>
                    <th className="px-4 py-2">Vínculo afectivo</th>
                    <th className="px-4 py-2">
                      Convive pacíficamente con otras mascotas
                    </th>
                    <th className="px-4 py-2">Comentarios</th>
                    <th className="px-4 py-2">Imagen</th>
                  </tr>
                </thead>
                <tbody>
                  {followUps.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-4 text-center text-gray-500"
                      >
                        No hay seguimientos registrados aún.
                      </td>
                    </tr>
                  ) : (
                    followUps
                      .sort(
                        (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
                      )
                      .map((item) => (
                        <tr key={item.id} className="border-t border-gray-200">
                          <td className="px-4 py-2">
                            {new Date(item.visitDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            {renderBooleanValue(item.petIsHealthy)}
                          </td>
                          <td className="px-4 py-2">
                            {renderBooleanValue(item.hasProperNutrition)}
                          </td>
                          <td className="px-4 py-2">
                            {renderBooleanValue(item.showsAffectionBond)}
                          </td>
                          <td className="px-4 py-2">
                            {renderBooleanValue(item.otherPetsAreFriendly)}
                          </td>
                          <td className="px-4 py-2 max-w-xs">
                            <div className="truncate" title={item.comments}>
                              {item.comments || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={`seguimiento-${item.id}`}
                                className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setSelectedImage(item.image)}
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">
                                Sin imagen
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={selectedImage}
              alt="Imagen ampliada"
              className="max-w-full max-h-full rounded shadow-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FollowUpModal;
