import api from './api';

const postulacionesAPI = {
  // Obtener todas las postulaciones con paginación
  async getPostulaciones(page = 1, limit = 5) {
    try {
      const response = await api.get(`/postulaciones?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener postulaciones:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las postulaciones',
        status: error.response?.status || 500
      };
    }
  },

  // Actualizar estado de postulación (evaluar)
  async updateEstado(id, estadoData) {
    try {
      const response = await api.put(`/postulaciones/${id}/estado`, estadoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw {
        message: error.response?.data?.message || 'Error al actualizar el estado de la postulación',
        status: error.response?.status || 500
      };
    }
  }
};

export default postulacionesAPI;
