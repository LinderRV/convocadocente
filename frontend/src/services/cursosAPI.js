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

// API para cursos
export const cursosAPI = {
  // Obtener todos los cursos con paginación
  getCursos: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) {
      params.append('search', search);
    }
    
    const url = `${API_BASE_URL}/cursos?${params.toString()}`;
    return makeRequest(url);
  },

  // Obtener estadísticas de cursos
  getCursosStats: async () => {
    const url = `${API_BASE_URL}/cursos/stats`;
    return makeRequest(url);
  },

  // Obtener un curso por ID
  getCursoById: async (id) => {
    const url = `${API_BASE_URL}/cursos/${id}`;
    return makeRequest(url);
  },

  // Cambiar estado de un curso (activar/desactivar)
  toggleCursoStatus: async (id) => {
    const url = `${API_BASE_URL}/cursos/${id}/status`;
    return makeRequest(url, {
      method: 'PATCH',
    });
  },
};

export default cursosAPI;
