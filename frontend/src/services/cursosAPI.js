import api from './api';

const cursosAPI = {
  // Obtener todos los cursos con paginación
  async getCursos(page = 1, limit = 10, search = '') {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) {
        params.append('search', search);
      }
      
      const response = await api.get(`/cursos?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener los cursos',
        status: error.response?.status || 500
      };
    }
  },

  // Obtener estadísticas de cursos
  async getCursosStats() {
    try {
      const response = await api.get('/cursos/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las estadísticas',
        status: error.response?.status || 500
      };
    }
  },

  // Obtener un curso por ID
  async getCursoById(id) {
    try {
      const response = await api.get(`/cursos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener curso:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener el curso',
        status: error.response?.status || 500
      };
    }
  },

  // Cambiar estado de un curso (activar/desactivar)
  async toggleCursoStatus(id) {
    try {
      const response = await api.patch(`/cursos/${id}/status`);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw {
        message: error.response?.data?.message || 'Error al cambiar el estado del curso',
        status: error.response?.status || 500
      };
    }
  }
};

export default cursosAPI;
