const { pool } = require('../../config/database');

class DashboardDirectorController {
  
  // Obtener estadísticas del dashboard para el director
  static async getDashboardStats(req, res) {
    try {
      const userId = req.user.id;
      
      // Verificar que el usuario es Director
      const [userRoles] = await pool.execute(`
        SELECT r.nombre as rol_nombre
        FROM usuarios u
        INNER JOIN usuario_roles ur ON u.id = ur.user_id
        INNER JOIN roles r ON ur.role_id = r.id
        WHERE u.id = ? AND r.nombre = 'Director'
      `, [userId]);
      
      if (!userRoles || userRoles.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado. Solo los directores pueden acceder a estas estadísticas.'
        });
      }
      
      // Obtener la especialidad del director
      const [especialidadResult] = await pool.execute(`
        SELECT ue.c_codfac, ue.c_codesp, e.nomesp
        FROM usuario_especialidad ue
        INNER JOIN especialidades e ON e.c_codfac = ue.c_codfac AND e.c_codesp = ue.c_codesp
        WHERE ue.user_id = ?
      `, [userId]);
      
      if (!especialidadResult || especialidadResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró especialidad asignada para este director.'
        });
      }
      
      const { c_codfac, c_codesp, nomesp } = especialidadResult[0];
      
      // 1. Obtener cursos activos de la especialidad
      const [cursosActivosResult] = await pool.execute(`
        SELECT COUNT(*) as cursos_activos
        FROM plan_estudio_curso
        WHERE c_codfac = ? AND c_codesp = ? AND estado = 1
      `, [c_codfac, c_codesp]);
      
      // 2. Obtener total de postulaciones de la especialidad
      const [totalPostulacionesResult] = await pool.execute(`
        SELECT COUNT(*) as total_postulaciones
        FROM postulaciones_cursos_especialidad
        WHERE c_codfac = ? AND c_codesp = ?
      `, [c_codfac, c_codesp]);
      
      // 3. Obtener postulaciones pendientes
      const [postulacionesPendientesResult] = await pool.execute(`
        SELECT COUNT(*) as postulaciones_pendientes
        FROM postulaciones_cursos_especialidad
        WHERE c_codfac = ? AND c_codesp = ? AND estado = 'PENDIENTE'
      `, [c_codfac, c_codesp]);
      
      // 4. Obtener postulaciones aprobadas
      const [postulacionesAprobadasResult] = await pool.execute(`
        SELECT COUNT(*) as postulaciones_aprobadas
        FROM postulaciones_cursos_especialidad
        WHERE c_codfac = ? AND c_codesp = ? AND estado = 'APROBADO'
      `, [c_codfac, c_codesp]);
      
      // Compilar estadísticas
      const stats = {
        cursosActivos: cursosActivosResult[0].cursos_activos || 0,
        totalPostulaciones: totalPostulacionesResult[0].total_postulaciones || 0,
        postulacionesPendientes: postulacionesPendientesResult[0].postulaciones_pendientes || 0,
        postulacionesAprobadas: postulacionesAprobadasResult[0].postulaciones_aprobadas || 0,
        especialidad: {
          codigo_facultad: c_codfac,
          codigo_especialidad: c_codesp,
          nombre_especialidad: nomesp
        }
      };
      
      res.json({
        success: true,
        data: stats,
        message: 'Estadísticas del dashboard obtenidas exitosamente'
      });
      
    } catch (error) {
      console.error('[DashboardDirectorController] Error en getDashboardStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = DashboardDirectorController;
