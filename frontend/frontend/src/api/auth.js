import axios from 'axios';

const API_URL ='http://localhost:3001';

// Iniciar sesión y guardar token
export const loginRequest = async (email,password) => {
  try {
    const response = await axios.post("http://localhost:3001/api/auth/login", {
      email,
      password
    });

    const { token } = response.data;

    // Guardar token en localStorage
    localStorage.setItem('token', token);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

// Obtener usuario actual con token
export const getMeRequest = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token no encontrado');

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuario');
  }
};

export const registerRequest = async (userData) => {
  try {
    const response = await axios.post("http://localhost:3001/api/auth/register", userData);

    const { token } = response.data;

    // Guardar token en localStorage
    localStorage.setItem('token', token);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al registrar usuario');
  }
};