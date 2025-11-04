const { pool } = require('../../config/database');

class FormacionAcademica {
  // Obtener todas las formaciones académicas de un docente
  static async findByUserId(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const limitStr = String(parseInt(limit));
      const offsetStr = String(parseInt(offset));
      
      const query = `
        SELECT 
          id,
          user_id,
          nivel_formacion,
          programa_academico,
          institucion,
          pais,
          fecha_obtencion,
          documento_archivo
        FROM formaciones_academicas 
        WHERE user_id = ?
        ORDER BY fecha_obtencion DESC
        LIMIT ? OFFSET ?
      `;
      
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM formaciones_academicas 
        WHERE user_id = ?
      `;
      
      const [formaciones] = await pool.execute(query, [String(userId), limitStr, offsetStr]);
      const [countResult] = await pool.execute(countQuery, [String(userId)]);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / parseInt(limitStr));
      
      return {
        formaciones,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limitStr)
        }
      };
    } catch (error) {
      console.error('Error en findByUserId:', error);
      throw error;
    }
  }

  // Crear nueva formación académica
  static async create(formacionData) {
    try {
      const {
        user_id,
        nivel_formacion,
        programa_academico,
        institucion,
        pais,
        fecha_obtencion,
        documento_archivo
      } = formacionData;

      const query = `
        INSERT INTO formaciones_academicas 
        (user_id, nivel_formacion, programa_academico, institucion, pais, fecha_obtencion, documento_archivo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await pool.execute(query, [
        String(user_id),
        nivel_formacion,
        programa_academico,
        institucion,
        pais,
        fecha_obtencion || null,
        documento_archivo || null
      ]);

      return await this.findById(result.insertId);
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  // Obtener formación por ID
  static async findById(id) {
    try {
      const query = `
        SELECT 
          id,
          user_id,
          nivel_formacion,
          programa_academico,
          institucion,
          pais,
          fecha_obtencion,
          documento_archivo
        FROM formaciones_academicas 
        WHERE id = ?
      `;

      const [result] = await pool.execute(query, [String(id)]);
      return result[0] || null;
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }

  // Actualizar formación académica
  static async updateById(id, formacionData) {
    try {
      const {
        nivel_formacion,
        programa_academico,
        institucion,
        pais,
        fecha_obtencion,
        documento_archivo
      } = formacionData;

      const query = `
        UPDATE formaciones_academicas 
        SET 
          nivel_formacion = ?,
          programa_academico = ?,
          institucion = ?,
          pais = ?,
          fecha_obtencion = ?,
          documento_archivo = ?
        WHERE id = ?
      `;

      await pool.execute(query, [
        nivel_formacion,
        programa_academico,
        institucion,
        pais,
        fecha_obtencion || null,
        documento_archivo || null,
        String(id)
      ]);

      return await this.findById(id);
    } catch (error) {
      console.error('Error en updateById:', error);
      throw error;
    }
  }

  // Eliminar formación académica
  static async deleteById(id) {
    try {
      const query = `DELETE FROM formaciones_academicas WHERE id = ?`;
      const [result] = await pool.execute(query, [String(id)]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en deleteById:', error);
      throw error;
    }
  }

  // Actualizar solo el documento de una formación
  static async updateDocumento(id, documento_archivo) {
    try {
      const query = `
        UPDATE formaciones_academicas 
        SET documento_archivo = ?
        WHERE id = ?
      `;

      await pool.execute(query, [documento_archivo, String(id)]);
      return await this.findById(id);
    } catch (error) {
      console.error('Error en updateDocumento:', error);
      throw error;
    }
  }

  // Eliminar documento de una formación
  static async removeDocumento(id) {
    try {
      const query = `
        UPDATE formaciones_academicas 
        SET documento_archivo = NULL
        WHERE id = ?
      `;

      await pool.execute(query, [String(id)]);
      return await this.findById(id);
    } catch (error) {
      console.error('Error en removeDocumento:', error);
      throw error;
    }
  }

  // Obtener estadísticas de formación de un docente
  static async getStatsById(userId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_formaciones,
          COUNT(CASE WHEN nivel_formacion = 'Doctorado' THEN 1 END) as doctorados,
          COUNT(CASE WHEN nivel_formacion = 'Maestría' THEN 1 END) as maestrias,
          COUNT(CASE WHEN nivel_formacion = 'Licenciatura' THEN 1 END) as licenciaturas,
          COUNT(CASE WHEN documento_archivo IS NOT NULL THEN 1 END) as con_documentos
        FROM formaciones_academicas 
        WHERE user_id = ?
      `;

      const [result] = await pool.execute(query, [String(userId)]);
      return result[0];
    } catch (error) {
      console.error('Error en getStatsById:', error);
      throw error;
    }
  }
}

module.exports = FormacionAcademica;
