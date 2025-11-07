import api from '../api';

// API para postulaciones de docentes
const postulacionDocenteAPI = {
  // Obtener todas las facultades disponibles
  async getFacultades() {
    try {
      const response = await api.get('/docentes/postulaciones/facultades');
      return response.data;
    } catch (error) {
      console.error('Error al obtener facultades:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las facultades',
        status: error.response?.status || 500
      };
    }
  },

  // Obtener especialidades por facultad
  async getEspecialidadesByFacultad(c_codfac) {
    try {
      const response = await api.get(`/docentes/postulaciones/especialidades/${c_codfac}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener las especialidades',
        status: error.response?.status || 500
      };
    }
  },

  // Obtener cursos por especialidad
  async getCursosByEspecialidad(c_codfac, c_codesp) {
    try {
      const response = await api.get(`/docentes/postulaciones/cursos/${c_codfac}/${c_codesp}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      throw {
        message: error.response?.data?.message || 'Error al obtener los cursos',
        status: error.response?.status || 500
      };
    }
  },

  // Verificar si puede crear postulación para una especialidad
  async verificarPostulacion(c_codfac, c_codesp) {
    try {
      const response = await api.get(`/docentes/postulaciones/verificar/${c_codfac}/${c_codesp}`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar postulación:', error);
      throw {
        message: error.response?.data?.message || 'Error al verificar la postulación',
        status: error.response?.status || 500
      };
    }
  },

  // Crear nueva postulación completa
  async crearPostulacion(postulacionData) {
    try {
      const response = await api.post('/docentes/postulaciones/crear', postulacionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear postulación:', error);
      throw {
        message: error.response?.data?.message || 'Error al crear la postulación',
        status: error.response?.status || 500
      };
    }
  }
};

export default postulacionDocenteAPI;
