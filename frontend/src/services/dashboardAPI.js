import api from './api';

// Obtener estadísticas del dashboard de docentes
export const obtenerEstadisticas = async () => {
  try {
    const response = await api.get('/docentes/dashboard/estadisticas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

// Obtener estadísticas del dashboard general (Admin/Decano)
export const obtenerEstadisticasGenerales = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas generales:', error);
    throw error;
  }
};

// Obtener estadísticas mensuales (opcional)
export const obtenerEstadisticasMensuales = async () => {
  try {
    const response = await api.get('/dashboard/monthly-stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas mensuales:', error);
    throw error;
  }
};

export default {
  obtenerEstadisticas,
  obtenerEstadisticasGenerales,
  obtenerEstadisticasMensuales
};
