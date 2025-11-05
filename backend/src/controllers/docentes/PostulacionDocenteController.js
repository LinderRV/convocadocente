const { pool } = require('../../config/database');

class PostulacionDocenteController {
  // Obtener todas las facultades disponibles
  static async getFacultades(req, res) {
    try {
      const query = `
        SELECT 
          c_codfac,
          nom_fac
        FROM facultades 
        ORDER BY nom_fac ASC
      `;

      const [facultades] = await pool.execute(query);

      res.json({
        success: true,
        data: facultades,
        message: 'Facultades obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error en getFacultades:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener especialidades por facultad
  static async getEspecialidadesByFacultad(req, res) {
    try {
      const { c_codfac } = req.params;

      if (!c_codfac) {
        return res.status(400).json({
          success: false,
          message: 'Código de facultad es requerido'
        });
      }

      const query = `
        SELECT 
          e.c_codfac,
          e.c_codesp,
          e.nomesp,
          f.nom_fac
        FROM especialidades e
        INNER JOIN facultades f ON e.c_codfac = f.c_codfac
        WHERE e.c_codfac = ?
        ORDER BY e.nomesp ASC
      `;

      const [especialidades] = await pool.execute(query, [c_codfac]);

      res.json({
        success: true,
        data: especialidades,
        message: 'Especialidades obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error en getEspecialidadesByFacultad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener cursos por especialidad
  static async getCursosByEspecialidad(req, res) {
    try {
      const { c_codfac, c_codesp } = req.params;

      if (!c_codfac || !c_codesp) {
        return res.status(400).json({
          success: false,
          message: 'Código de facultad y especialidad son requeridos'
        });
      }

      const query = `
        SELECT 
          p.id,
          p.n_codplan,
          p.c_codfac,
          p.c_codesp,
          p.c_codcur,
          p.c_nomcur,
          p.n_ciclo,
          p.estado,
          e.nomesp,
          f.nom_fac
        FROM plan_estudio_curso p
        INNER JOIN especialidades e ON p.c_codfac = e.c_codfac AND p.c_codesp = e.c_codesp
        INNER JOIN facultades f ON p.c_codfac = f.c_codfac
        WHERE p.c_codfac = ? AND p.c_codesp = ? AND p.estado = 1
        ORDER BY p.n_ciclo ASC, p.c_nomcur ASC
      `;

      const [cursos] = await pool.execute(query, [c_codfac, c_codesp]);

      res.json({
        success: true,
        data: cursos,
        message: 'Cursos obtenidos exitosamente'
      });

    } catch (error) {
      console.error('Error en getCursosByEspecialidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Crear nueva postulación completa
  static async crearPostulacion(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const userId = req.user.id;
      const {
        c_codfac,
        c_codesp,
        horarios, // Array de objetos: [{dia_semana, hora_inicio, hora_fin}]
        cursos    // Array de IDs de cursos de interés
      } = req.body;

      // Validaciones básicas
      if (!c_codfac || !c_codesp) {
        return res.status(400).json({
          success: false,
          message: 'Facultad y especialidad son requeridos'
        });
      }

      if (!horarios || !Array.isArray(horarios) || horarios.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Debe especificar al menos un horario disponible'
        });
      }

      if (!cursos || !Array.isArray(cursos) || cursos.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Debe seleccionar al menos un curso de interés'
        });
      }

      // Verificar que no existe una postulación activa para esta especialidad
      const [existingPostulacion] = await connection.execute(
        `SELECT id FROM postulaciones_cursos_especialidad 
         WHERE user_id = ? AND c_codfac = ? AND c_codesp = ?`,
        [userId, c_codfac, c_codesp]
      );

      if (existingPostulacion.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Ya tienes una postulación activa para esta especialidad'
        });
      }

      // Buscar un evaluador (Director) para esta especialidad
      const [evaluadores] = await connection.execute(`
        SELECT DISTINCT u.id
        FROM usuarios u
        INNER JOIN usuario_roles ur ON u.id = ur.user_id
        INNER JOIN roles r ON ur.role_id = r.id
        INNER JOIN usuario_especialidad ue ON u.id = ue.user_id
        WHERE r.nombre = 'Director' 
        AND ue.c_codfac = ? 
        AND ue.c_codesp = ?
        AND u.estado = 1
        LIMIT 1
      `, [c_codfac, c_codesp]);

      const evaluadorId = evaluadores.length > 0 ? evaluadores[0].id : null;

      // 1. Crear la postulación principal
      const [postulacionResult] = await connection.execute(`
        INSERT INTO postulaciones_cursos_especialidad 
        (user_id, c_codfac, c_codesp, estado, evaluador_user_id, fecha_postulacion)
        VALUES (?, ?, ?, 'PENDIENTE', ?, NOW())
      `, [userId, c_codfac, c_codesp, evaluadorId]);

      const postulacionId = postulacionResult.insertId;

      // 2. Insertar horarios disponibles
      for (const horario of horarios) {
        await connection.execute(`
          INSERT INTO docente_horarios 
          (user_id, dia_semana, hora_inicio, hora_fin, postulacion_id)
          VALUES (?, ?, ?, ?, ?)
        `, [userId, horario.dia_semana, horario.hora_inicio, horario.hora_fin, postulacionId]);
      }

      // 3. Insertar cursos de interés
      for (const cursoId of cursos) {
        await connection.execute(`
          INSERT INTO docente_cursos_interes 
          (user_id, plan_estudio_curso_id, postulacion_id, fecha_registro)
          VALUES (?, ?, ?, NOW())
        `, [userId, cursoId, postulacionId]);
      }

      await connection.commit();

      // Obtener información completa de la postulación creada
      const [postulacionCompleta] = await connection.execute(`
        SELECT 
          p.id,
          p.user_id,
          p.c_codfac,
          p.c_codesp,
          p.estado,
          p.fecha_postulacion,
          f.nom_fac,
          e.nomesp,
          u_eval.nombre as evaluador_nombre
        FROM postulaciones_cursos_especialidad p
        INNER JOIN facultades f ON p.c_codfac = f.c_codfac
        INNER JOIN especialidades e ON p.c_codfac = e.c_codfac AND p.c_codesp = e.c_codesp
        LEFT JOIN usuarios u_eval ON p.evaluador_user_id = u_eval.id
        WHERE p.id = ?
      `, [postulacionId]);

      res.status(201).json({
        success: true,
        data: {
          postulacion: postulacionCompleta[0],
          horarios_registrados: horarios.length,
          cursos_registrados: cursos.length
        },
        message: 'Postulación creada exitosamente'
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error en crearPostulacion:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      connection.release();
    }
  }

  // Verificar si el usuario puede crear postulación para una especialidad
  static async verificarPostulacion(req, res) {
    try {
      const userId = req.user.id;
      const { c_codfac, c_codesp } = req.params;

      const [existingPostulacion] = await pool.execute(
        `SELECT id, estado FROM postulaciones_cursos_especialidad 
         WHERE user_id = ? AND c_codfac = ? AND c_codesp = ?`,
        [userId, c_codfac, c_codesp]
      );

      res.json({
        success: true,
        data: {
          puede_postular: existingPostulacion.length === 0,
          postulacion_existente: existingPostulacion.length > 0 ? existingPostulacion[0] : null
        },
        message: existingPostulacion.length > 0 ? 
          'Ya tienes una postulación para esta especialidad' : 
          'Puedes crear una postulación para esta especialidad'
      });

    } catch (error) {
      console.error('Error en verificarPostulacion:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = PostulacionDocenteController;
