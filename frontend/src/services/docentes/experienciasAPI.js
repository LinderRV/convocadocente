import api from '../api';

// API para experiencias laborales
const experienciasAPI = {
  // Obtener todas las experiencias del docente
  async getExperiencias(page = 1, limit = 10) {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const response = await api.get(`/docentes/experiencias?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener experiencias:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las experiencias',
        status: error.response?.status || 500
      };
    }
  },

  // Obtener experiencia por ID
  async getExperienciaById(id) {
    try {
      const response = await api.get(`/docentes/experiencias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener experiencia:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener la experiencia',
        status: error.response?.status || 500
      };
    }
  },

  // Crear nueva experiencia laboral
  async createExperiencia(experienciaData, file = null) {
    try {
      if (file) {
        const formData = new FormData();
        
        // Agregar los campos de datos
        Object.keys(experienciaData).forEach(key => {
          if (experienciaData[key] !== null && experienciaData[key] !== undefined) {
            formData.append(key, experienciaData[key]);
          }
        });
        
        formData.append('constancia', file);
        
        const response = await api.post('/docentes/experiencias', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        const response = await api.post('/docentes/experiencias', experienciaData);
        return response.data;
      }
    } catch (error) {
      console.error('Error al crear experiencia:', error);
      throw {
        message: error.response?.data?.message || 'Error al crear la experiencia',
        status: error.response?.status || 500
      };
    }
  },

  // Actualizar experiencia laboral
  async updateExperiencia(id, experienciaData, file = null) {
    try {
      if (file) {
        const formData = new FormData();
        
        Object.keys(experienciaData).forEach(key => {
          if (experienciaData[key] !== null && experienciaData[key] !== undefined) {
            formData.append(key, experienciaData[key]);
          }
        });
        
        formData.append('constancia', file);
        
        const response = await api.put(`/docentes/experiencias/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        const response = await api.put(`/docentes/experiencias/${id}`, experienciaData);
        return response.data;
      }
    } catch (error) {
      console.error('Error al actualizar experiencia:', error);
      throw {
        message: error.response?.data?.message || 'Error al actualizar la experiencia',
        status: error.response?.status || 500
      };
    }
  },

  // Eliminar experiencia laboral
  async deleteExperiencia(id) {
    try {
      const response = await api.delete(`/docentes/experiencias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar experiencia:', error);
      throw {
        message: error.response?.data?.message || 'Error al eliminar la experiencia',
        status: error.response?.status || 500
      };
    }
  },

  // Obtener estadísticas de experiencias
  async getEstadisticas() {
    try {
      const response = await api.get('/docentes/experiencias/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las estadísticas',
        status: error.response?.status || 500
      };
    }
  },

  // Subir documento de experiencia
  async uploadDocumento(id, file) {
    try {
      const formData = new FormData();
      formData.append('constancia', file);

      const response = await api.post(`/docentes/experiencias/${id}/documento`, formData, {
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

  // Descargar documento de experiencia
  async downloadDocumento(id) {
    try {
      const response = await api.get(`/docentes/experiencias/${id}/documento`, {
        responseType: 'blob'
      });

      // Obtener el blob del archivo
      const blob = response.data;
      
      // Intentar obtener el nombre del archivo desde los headers
      let filename = `constancia_experiencia_${id}.pdf`;
      
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Si no se pudo obtener del header, obtener desde la BD
      if (filename === `constancia_experiencia_${id}.pdf`) {
        try {
          const experienciaData = await this.getExperienciaById(id);
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
      console.error('Error al descargar documento:', error);
      throw {
        message: error.response?.data?.message || 'Error al descargar el documento',
        status: error.response?.status || 500
      };
    }
  },

  // Eliminar documento de experiencia
  async deleteDocumento(id) {
    try {
      const response = await api.delete(`/docentes/experiencias/${id}/documento`);
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

export default experienciasAPI;
