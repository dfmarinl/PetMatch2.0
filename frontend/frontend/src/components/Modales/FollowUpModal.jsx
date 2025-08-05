import React, { useState } from "react";
import { XCircle, Check, X } from "lucide-react";
import { setFollowUpSuccessRequest } from "../../api/followUp";
import toast from "react-hot-toast";

const FollowUpModal = ({
  isOpen,
  onClose,
  adoption,
  followUps = [],
  loading = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatingFollowUp, setUpdatingFollowUp] = useState(null);
  const [followUpsState, setFollowUpsState] = useState(followUps);

  // Actualizar el estado local cuando cambien los followUps del prop
  React.useEffect(() => {
    setFollowUpsState(followUps);
  }, [followUps]);

  if (!isOpen) return null;

  const pet = adoption?.AdoptionRequest?.Pet;
  const user = adoption?.AdoptionRequest?.User;

  const renderHealthNutritionValue = (value) => {
    if (value === null) return "No aplica";
    return value ? "Aceptable" : "Mala";
  };

  const renderBooleanValue = (value) => {
    if (value === null) return "No aplica";
    return value ? "Sí" : "No";
  };

  const renderSuccessStatus = (isSuccessful) => {
    if (isSuccessful === null) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          En revisión
        </span>
      );
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isSuccessful
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isSuccessful ? "Satisfactorio" : "No satisfactorio"}
      </span>
    );
  };

  const handleUpdateSuccess = async (followUpId, isSuccessful) => {
    setUpdatingFollowUp(followUpId);

    try {
      await setFollowUpSuccessRequest(followUpId, isSuccessful);

      // Actualizar el estado local
      setFollowUpsState((prevFollowUps) =>
        prevFollowUps.map((followUp) =>
          followUp.id === followUpId ? { ...followUp, isSuccessful } : followUp
        )
      );

      toast.success(
        `Seguimiento marcado como ${
          isSuccessful ? "satisfactorio" : "no satisfactorio"
        }`
      );
    } catch (error) {
      console.error("Error al actualizar el estado del seguimiento:", error);
      toast.error("Error al actualizar el estado del seguimiento");
    } finally {
      setUpdatingFollowUp(null);
    }
  };

  return (
    <>
      {/* Fondo con blur */}
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 max-w-[90vw] w-full shadow-lg relative overflow-auto max-h-[85vh]">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
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

          {/* Consejo para las imágenes */}
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Consejo:</span> Haz clic en
              cualquier imagen de la tabla para verla en tamaño completo.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Cargando seguimientos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-auto max-h-[50vh]">
              <table className="w-full text-sm text-left border border-gray-300 rounded min-w-[1200px]">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 min-w-[100px] text-center">
                      Fecha
                    </th>
                    <th className="px-4 py-3 min-w-[90px] text-center">
                      Salud
                    </th>
                    <th className="px-4 py-3 min-w-[90px] text-center">
                      Nutrición
                    </th>
                    <th className="px-4 py-3 min-w-[100px] text-center">
                      Vínculo
                      <br />
                      afectivo
                    </th>
                    <th className="px-4 py-3 min-w-[120px] text-center">
                      Convive
                      <br />
                      pacíficamente
                      <br />
                      con otras mascotas
                    </th>
                    <th className="px-4 py-3 min-w-[200px] text-center">
                      Comentarios
                    </th>
                    <th className="px-4 py-3 min-w-[100px] text-center">
                      Imagen
                    </th>
                    <th className="px-4 py-3 min-w-[120px] text-center">
                      Estado del
                      <br />
                      reporte de
                      <br />
                      seguimiento
                    </th>
                    <th className="px-4 py-3 min-w-[80px] text-center">
                      ¿El reporte
                      <br />
                      fue
                      <br />
                      satisfactorio?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {followUpsState.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No hay seguimientos registrados aún.
                      </td>
                    </tr>
                  ) : (
                    followUpsState
                      .sort(
                        (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
                      )
                      .map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 align-top">
                            {new Date(item.visitDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.petIsHealthy === null
                                  ? "bg-gray-100 text-gray-600"
                                  : item.petIsHealthy
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {renderHealthNutritionValue(item.petIsHealthy)}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.hasProperNutrition === null
                                  ? "bg-gray-100 text-gray-600"
                                  : item.hasProperNutrition
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {renderHealthNutritionValue(
                                item.hasProperNutrition
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.showsAffectionBond === null
                                  ? "bg-gray-100 text-gray-600"
                                  : item.showsAffectionBond
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {renderBooleanValue(item.showsAffectionBond)}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.otherPetsAreFriendly === null
                                  ? "bg-gray-100 text-gray-600"
                                  : item.otherPetsAreFriendly
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {renderBooleanValue(item.otherPetsAreFriendly)}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top max-w-xs">
                            <div className="whitespace-pre-wrap break-words leading-relaxed">
                              {item.comments || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={`seguimiento-${item.id}`}
                                className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity border shadow-sm"
                                onClick={() => setSelectedImage(item.image)}
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-gray-400 text-xs text-center">
                                  Sin imagen
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 align-top">
                            {renderSuccessStatus(item.isSuccessful)}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() =>
                                  handleUpdateSuccess(item.id, true)
                                }
                                disabled={updatingFollowUp === item.id}
                                className="flex items-center justify-center px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Marcar como satisfactorio"
                              >
                                <Check size={12} />
                                <span className="ml-1">Sí</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateSuccess(item.id, false)
                                }
                                disabled={updatingFollowUp === item.id}
                                className="flex items-center justify-center px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Marcar como no satisfactorio"
                              >
                                <X size={12} />
                                <span className="ml-1">No</span>
                              </button>
                            </div>
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
