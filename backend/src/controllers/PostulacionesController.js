const db = require('../config/database');

class PostulacionesController {
  // Obtener todas las postulaciones para la tabla principal
  static async getPostulaciones(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const offset = (page - 1) * limit;

      // Query principal para la tabla con JOINs necesarios
      const query = `
        SELECT 
          p.id,
          p.estado,
          p.fecha_postulacion,
          p.comentario_evaluacion,
          
          -- Datos del docente (usuario)
          u.id as docente_id,
          u.nombre as docente_nombre,
          u.email as docente_email,
          
          -- Datos adicionales del docente
          d.nombres as docente_nombres,
          d.apellidos as docente_apellidos,
          d.dni,
          d.fecha_nacimiento,
          d.genero,
          d.pais,
          d.direccion,
          d.telefono,
          d.cv_archivo,
          
          -- Datos de la especialidad
          p.c_codesp as especialidad_codigo,
          e.nomesp as especialidad_nombre,
          f.nom_fac as facultad_nombre,
          
          -- Datos del evaluador
          eval.id as evaluador_id,
          eval.nombre as evaluador_nombre,
          eval.email as evaluador_email
          
        FROM postulaciones_cursos_especialidad p
        INNER JOIN usuarios u ON p.user_id = u.id
        LEFT JOIN docentes d ON u.id = d.user_id
        INNER JOIN especialidades e ON p.c_codfac = e.c_codfac AND p.c_codesp = e.c_codesp
        INNER JOIN facultades f ON e.c_codfac = f.c_codfac
        LEFT JOIN usuarios eval ON p.evaluador_user_id = eval.id
        WHERE u.estado = 1
        ORDER BY p.fecha_postulacion DESC
        LIMIT ? OFFSET ?
      `;

      // Query para contar total de registros
      const countQuery = `
        SELECT COUNT(*) as total
        FROM postulaciones_cursos_especialidad p
        INNER JOIN usuarios u ON p.user_id = u.id
        WHERE u.estado = 1
      `;

      // Ejecutar ambas queries
      const [postulaciones] = await db.execute(query, [limit, offset]);
      const [countResult] = await db.execute(countQuery);
      const total = countResult[0].total;

      // Para cada postulación, obtener formaciones académicas
      for (let postulacion of postulaciones) {
        // Formaciones académicas
        const [formaciones] = await db.execute(`
          SELECT id, nivel_formacion, programa_academico, institucion, pais, fecha_obtencion, documento_archivo
          FROM formaciones_academicas 
          WHERE user_id = ?
          ORDER BY fecha_obtencion DESC
        `, [postulacion.docente_id]);

        // Experiencias laborales
        const [experiencias] = await db.execute(`
          SELECT id, pais, sector, empresa, ruc, cargo, fecha_inicio, fecha_fin, actual, constancia_archivo
          FROM experiencias_laborales 
          WHERE user_id = ?
          ORDER BY fecha_inicio DESC
        `, [postulacion.docente_id]);

        // Cursos de interés para esta postulación específica
        const [cursosInteres] = await db.execute(`
          SELECT 
            pec.id,
            pec.c_codcur as codigo,
            pec.c_nomcur as nombre,
            pec.n_ciclo as ciclo
          FROM docente_cursos_interes dci
          INNER JOIN plan_estudio_curso pec ON dci.plan_estudio_curso_id = pec.id
          WHERE dci.postulacion_id = ?
          ORDER BY pec.c_nomcur
        `, [postulacion.id]);

        // Horarios disponibles para esta postulación específica
        const [horarios] = await db.execute(`
          SELECT dia_semana as dia, TIME_FORMAT(hora_inicio, '%H:%i') as hora_inicio, TIME_FORMAT(hora_fin, '%H:%i') as hora_fin
          FROM docente_horarios 
          WHERE postulacion_id = ?
          ORDER BY FIELD(dia_semana, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')
        `, [postulacion.id]);

        // Estructurar datos según mockup
        postulacion.docente = {
          id: postulacion.docente_id,
          nombre: postulacion.docente_nombre,
          email: postulacion.docente_email,
          telefono: postulacion.telefono,
          dni: postulacion.dni,
          cv_archivo: postulacion.cv_archivo,
          nombres: postulacion.docente_nombres,
          apellidos: postulacion.docente_apellidos,
          fecha_nacimiento: postulacion.fecha_nacimiento,
          genero: postulacion.genero,
          pais: postulacion.pais,
          direccion: postulacion.direccion
        };

        postulacion.especialidad = {
          codigo: postulacion.especialidad_codigo,
          nombre: postulacion.especialidad_nombre,
          facultad: postulacion.facultad_nombre
        };

        postulacion.evaluador = {
          id: postulacion.evaluador_id,
          nombre: postulacion.evaluador_nombre,
          email: postulacion.evaluador_email
        };

        postulacion.formaciones_academicas = formaciones;
        postulacion.experiencias_laborales = experiencias;
        postulacion.cursosInteres = cursosInteres;
        postulacion.horarios = horarios;

        // Limpiar campos duplicados
        delete postulacion.docente_id;
        delete postulacion.docente_nombre;
        delete postulacion.docente_email;
        delete postulacion.docente_nombres;
        delete postulacion.docente_apellidos;
        delete postulacion.dni;
        delete postulacion.fecha_nacimiento;
        delete postulacion.genero;
        delete postulacion.pais;
        delete postulacion.direccion;
        delete postulacion.telefono;
        delete postulacion.cv_archivo;
        delete postulacion.especialidad_codigo;
        delete postulacion.especialidad_nombre;
        delete postulacion.facultad_nombre;
        delete postulacion.evaluador_id;
        delete postulacion.evaluador_nombre;
        delete postulacion.evaluador_email;
      }

      res.json({
        success: true,
        data: postulaciones,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Error al obtener postulaciones:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Actualizar estado de una postulación (para el modal de evaluación)
  static async updateEstadoPostulacion(req, res) {
    try {
      const { id } = req.params;
      const { estado, comentario_evaluacion } = req.body;

      // Validar estado
      const estadosValidos = ['PENDIENTE', 'EVALUANDO', 'APROBADO', 'RECHAZADO'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado no válido'
        });
      }

      // Actualizar postulación
      const [result] = await db.execute(`
        UPDATE postulaciones_cursos_especialidad 
        SET estado = ?, comentario_evaluacion = ?
        WHERE id = ?
      `, [estado, comentario_evaluacion || null, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Postulación no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Estado actualizado correctamente'
      });

    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

module.exports = PostulacionesController;