import React, { useState } from "react";
import { XCircle } from "lucide-react";

const FollowUpModal = ({ isOpen, onClose, followUps = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!isOpen) return null;

  return (
    <>
      {/* Fondo con blur */}
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 max-w-5xl w-full shadow-lg relative overflow-auto max-h-[80vh]">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <XCircle size={24} />
          </button>
          <h2 className="text-xl font-semibold mb-4">Seguimientos Post-Adopción</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border border-gray-300 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Salud</th>
                  <th className="px-4 py-2">Nutrición</th>
                  <th className="px-4 py-2">Vínculo afectivo</th>
                  <th className="px-4 py-2">Convive con otras mascotas</th>
                  <th className="px-4 py-2">Comentarios</th>
                  <th className="px-4 py-2">Imágenes</th>
                </tr>
              </thead>
              <tbody>
                {followUps.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                      No hay seguimientos aún.
                    </td>
                  </tr>
                ) : (
                  followUps
                    .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
                    .map((item) => (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">{new Date(item.visitDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{item.petIsHealthy ? "Sí" : "No"}</td>
                        <td className="px-4 py-2">{item.hasProperNutrition ? "Sí" : "No"}</td>
                        <td className="px-4 py-2">{item.showsAffectionBond ? "Sí" : "No"}</td>
                        <td className="px-4 py-2">
                          {item.otherPetsAreFriendly !== null ? (item.otherPetsAreFriendly ? "Sí" : "No") : "N/A"}
                        </td>
                        <td className="px-4 py-2">{item.comments || "-"}</td>
                        <td className="px-4 py-2 flex gap-1 flex-wrap">
                          {(item.images || []).map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`seguimiento-${item.id}-${index}`}
                              className="w-12 h-12 object-cover rounded cursor-pointer"
                              onClick={() => setSelectedImage(url)}
                            />
                          ))}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="ampliada"
            className="max-w-full max-h-full rounded shadow-lg"
          />
        </div>
      )}
    </>
  );
};

export default FollowUpModal;



