import api from './api';

const docenteAPI = {
  // Obtener perfil del docente autenticado
  getPerfil: async () => {
    try {
      const response = await api.get('/docentes/perfil');
      return response.data;
    } catch (error) {
      console.error('Error al obtener perfil del docente:', error);
      throw error;
    }
  },

  // Actualizar perfil del docente
  updatePerfil: async (perfilData) => {
    try {
      const response = await api.put('/docentes/perfil', perfilData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil del docente:', error);
      throw error;
    }
  },

  // Subir CV
  uploadCV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await api.post('/docentes/cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al subir CV:', error);
      throw error;
    }
  },

  // Descargar CV
  downloadCV: async () => {
    try {
      const response = await api.get('/docentes/cv/download', {
        responseType: 'blob',
      });
      
      // Crear URL para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Obtener nombre del archivo desde headers
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'CV.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'CV descargado correctamente' };
    } catch (error) {
      console.error('Error al descargar CV:', error);
      throw error;
    }
  },

  // Eliminar CV
  deleteCV: async () => {
    try {
      const response = await api.delete('/docentes/cv');
      return response.data;
    } catch (error) {
      console.error('Error al eliminar CV:', error);
      throw error;
    }
  },

  // Obtener estadísticas (para administradores)
  getStats: async () => {
    try {
      const response = await api.get('/docentes/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
};

export default docenteAPI;
