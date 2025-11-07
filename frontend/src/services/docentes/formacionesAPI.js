import api from '../api';

// API para formaciones académicas
const formacionesAPI = {
  // Obtener todas las formaciones del docente
  async getFormaciones(page = 1, limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get(`/docentes/formaciones?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener formaciones:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las formaciones',
        status: error.response?.status || 500
      };
    }
  },

  // Obtener formación por ID
  async getFormacionById(id) {
    try {
      const response = await api.get(`/docentes/formaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener formación:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener la formación',
        status: error.response?.status || 500
      };
    }
  },

  // Crear nueva formación académica
  async createFormacion(formacionData, file = null) {
    try {
      if (file) {
        const formData = new FormData();
        
        Object.keys(formacionData).forEach(key => {
          if (formacionData[key] !== null && formacionData[key] !== undefined) {
            formData.append(key, formacionData[key]);
          }
        });
        
        formData.append('documento', file);
        
        const response = await api.post('/docentes/formaciones', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        const response = await api.post('/docentes/formaciones', formacionData);
        return response.data;
      }
    } catch (error) {
      console.error('Error al crear formación:', error);
      throw {
        message: error.response?.data?.message || 'Error al crear la formación',
        status: error.response?.status || 500
      };
    }
  },

  // Actualizar formación académica
  async updateFormacion(id, formacionData, file = null) {
    try {
      if (file) {
        const formData = new FormData();
        
        Object.keys(formacionData).forEach(key => {
          if (formacionData[key] !== null && formacionData[key] !== undefined) {
            formData.append(key, formacionData[key]);
          }
        });
        
        formData.append('documento', file);
        
        const response = await api.put(`/docentes/formaciones/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        const response = await api.put(`/docentes/formaciones/${id}`, formacionData);
        return response.data;
      }
    } catch (error) {
      console.error('Error al actualizar formación:', error);
      throw {
        message: error.response?.data?.message || 'Error al actualizar la formación',
        status: error.response?.status || 500
      };
    }
  },

  // Eliminar formación académica
  async deleteFormacion(id) {
    try {
      const response = await api.delete(`/docentes/formaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar formación:', error);
      throw {
        message: error.response?.data?.message || 'Error al eliminar la formación',
        status: error.response?.status || 500
      };
    }
  },

  // Obtener estadísticas de formaciones
  async getEstadisticas() {
    try {
      const response = await api.get('/docentes/formaciones/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las estadísticas',
        status: error.response?.status || 500
      };
    }
  },

  // Subir documento de formación
  async uploadDocumento(id, file) {
    try {
      const formData = new FormData();
      formData.append('documento', file);

      const response = await api.post(`/docentes/formaciones/${id}/documento`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al subir documento:', error);
      throw {
        message: error.response?.data?.message || 'Error al subir el documento',
        status: error.response?.status || 500
      };
    }
  },

  // Descargar documento de formación
  async downloadDocumento(id) {
    try {
      const response = await api.get(`/docentes/formaciones/${id}/documento`, {
        responseType: 'blob'
      });

      const blob = response.data;
      
      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Obtener nombre del archivo desde headers
      const contentDisposition = response.headers['content-disposition'];
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
      try {
        const formacionData = await this.getFormacionById(id);
        const nombreArchivo = formacionData.data?.documento_archivo;
        
        if (nombreArchivo) {
          link.setAttribute('download', nombreArchivo);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true, message: 'Documento descargado correctamente' };
        }
      } catch (error) {
        console.warn('No se pudo obtener el nombre desde la BD:', error);
      }
      
      throw new Error('No se pudo obtener el nombre del archivo');
    } catch (error) {
      console.error('Error al descargar documento:', error);
      throw {
        message: error.response?.data?.message || 'Error al descargar el documento',
        status: error.response?.status || 500
      };
    }
  },

  // Eliminar documento de formación
  async deleteDocumento(id) {
    try {
      const response = await api.delete(`/docentes/formaciones/${id}/documento`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      throw {
        message: error.response?.data?.message || 'Error al eliminar el documento',
        status: error.response?.status || 500
      };
    }
  }
};

export default formacionesAPI;
