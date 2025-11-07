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

// API para experiencias laborales
export const experienciasAPI = {
  // Obtener todas las experiencias del docente
  getExperiencias: async (page = 1, limit = 10) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    return await apiRequest(`/docentes/experiencias?${params}`);
  },

  // Obtener experiencia por ID
  getExperienciaById: async (id) => {
    return await apiRequest(`/docentes/experiencias/${id}`);
  },

  // Crear nueva experiencia laboral
  createExperiencia: async (experienciaData, file = null) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de acceso requerido');
    }

    try {
      let requestOptions;
      
      // Si hay archivo, enviar como FormData
      if (file) {
        const formData = new FormData();
        
        // Agregar los campos de datos
        Object.keys(experienciaData).forEach(key => {
          if (experienciaData[key] !== null && experienciaData[key] !== undefined) {
            formData.append(key, experienciaData[key]);
          }
        });
        
        // Agregar el archivo
        formData.append('constancia', file);
        
        requestOptions = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // NO incluir Content-Type para FormData
          },
          body: formData
        };
      } else {
        // Si no hay archivo, enviar como JSON normal
        requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(experienciaData)
        };
      }

      const response = await fetch(`${API_BASE_URL}/docentes/experiencias`, requestOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating experiencia:', error);
      throw error;
    }
  },

  // Actualizar experiencia laboral
  updateExperiencia: async (id, experienciaData, file = null) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de acceso requerido');
    }

    try {
      let requestOptions;
      
      // Si hay archivo, enviar como FormData
      if (file) {
        const formData = new FormData();
        
        // Agregar los campos de datos
        Object.keys(experienciaData).forEach(key => {
          if (experienciaData[key] !== null && experienciaData[key] !== undefined) {
            formData.append(key, experienciaData[key]);
          }
        });
        
        // Agregar el archivo
        formData.append('constancia', file);
        
        requestOptions = {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
            // NO incluir Content-Type para FormData, el browser lo maneja automáticamente
          },
          body: formData
        };
      } else {
        // Si no hay archivo, enviar como JSON normal
        requestOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(experienciaData)
        };
      }

      const response = await fetch(`${API_BASE_URL}/docentes/experiencias/${id}`, requestOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating experiencia:', error);
      throw error;
    }
  },

  // Eliminar experiencia laboral
  deleteExperiencia: async (id) => {
    return await apiRequest(`/docentes/experiencias/${id}`, {
      method: 'DELETE'
    });
  },

  // Obtener estadísticas de experiencias
  getEstadisticas: async () => {
    return await apiRequest('/docentes/experiencias/stats');
  },

  // Subir documento de experiencia
  uploadDocumento: async (id, file) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de acceso requerido');
    }
    
    const formData = new FormData();
    formData.append('constancia', file);

    try {
      const response = await fetch(`${API_BASE_URL}/docentes/experiencias/${id}/documento`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Descargar documento de experiencia
  downloadDocumento: async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de acceso requerido');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/docentes/experiencias/${id}/documento`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Obtener el blob del archivo
      const blob = await response.blob();
      
      // Intentar obtener el nombre del archivo desde los headers
      let filename = `constancia_experiencia_${id}.pdf`; // fallback
      
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Si no se pudo obtener del header, obtener desde la BD
      if (filename === `constancia_experiencia_${id}.pdf`) {
        try {
          const experienciaData = await experienciasAPI.getExperienciaById(id);
          if (experienciaData.success && experienciaData.data.constancia_archivo) {
            filename = experienciaData.data.constancia_archivo;
          }
        } catch (error) {
          console.warn('No se pudo obtener el nombre desde la BD:', error);
        }
      }
      
      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga temporal
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Documento descargado correctamente' };
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  },

  // Eliminar documento de experiencia
  deleteDocumento: async (id) => {
    return await apiRequest(`/docentes/experiencias/${id}/documento`, {
      method: 'DELETE'
    });
  }
};

export default experienciasAPI;
