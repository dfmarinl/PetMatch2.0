import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { getUserById } from '../api/users';
import StatusUpdateModal from './Modales/StatusUpdateModal';

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
              <span className={`px-2 py-1 text-sm rounded 
                ${req.adoptionStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  req.adoptionStatus === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'}`}>
                {req.adoptionStatus}
              </span>
            </div>

            <p><strong>Mascota:</strong> {req.Pet?.name || 'Desconocida'}</p>
            <p><strong>Motivo:</strong> {req.reasonForAdoption}</p>
            <p><strong>¿Ha tenido mascotas?:</strong> {req.hadPetsBefore ? 'Sí' : 'No'}</p>
            <p><strong>Tiempo diario disponible:</strong> {req.dailyTimeForPet} horas</p>
            <p><strong>¿Vive solo?:</strong> {req.livesAlone ? 'Sí' : 'No'}</p>
            <p><strong>¿Niños en casa?:</strong> {req.hasChildrenAtHome ? 'Sí' : 'No'}</p>
            <p><strong>Tipo de residencia:</strong> {req.residenceType}</p>
            <p><strong>¿Tiene otras mascotas?:</strong> {req.otherPetsAtHome ? 'Sí' : 'No'}</p>

            {req.observations && (
              <p className="text-sm mt-2 text-gray-600">
                <strong>Observaciones:</strong> {req.observations}
              </p>
            )}

            {user && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <h4 className="font-semibold mb-1">Información del usuario:</h4>
                <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Correo:</strong> {user.email}</p>
                <p><strong>Ciudad:</strong> {user.city}</p>
                <p><strong>Dirección:</strong> {user.direction}</p>
                <p><strong>Edad:</strong> {user.age}</p>
              </div>
            )}

            {req.adoptionStatus === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openModal(req.id, 'approved')}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <CheckCircle size={16} /> Aprobar
                </button>
                <button
                  onClick={() => openModal(req.id, 'rejected')}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <XCircle size={16} /> Rechazar
                </button>
              </div>
            )}
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



