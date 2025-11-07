import api from './api';

const listaPostulacionesAPI = {
  // Obtener todas las postulaciones para directores/administradores
  async obtenerTodasPostulaciones() {
    try {
      const response = await api.get('/postulaciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener todas las postulaciones:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las postulaciones',
        status: error.response?.status || 500
      };
    }
  }
};

export default listaPostulacionesAPI;
