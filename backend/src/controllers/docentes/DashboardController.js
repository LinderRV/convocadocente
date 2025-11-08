const { pool } = require('../../config/database');

class DashboardController {
  
  // Obtener estadísticas del dashboard para el docente autenticado
  static async getEstadisticas(req, res) {
    try {
      const userId = req.user.id;
      
      // Obtener estadísticas simples
      const formacionesQuery = `SELECT COUNT(*) as total FROM formaciones_academicas WHERE user_id = ?`;
      const experienciasQuery = `SELECT COUNT(*) as total FROM experiencias_laborales WHERE user_id = ? AND sin_experiencia = 0`;
      const postulacionesQuery = `SELECT COUNT(*) as total FROM postulaciones_cursos_especialidad WHERE user_id = ?`;
      
      // Ejecutar consultas
      const [formacionesResult] = await pool.execute(formacionesQuery, [userId]);
      const [experienciasResult] = await pool.execute(experienciasQuery, [userId]);
      const [postulacionesResult] = await pool.execute(postulacionesQuery, [userId]);
      
      const estadisticas = {
        formaciones: { total: parseInt(formacionesResult[0]?.total || 0) },
        experiencias: { total: parseInt(experienciasResult[0]?.total || 0) },
        postulaciones: { total: parseInt(postulacionesResult[0]?.total || 0) }
      };
      
      res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas correctamente',
        data: estadisticas
      });
      
    } catch (error) {
      console.error('Error en getEstadisticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

module.exports = DashboardController;
