// URL base de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Función para obtener el token del localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función para hacer peticiones HTTP con headers de autenticación
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const requestOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// API para postulaciones
export const postulacionesAPI = {
  // Obtener todas las postulaciones con paginación
  getPostulaciones: async (page = 1, limit = 5) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const url = `${API_BASE_URL}/postulaciones?${params.toString()}`;
    return makeRequest(url);
  },

  // Actualizar estado de postulación (evaluar)
  updateEstado: async (id, estadoData) => {
    const url = `${API_BASE_URL}/postulaciones/${id}/estado`;
    return makeRequest(url, {
      method: 'PUT',
      body: JSON.stringify(estadoData),
    });
  },
};

export default postulacionesAPI;
