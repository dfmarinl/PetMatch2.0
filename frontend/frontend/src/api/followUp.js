import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/follow";

//Crear un seguimiento para una mascota adoptada
export const createFollowUp = async (followUpData) => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      completedAdoptionId: followUpData.completedAdoptionId,
      visitDate: followUpData.visitDate, // formato ISO, ej: "2025-08-02"
      petIsHealthy: followUpData.petIsHealthy,
      hasProperNutrition: followUpData.hasProperNutrition,
      showsAffectionBond: followUpData.showsAffectionBond,
      otherPetsAreFriendly: followUpData.otherPetsAreFriendly || null,
      comments: followUpData.comments || "",
      image: followUpData.image || "", // link a imagen (opcional)
    };

    const response = await axios.post(`${API_BASE_URL}/followups`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al crear el reporte de seguimiento:", error);
    throw error;
  }
};

//Obtener los seguimientos de una mascota según su id
export const getFollowUpsByPetIdRequest = async (petId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE_URL}/followups/byPet/${petId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener seguimientos por mascota:", error);
    throw error;
  }
};

//Establecer si la el seguimiento fue satisfactorio o no
export const setFollowUpSuccessRequest = async (followUpId, isSuccessful) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${API_BASE_URL}/followups/${followUpId}/success`,
      { isSuccessful }, // cuerpo de la petición
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al actualizar isSuccessful del seguimiento:", error);
    throw error;
  }
};
