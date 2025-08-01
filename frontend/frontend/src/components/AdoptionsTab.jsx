import React from "react";

const AdoptionsTab = ({ pets, onFollowUp }) => {
  const adoptedPets = pets.filter((pet) => pet.available === false); // O pet.status === "adoptada"

  if (adoptedPets.length === 0) {
    return <p className="text-gray-600 mt-4">No hay mascotas adoptadas aún.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {adoptedPets.map((pet) => (
        <div key={pet.id} className="bg-white rounded-lg shadow p-4">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-48 object-cover rounded"
          />
          <h2 className="text-xl font-semibold mt-2">{pet.name}</h2>
          <p className="text-sm text-gray-600">{pet.breed}</p>
          <p className="text-sm text-gray-500">Edad: {pet.age}</p>
          <p className="text-green-600 font-medium mt-1">¡Adoptado!</p>

          <button
            onClick={() => onFollowUp(pet)}
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Hacer seguimiento
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdoptionsTab;

