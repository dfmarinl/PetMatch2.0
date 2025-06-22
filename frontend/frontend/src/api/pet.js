// api/pet.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/pets'; // Ajusta si tu backend usa un prefijo distinto

export const getAllPets = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las mascotas:', error);
    return [];
  }
};
