import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/users'; // Ajusta si tu backend tiene otro dominio o puerto

// Utilidad para agregar el token a las cabeceras
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

// 🔹 Crear usuario
export const createUser = async (data) => {
  try {
    console.log('Enviando datos al backend:', data);
    const response = await axios.post(API_BASE_URL, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

// 🔹 Obtener todos los usuarios (sin paginación)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// 🔹 Obtener usuarios paginados
export const getUsersPaginated = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginado?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios paginados:', error);
    throw error;
  }
};

// 🔹 Obtener un usuario por ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}:`, error);
    throw error;
  }
};

// 🔹 Actualizar usuario por ID
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, userData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${id}:`, error);
    throw error;
  }
};

// 🔹 Eliminar usuario por ID
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${id}:`, error);
    throw error;
  }
};
