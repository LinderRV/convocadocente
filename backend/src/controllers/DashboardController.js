const { pool } = require('../config/database');

class DashboardController {
  static async getDashboardStats(req, res) {
    try {
      // Consultas básicas
      const [totalDocentes] = await pool.execute(`SELECT COUNT(*) as total FROM docentes`);
      const [cursosActivos] = await pool.execute(`SELECT COUNT(*) as total FROM plan_estudio_curso WHERE estado = 1`);
      const [totalPostulaciones] = await pool.execute(`SELECT COUNT(*) as total FROM postulaciones_cursos_especialidad`);
      const [totalEspecialidades] = await pool.execute(`SELECT COUNT(*) as total FROM especialidades`);
      
      // Postulaciones por estado
      const [pendientes] = await pool.execute(`SELECT COUNT(*) as total FROM postulaciones_cursos_especialidad WHERE estado = 'PENDIENTE'`);
      const [evaluando] = await pool.execute(`SELECT COUNT(*) as total FROM postulaciones_cursos_especialidad WHERE estado = 'EVALUANDO'`);
      const [aprobadas] = await pool.execute(`SELECT COUNT(*) as total FROM postulaciones_cursos_especialidad WHERE estado = 'APROBADO'`);
      const [rechazadas] = await pool.execute(`SELECT COUNT(*) as total FROM postulaciones_cursos_especialidad WHERE estado = 'RECHAZADO'`);

      res.json({
        success: true,
        data: {
          totalDocentes: totalDocentes[0].total,
          cursosActivos: cursosActivos[0].total,
          totalPostulaciones: totalPostulaciones[0].total,
          totalEspecialidades: totalEspecialidades[0].total,
          postulaciones: {
            pendientes: pendientes[0].total,
            evaluando: evaluando[0].total,
            aprobadas: aprobadas[0].total,
            rechazadas: rechazadas[0].total
          }
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = DashboardController;
