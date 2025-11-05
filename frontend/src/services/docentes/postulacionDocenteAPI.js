// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Función para hacer peticiones con autenticación
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token de acceso requerido');
  }

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
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

// API para postulaciones de docentes
export const postulacionDocenteAPI = {
  // Obtener todas las facultades disponibles
  getFacultades: async () => {
    return await apiRequest('/docentes/postulaciones/facultades');
  },

  // Obtener especialidades por facultad
  getEspecialidadesByFacultad: async (c_codfac) => {
    return await apiRequest(`/docentes/postulaciones/especialidades/${c_codfac}`);
  },

  // Obtener cursos por especialidad
  getCursosByEspecialidad: async (c_codfac, c_codesp) => {
    return await apiRequest(`/docentes/postulaciones/cursos/${c_codfac}/${c_codesp}`);
  },

  // Verificar si puede crear postulación para una especialidad
  verificarPostulacion: async (c_codfac, c_codesp) => {
    return await apiRequest(`/docentes/postulaciones/verificar/${c_codfac}/${c_codesp}`);
  },

  // Crear nueva postulación completa
  crearPostulacion: async (postulacionData) => {
    return await apiRequest('/docentes/postulaciones/crear', {
      method: 'POST',
      body: JSON.stringify(postulacionData)
    });
  }
};

export default postulacionDocenteAPI;
