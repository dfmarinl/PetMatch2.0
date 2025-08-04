import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Play } from "lucide-react";
import { getUserById } from "../api/users";
import StatusUpdateModal from "./Modales/StatusUpdateModal";

const RequestsTab = ({ requests, loading, error, onUpdateStatus }) => {
  const [userInfoMap, setUserInfoMap] = useState({});
  const [modalRequestId, setModalRequestId] = useState(null);
  const [modalActionType, setModalActionType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const uniqueUserIds = [...new Set(requests.map((r) => r.userId))];
      const newUserInfo = {};

      for (const id of uniqueUserIds) {
        if (!userInfoMap[id]) {
          try {
            const user = await getUserById(id);
            newUserInfo[id] = user;
          } catch (err) {
            console.error(`Error al obtener usuario con ID ${id}:`, err);
          }
        }
      }

      setUserInfoMap((prev) => ({ ...prev, ...newUserInfo }));
    };

    if (requests?.length) fetchUsers();
  }, [requests]);

  const openModal = (requestId, actionType) => {
    setModalRequestId(requestId);
    setModalActionType(actionType);
    setShowModal(true);
  };

  const handleConfirmStatus = async (observations) => {
    if (!modalRequestId || !modalActionType) return;

    await onUpdateStatus(modalRequestId, modalActionType, observations);
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      suspended: "bg-purple-100 text-purple-800",
    };

    const statusLabels = {
      pending: "Pendiente",
      approved: "Aprobada",
      rejected: "Rechazada",
      suspended: "Suspendida",
    };

    return (
      <span
        className={`px-2 py-1 text-sm rounded ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  if (loading) return <div>Cargando solicitudes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      {requests.map((req) => {
        const user = userInfoMap[req.userId];

        return (
          <div key={req.id} className="bg-white p-4 rounded shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">Solicitud #{req.id}</h3>
              {getStatusBadge(req.adoptionStatus)}
            </div>

            <p>
              <strong>Mascota:</strong> {req.Pet?.name || "Desconocida"}
            </p>

            {req.Pet?.image && (
              <div className="my-2">
                <img
                  src={req.Pet.image}
                  alt={`Imagen de ${req.Pet.name}`}
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}

            {/* Aviso si la mascota ya fue adoptada */}
            {req.Pet?.available === false && (
              <div className="flex items-center gap-2 text-red-700 bg-red-100 px-3 py-2 rounded mb-2 text-sm font-medium">
                <AlertTriangle size={18} /> Mascota ya adoptada
              </div>
            )}

            <p>
              <strong>Motivo:</strong> {req.reasonForAdoption}
            </p>
            <p>
              <strong>¿Ha tenido mascotas?:</strong>{" "}
              {req.hadPetsBefore ? "Sí" : "No"}
            </p>
            <p>
              <strong>Tiempo diario disponible:</strong> {req.dailyTimeForPet}{" "}
              horas
            </p>
            <p>
              <strong>¿Vive solo?:</strong> {req.livesAlone ? "Sí" : "No"}
            </p>
            <p>
              <strong>¿Niños en casa?:</strong>{" "}
              {req.hasChildrenAtHome ? "Sí" : "No"}
            </p>
            <p>
              <strong>Tipo de residencia:</strong> {req.residenceType}
            </p>
            <p>
              <strong>¿Tiene otras mascotas?:</strong>{" "}
              {req.otherPetsAtHome ? "Sí" : "No"}
            </p>

            {req.observations && (
              <p className="text-sm mt-2 text-gray-600">
                <strong>Observaciones:</strong> {req.observations}
              </p>
            )}

            {user && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <h4 className="font-semibold mb-1">Información del usuario:</h4>
                <p>
                  <strong>Nombre:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong>Correo:</strong> {user.email}
                </p>
                <p>
                  <strong>Ciudad:</strong> {user.city}
                </p>
                <p>
                  <strong>Dirección:</strong> {user.direction}
                </p>
                <p>
                  <strong>Edad:</strong> {user.age}
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-2 mt-4">
              {req.adoptionStatus === "pending" && (
                <>
                  {req.Pet?.available ? (
                    <button
                      onClick={() => openModal(req.id, "approved")}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <CheckCircle size={16} /> Aprobar
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed"
                      title="La mascota ya no está disponible para adopción"
                    >
                      <CheckCircle size={16} /> Aprobar
                    </button>
                  )}

                  <button
                    onClick={() => openModal(req.id, "rejected")}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <XCircle size={16} /> Rechazar
                  </button>

                  <button
                    onClick={() => openModal(req.id, "suspended")}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    <AlertTriangle size={16} /> Suspender
                  </button>
                </>
              )}

              {req.adoptionStatus === "suspended" && (
                <button
                  onClick={() => openModal(req.id, "pending")}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Play size={16} /> Reactivar
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Modal de observaciones */}
      <StatusUpdateModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmStatus}
        actionType={modalActionType}
      />
    </div>
  );
};

export default RequestsTab;
