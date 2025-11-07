const db = require('../../config/database');

const ListaPostulacionesController = {
  // GET - Obtener todas las postulaciones del docente logueado
  async obtenerPostulaciones(req, res) {
    try {
      const userId = req.user.id; // ID del docente logueado

      // Query principal para obtener postulaciones con información de facultad y especialidad
      const queryPostulaciones = `
        SELECT 
          p.id,
          p.user_id,
          p.c_codfac,
          p.c_codesp,
          p.estado,
          p.comentario_evaluacion,
          p.evaluador_user_id,
          p.fecha_postulacion,
          f.nom_fac as facultad_nombre,
          e.nomesp as especialidad_nombre
        FROM postulaciones_cursos_especialidad p
        LEFT JOIN facultades f ON p.c_codfac = f.c_codfac
        LEFT JOIN especialidades e ON p.c_codfac = e.c_codfac AND p.c_codesp = e.c_codesp
        WHERE p.user_id = ?
        ORDER BY p.fecha_postulacion DESC
      `;

      const postulaciones = await db.query(queryPostulaciones, [userId]);

      // Para cada postulación, obtener horarios y cursos de interés
      for (let postulacion of postulaciones) {
        // Obtener horarios de la postulación
        const queryHorarios = `
          SELECT dia_semana, hora_inicio, hora_fin
          FROM docente_horarios
          WHERE postulacion_id = ?
          ORDER BY 
            CASE dia_semana
              WHEN 'Lunes' THEN 1
              WHEN 'Martes' THEN 2
              WHEN 'Miércoles' THEN 3
              WHEN 'Jueves' THEN 4
              WHEN 'Viernes' THEN 5
              WHEN 'Sábado' THEN 6
              WHEN 'Domingo' THEN 7
            END
        `;
        
        postulacion.horarios = await db.query(queryHorarios, [postulacion.id]);

        // Obtener cursos de interés de la postulación
        const queryCursos = `
          SELECT 
            pec.id,
            pec.c_nomcur
          FROM docente_cursos_interes dci
          JOIN plan_estudio_curso pec ON dci.plan_estudio_curso_id = pec.id
          WHERE dci.postulacion_id = ?
          ORDER BY pec.c_nomcur
        `;
        
        postulacion.cursos_interes = await db.query(queryCursos, [postulacion.id]);
      }

      res.json({
        success: true,
        data: postulaciones,
        message: 'Postulaciones obtenidas correctamente'
      });

    } catch (error) {
      console.error('Error al obtener postulaciones:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener postulaciones',
        error: error.message
      });
    }
  },

  // GET - Obtener detalles completos de una postulación específica
  async obtenerDetallePostulacion(req, res) {
    try {
      const userId = req.user.id;
      const postulacionId = req.params.id;

      // Verificar que la postulación pertenece al usuario
      const queryPostulacion = `
        SELECT 
          p.id,
          p.user_id,
          p.c_codfac,
          p.c_codesp,
          p.estado,
          p.comentario_evaluacion,
          p.evaluador_user_id,
          p.fecha_postulacion,
          f.nom_fac as facultad_nombre,
          e.nomesp as especialidad_nombre
        FROM postulaciones_cursos_especialidad p
        LEFT JOIN facultades f ON p.c_codfac = f.c_codfac
        LEFT JOIN especialidades e ON p.c_codfac = e.c_codfac AND p.c_codesp = e.c_codesp
        WHERE p.id = ? AND p.user_id = ?
      `;

      const postulaciones = await db.query(queryPostulacion, [postulacionId, userId]);
      
      if (postulaciones.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Postulación no encontrada'
        });
      }

      const postulacion = postulaciones[0];

      // Obtener horarios
      const queryHorarios = `
        SELECT dia_semana, hora_inicio, hora_fin
        FROM docente_horarios
        WHERE postulacion_id = ?
        ORDER BY 
          CASE dia_semana
            WHEN 'Lunes' THEN 1
            WHEN 'Martes' THEN 2
            WHEN 'Miércoles' THEN 3
            WHEN 'Jueves' THEN 4
            WHEN 'Viernes' THEN 5
            WHEN 'Sábado' THEN 6
            WHEN 'Domingo' THEN 7
          END
      `;
      
      postulacion.horarios = await db.query(queryHorarios, [postulacionId]);

      // Obtener cursos de interés
      const queryCursos = `
        SELECT 
          pec.id,
          pec.c_nomcur
        FROM docente_cursos_interes dci
        JOIN plan_estudio_curso pec ON dci.plan_estudio_curso_id = pec.id
        WHERE dci.postulacion_id = ?
        ORDER BY pec.c_nomcur
      `;
      
      postulacion.cursos_interes = await db.query(queryCursos, [postulacionId]);

      res.json({
        success: true,
        data: postulacion,
        message: 'Detalle de postulación obtenido correctamente'
      });

    } catch (error) {
      console.error('Error al obtener detalle de postulación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener detalle de postulación',
        error: error.message
      });
    }
  }
};

module.exports = ListaPostulacionesController;
