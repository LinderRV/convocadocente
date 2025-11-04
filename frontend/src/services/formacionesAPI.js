// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Función para hacer peticiones con autenticación
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
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

// API para formaciones académicas
export const formacionesAPI = {
  // Obtener todas las formaciones del docente
  getFormaciones: async (page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    return await apiRequest(`/docentes/formaciones?${params}`);
  },

  // Obtener formación por ID
  getFormacionById: async (id) => {
    return await apiRequest(`/docentes/formaciones/${id}`);
  },

  // Crear nueva formación académica
  createFormacion: async (formacionData) => {
    return await apiRequest('/docentes/formaciones', {
      method: 'POST',
      body: JSON.stringify(formacionData)
    });
  },

  // Actualizar formación académica
  updateFormacion: async (id, formacionData) => {
    return await apiRequest(`/docentes/formaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formacionData)
    });
  },

  // Eliminar formación académica
  deleteFormacion: async (id) => {
    return await apiRequest(`/docentes/formaciones/${id}`, {
      method: 'DELETE'
    });
  },

  // Obtener estadísticas de formaciones
  getEstadisticas: async () => {
    return await apiRequest('/docentes/formaciones/stats');
  }
};

export default formacionesAPI;
