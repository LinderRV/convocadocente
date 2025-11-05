const { pool } = require('../config/database');

class Curso {
  // Obtener todos los cursos del plan de estudios
  static async findAllCursos(page = 1, limit = 10, search = '', userId = null) {
    try {
      const offset = (page - 1) * limit;
      
      // Asegurar que limit y offset sean strings para MySQL
      const limitStr = String(parseInt(limit));
      const offsetStr = String(parseInt(offset));
      
      let whereClause = '';
      let queryParams = [];
      let joinClause = '';
      
      // Si se proporciona userId, verificar si es Director y filtrar por su especialidad
      if (userId) {
        // Verificar si el usuario es Director
        const [userRoles] = await pool.execute(`
          SELECT r.nombre as rol_nombre
          FROM usuarios u
          INNER JOIN usuario_roles ur ON u.id = ur.user_id
          INNER JOIN roles r ON ur.role_id = r.id
          WHERE u.id = ?
        `, [userId]);
        
        const isDirector = userRoles.some(role => role.rol_nombre === 'Director');
        
        if (isDirector) {
          // Si es Director, filtrar por su especialidad
          joinClause = `
            INNER JOIN usuario_especialidad ue ON ue.c_codfac = p.c_codfac AND ue.c_codesp = p.c_codesp
          `;
          whereClause = 'WHERE ue.user_id = ?';
          queryParams.push(userId);
        }
      }
      
      if (search && search.trim() !== '') {
        const searchCondition = `${whereClause ? 'AND' : 'WHERE'} (
          p.c_codcur LIKE ? OR 
          p.c_nomcur LIKE ? OR 
          CAST(p.n_codplan AS CHAR) LIKE ? OR 
          p.c_codfac LIKE ? OR 
          p.c_codesp LIKE ? OR 
          CAST(p.n_ciclo AS CHAR) LIKE ?)`;
        whereClause += ` ${searchCondition}`;
        const searchPattern = `%${search.trim()}%`;
        queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
      }
      
      // Query para obtener los cursos con paginación
      const cursosQuery = `
        SELECT 
          p.id,
          p.n_codplan,
          p.c_codfac,
          p.c_codesp,
          p.c_codcur,
          p.c_nomcur,
          p.n_ciclo,
          p.estado
        FROM plan_estudio_curso p
        ${joinClause}
        ${whereClause}
        ORDER BY p.n_codplan DESC, p.n_ciclo ASC, p.c_nomcur ASC
        LIMIT ? OFFSET ?
      `;
      
      // Query para contar el total
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM plan_estudio_curso p
        ${joinClause}
        ${whereClause}
      `;
      
      // Ejecutar ambas queries
      const [cursosResult] = await pool.execute(cursosQuery, [...queryParams, limitStr, offsetStr]);
      const [countResult] = await pool.execute(countQuery, queryParams);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / parseInt(limitStr));
      
      return {
        cursos: cursosResult,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limitStr),
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
      
    } catch (error) {
      console.error('Error en findAllCursos:', error);
      throw error;
    }
  }

  // Obtener estadísticas de cursos
  static async getCursosStats() {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_cursos,
          COUNT(CASE WHEN estado = 1 THEN 1 END) as cursos_activos,
          COUNT(CASE WHEN estado = 0 THEN 1 END) as cursos_inactivos,
          COUNT(DISTINCT n_codplan) as total_planes,
          COUNT(DISTINCT c_codfac) as total_facultades,
          COUNT(DISTINCT c_codesp) as total_especialidades,
          COUNT(DISTINCT n_ciclo) as total_ciclos
        FROM plan_estudio_curso
      `;
      
      const [result] = await pool.execute(statsQuery);
      return result[0];
      
    } catch (error) {
      console.error('Error en getCursosStats:', error);
      throw error;
    }
  }

  // Actualizar estado de un curso
  static async updateCursoStatus(id, estado) {
    try {
      const query = `
        UPDATE plan_estudio_curso 
        SET estado = ? 
        WHERE id = ?
      `;
      
      const [result] = await pool.execute(query, [estado, id]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      // Obtener el curso actualizado
      const [cursoResult] = await pool.execute(
        'SELECT * FROM plan_estudio_curso WHERE id = ?',
        [id]
      );
      
      return cursoResult[0];
      
    } catch (error) {
      console.error('Error en updateCursoStatus:', error);
      throw error;
    }
  }

  // Obtener un curso por ID verificando que pertenece a la especialidad del usuario
  static async findByIdForUser(id, userId) {
    try {
      const query = `
        SELECT 
          p.id,
          p.n_codplan,
          p.c_codfac,
          p.c_codesp,
          p.c_codcur,
          p.c_nomcur,
          p.n_ciclo,
          p.estado
        FROM plan_estudio_curso p
        INNER JOIN usuario_especialidad ue ON ue.c_codfac = p.c_codfac AND ue.c_codesp = p.c_codesp
        INNER JOIN usuario_roles ur ON ur.user_id = ue.user_id
        INNER JOIN roles r ON r.id = ur.role_id
        WHERE p.id = ? AND ue.user_id = ? AND r.nombre = 'Director'
      `;
      
      const [result] = await pool.execute(query, [id, userId]);
      return result[0] || null;
      
    } catch (error) {
      console.error('Error en findByIdForUser:', error);
      throw error;
    }
  }

  // Obtener un curso por ID
  static async findById(id) {
    try {
      const query = `
        SELECT 
          id,
          n_codplan,
          c_codfac,
          c_codesp,
          c_codcur,
          c_nomcur,
          n_ciclo,
          estado
        FROM plan_estudio_curso 
        WHERE id = ?
      `;
      
      const [result] = await pool.execute(query, [id]);
      return result[0] || null;
      
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }
}

module.exports = Curso;
