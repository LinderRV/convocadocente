const { pool } = require('../config/database');

class PostulacionesController {
  // Obtener todas las postulaciones para la tabla
  static async getPostulaciones(req, res) {
    try {
      const { page = 1, limit = 5 } = req.query;
      
      // Validar y convertir parámetros asegurando que sean enteros válidos
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 5));
      const offset = (pageNum - 1) * limitNum;

      // Determinar filtro según rol del usuario
      let whereClause = 'WHERE u.estado = 1';
      let joinClause = '';
      
      // Si es Director, filtrar solo postulaciones de SU especialidad
      if (req.user.rol === 'Director') {
        joinClause = `
          INNER JOIN usuario_especialidad ue ON 
            p.c_codfac = ue.c_codfac AND 
            p.c_codesp = ue.c_codesp AND 
            ue.user_id = ?
        `;
        whereClause = 'WHERE u.estado = 1';
      }

      // Query principal con JOIN completo para obtener datos reales
      const mainQuery = `
        SELECT 
          p.id,
          p.estado,
          p.fecha_postulacion,
          p.comentario_evaluacion,
          p.c_codfac,
          p.c_codesp,
          p.evaluador_user_id,
          
          -- Datos del docente desde usuarios
          u.id as docente_id,
          u.nombre as docente_nombre,
          u.email as docente_email,
          
          -- Datos adicionales del docente desde tabla docentes
          d.nombres as docente_nombres,
          d.apellidos as docente_apellidos,
          d.dni as docente_dni,
          d.telefono as docente_telefono,
          d.cv_archivo as docente_cv,
          d.fecha_nacimiento as docente_fecha_nacimiento,
          d.genero as docente_genero,
          d.pais as docente_pais,
          d.direccion as docente_direccion,
          
          -- Datos de especialidad
          e.nomesp as especialidad_nombre,
          f.nom_fac as facultad_nombre,
          
          -- Datos del evaluador
          eval_u.nombre as evaluador_nombre,
          eval_u.email as evaluador_email
          
        FROM postulaciones_cursos_especialidad p
        INNER JOIN usuarios u ON p.user_id = u.id
        LEFT JOIN docentes d ON u.id = d.user_id
        LEFT JOIN especialidades e ON p.c_codfac = e.c_codfac AND p.c_codesp = e.c_codesp
        LEFT JOIN facultades f ON p.c_codfac = f.c_codfac
        LEFT JOIN usuarios eval_u ON p.evaluador_user_id = eval_u.id
        ${joinClause}
        ${whereClause}
        ORDER BY p.fecha_postulacion DESC
      `;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM postulaciones_cursos_especialidad p
        INNER JOIN usuarios u ON p.user_id = u.id
        ${joinClause}
        ${whereClause}
      `;

      // Ejecutar queries con parámetros según el rol
      let allResults, countResults;
      
      if (req.user.rol === 'Director') {
        // Para Director: filtrar por SU especialidad
        const [results] = await pool.execute(mainQuery, [req.user.id]);
        const [count] = await pool.execute(countQuery, [req.user.id]);
        allResults = results;
        countResults = count;
      } else {
        // Para Administrador/Decano: ver todas las postulaciones
        const [results] = await pool.execute(mainQuery);
        const [count] = await pool.execute(countQuery);
        allResults = results;
        countResults = count;
      }
      
      // Aplicar paginación manualmente
      const postulaciones = allResults.slice(offset, offset + limitNum);
      
      const total = countResults[0].total;

      // Para cada postulación, obtener datos adicionales y formatear respuesta completa
      const postulacionesFormatted = await Promise.all(postulaciones.map(async (p) => {
        
        // Obtener formaciones académicas
        const [formaciones] = await pool.execute(`
          SELECT nivel_formacion, programa_academico, institucion, pais, fecha_obtencion, documento_archivo
          FROM formaciones_academicas 
          WHERE user_id = ?
          ORDER BY fecha_obtencion DESC
        `, [p.docente_id]);

        // Obtener experiencias laborales
        const [experiencias] = await pool.execute(`
          SELECT pais, sector, empresa, ruc, cargo, fecha_inicio, fecha_fin, actual, constancia_archivo
          FROM experiencias_laborales 
          WHERE user_id = ?
          ORDER BY fecha_inicio DESC
        `, [p.docente_id]);

        // Obtener cursos de interés para esta postulación
        const [cursosInteres] = await pool.execute(`
          SELECT pec.c_nomcur as nombre_curso, pec.c_codcur as codigo_curso, pec.n_ciclo
          FROM docente_cursos_interes dci
          INNER JOIN plan_estudio_curso pec ON dci.plan_estudio_curso_id = pec.id
          WHERE dci.user_id = ? AND dci.postulacion_id = ?
        `, [p.docente_id, p.id]);

        // Obtener horarios disponibles para esta postulación
        const [horarios] = await pool.execute(`
          SELECT dia_semana, hora_inicio, hora_fin
          FROM docente_horarios 
          WHERE user_id = ? AND postulacion_id = ?
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
        `, [p.docente_id, p.id]);

        return {
          id: p.id,
          docente: {
            id: p.docente_id,
            nombre: p.docente_nombre,
            email: p.docente_email,
            telefono: p.docente_telefono,
            dni: p.docente_dni,
            cv_archivo: p.docente_cv, // Solo el nombre del archivo
            nombres: p.docente_nombres,
            apellidos: p.docente_apellidos,
            fecha_nacimiento: p.docente_fecha_nacimiento,
            genero: p.docente_genero,
            pais: p.docente_pais,
            direccion: p.docente_direccion
          },
          formaciones_academicas: formaciones.map(f => ({
            nivel_formacion: f.nivel_formacion,
            programa_academico: f.programa_academico,
            institucion: f.institucion,
            pais: f.pais,
            fecha_obtencion: f.fecha_obtencion,
            documento_archivo: f.documento_archivo // Solo el nombre del archivo
          })),
          experiencias_laborales: experiencias.map(exp => ({
            pais: exp.pais,
            sector: exp.sector,
            empresa: exp.empresa,
            ruc: exp.ruc,
            cargo: exp.cargo,
            fecha_inicio: exp.fecha_inicio,
            fecha_fin: exp.fecha_fin,
            actual: exp.actual,
            constancia_archivo: exp.constancia_archivo // Solo el nombre del archivo
          })),
          especialidad: {
            codigo: `${p.c_codfac}${p.c_codesp}`,
            nombre: p.especialidad_nombre,
            facultad: p.facultad_nombre
          },
          estado: p.estado,
          fecha_postulacion: p.fecha_postulacion,
          evaluador: {
            id: p.evaluador_user_id,
            nombre: p.evaluador_nombre,
            email: p.evaluador_email
          },
          cursosInteres: cursosInteres.map(curso => ({
            codigo: curso.codigo_curso,
            nombre: curso.nombre_curso,
            ciclo: curso.n_ciclo
          })),
          horarios: horarios.map(h => ({
            dia: h.dia_semana,
            hora_inicio: h.hora_inicio,
            hora_fin: h.hora_fin
          })),
          comentario_evaluacion: p.comentario_evaluacion
        };
      }));

      res.json({
        success: true,
        data: postulacionesFormatted,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Actualizar estado de postulación
  static async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado, comentario_evaluacion } = req.body;

      const estadosValidos = ['PENDIENTE', 'EVALUANDO', 'APROBADO', 'RECHAZADO'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado no válido'
        });
      }

      const [result] = await pool.execute(`
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
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

module.exports = PostulacionesController;
