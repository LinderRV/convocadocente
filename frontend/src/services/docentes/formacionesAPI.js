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
  createFormacion: async (formacionData, file = null) => {
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
        Object.keys(formacionData).forEach(key => {
          if (formacionData[key] !== null && formacionData[key] !== undefined) {
            formData.append(key, formacionData[key]);
          }
        });
        
        // Agregar el archivo
        formData.append('documento', file);
        
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
          body: JSON.stringify(formacionData)
        };
      }

      const response = await fetch(`${API_BASE_URL}/docentes/formaciones`, requestOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating formacion:', error);
      throw error;
    }
  },

  // Actualizar formación académica
  updateFormacion: async (id, formacionData, file = null) => {
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
        Object.keys(formacionData).forEach(key => {
          if (formacionData[key] !== null && formacionData[key] !== undefined) {
            formData.append(key, formacionData[key]);
          }
        });
        
        // Agregar el archivo
        formData.append('documento', file);
        
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
          body: JSON.stringify(formacionData)
        };
      }

      const response = await fetch(`${API_BASE_URL}/docentes/formaciones/${id}`, requestOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating formacion:', error);
      throw error;
    }
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
  },

  // Subir documento de formación
  uploadDocumento: async (id, file) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de acceso requerido');
    }
    
    const formData = new FormData();
    formData.append('documento', file);

    try {
      const response = await fetch(`${API_BASE_URL}/docentes/formaciones/${id}/documento`, {
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

  // Descargar documento de formación
  downloadDocumento: async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de acceso requerido');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/docentes/formaciones/${id}/documento`, {
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
      
      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Obtener nombre del archivo desde headers
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          link.setAttribute('download', filenameMatch[1]);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true, message: 'Documento descargado correctamente' };
        }
      }
      
      // Si no hay header, obtener el nombre del documento de la formación
      const formacionResponse = await fetch(`${API_BASE_URL}/docentes/formaciones/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (formacionResponse.ok) {
        const formacionData = await formacionResponse.json();
        const nombreArchivo = formacionData.data.documento_archivo;
        
        if (nombreArchivo) {
          link.setAttribute('download', nombreArchivo);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true, message: 'Documento descargado correctamente' };
        }
      }
      
      throw new Error('No se pudo obtener el nombre del archivo');
      
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  },

  // Eliminar documento de formación
  deleteDocumento: async (id) => {
    return await apiRequest(`/docentes/formaciones/${id}/documento`, {
      method: 'DELETE'
    });
  }
};

export default formacionesAPI;
