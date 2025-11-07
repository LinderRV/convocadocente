import api from '../api';

const listaPostulacionesAPI = {
  // Obtener todas las postulaciones del docente logueado
  async obtenerPostulaciones() {
    try {
      const response = await api.get('/docentes/lista-postulaciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener postulaciones:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las postulaciones',
        status: error.response?.status || 500
      };
    }
  },

  // Obtener detalle completo de una postulación específica
  async obtenerDetallePostulacion(postulacionId) {
    try {
      const response = await api.get(`/docentes/lista-postulaciones/${postulacionId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalle de postulación:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener el detalle de la postulación',
        status: error.response?.status || 500
      };
    }
  }
};

export default listaPostulacionesAPI;
