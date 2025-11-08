import api from '../api';

const dashboardDirectorAPI = {
  // Obtener estadísticas del dashboard del director
  async getDashboardStats() {
    try {
      const response = await api.get('/directores/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las estadísticas del dashboard',
        status: error.response?.status || 500
      };
    }
  }
};

export default dashboardDirectorAPI;
