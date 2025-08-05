// api/pet.js
import axios from 'axios';

const API_BASE_URL = 'https://petmatch2-0.onrender.com/api/pets'; // Ajusta si tu backend usa un prefijo distinto

export const getAllPets = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las mascotas:', error);
    return [];
  }
};

export const registerPet = async (petData) => {
  try {
    const token = localStorage.getItem('token');
    const payload = {
      name: petData.name,
      species: petData.species,
      breed: petData.breed || '',
      age: parseInt(petData.age, 10),
      gender: petData.gender,
      description: petData.description,
      available: petData.available,
      image: petData.image // solo link (ej: https://ejemplo.com/mascota.jpg)
    };

    const response = await axios.post(API_BASE_URL, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error al registrar la mascota:', error);
    throw error;
  }
};

export const deletePetById = async (petId) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.delete(`${API_BASE_URL}/${petId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error al eliminar la mascota:', error);
    throw error;
  }
};

export const updatePet = async (petId, updatedData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`https://petmatch2-0.onrender.com/api/pets/${petId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la mascota:', error);
    throw error;
  }
};