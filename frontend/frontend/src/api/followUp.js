import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/follow";

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
