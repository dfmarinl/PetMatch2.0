import React, { useState } from "react";
import FollowUpsModal from "./Modales/FollowUpModal"; // Asegúrate de tener este modal

const AdoptionsTab = ({ adoptions, loading, error }) => {
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewFollowUps = (adoption) => {
    setSelectedAdoption(adoption);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAdoption(null);
    setIsModalOpen(false);
  };

  if (loading) return <p>Cargando adopciones...</p>;
  if (error) return <p>Error al cargar las adopciones.</p>;
  if (!adoptions || adoptions.length === 0) return <p>No hay adopciones completadas.</p>;

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {adoptions.map((adoption) => {
          const request = adoption.AdoptionRequest;
          const pet = request?.Pet;
          const user = request?.User;

          return (
            <div
              key={adoption.id}
              className="border rounded-xl p-4 shadow-md bg-white"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={pet?.image}
                  alt={pet?.name}
                  className="w-20 h-20 object-cover rounded-full border"
                />
                <div>
                  <h2 className="text-lg font-bold">{pet?.name}</h2>
                  <p className="text-sm text-gray-600">
                    {pet?.breed} ({pet?.species})
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1 text-sm text-gray-800">
                <p>
                  <span className="font-semibold">Adoptante:</span>{" "}
                  {user?.firstName} {user?.lastName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {user?.email}
                </p>
                <p>
                  <span className="font-semibold">Fecha de aprobación:</span>{" "}
                  {new Date(adoption.approvalDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Fecha de entrega:</span>{" "}
                  {new Date(adoption.deliveryDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Notas:</span>{" "}
                  {adoption.notes || "Sin notas adicionales."}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleViewFollowUps(adoption)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >
                  Ver seguimiento
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para ver seguimientos */}
      {isModalOpen && selectedAdoption && (
        <FollowUpsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          adoption={selectedAdoption}
        />
      )}
    </>
  );
};

export default AdoptionsTab;






