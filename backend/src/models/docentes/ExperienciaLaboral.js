const { pool } = require('../../config/database');

class ExperienciaLaboral {
  // Obtener todas las experiencias laborales de un docente
  static async findByUserId(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const limitStr = String(parseInt(limit));
      const offsetStr = String(parseInt(offset));
      
      const query = `
        SELECT 
          id,
          user_id,
          pais,
          sector,
          empresa,
          ruc,
          cargo,
          fecha_inicio,
          fecha_fin,
          actual,
          sin_experiencia,
          constancia_archivo
        FROM experiencias_laborales 
        WHERE user_id = ?
        ORDER BY fecha_inicio DESC
        LIMIT ? OFFSET ?
      `;
      
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM experiencias_laborales 
        WHERE user_id = ?
      `;
      
      const [experiencias] = await pool.execute(query, [String(userId), limitStr, offsetStr]);
      const [countResult] = await pool.execute(countQuery, [String(userId)]);
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / parseInt(limitStr));
      
      return {
        experiencias,
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

  // Crear nueva experiencia laboral
  static async create(experienciaData) {
    try {
      const {
        user_id,
        pais,
        sector,
        empresa,
        ruc,
        cargo,
        fecha_inicio,
        fecha_fin,
        actual,
        sin_experiencia,
        constancia_archivo
      } = experienciaData;

      const query = `
        INSERT INTO experiencias_laborales 
        (user_id, pais, sector, empresa, ruc, cargo, fecha_inicio, fecha_fin, actual, sin_experiencia, constancia_archivo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await pool.execute(query, [
        String(user_id),
        pais,
        sector,
        empresa,
        ruc || null,
        cargo,
        fecha_inicio,
        fecha_fin || null,
        actual ? 1 : 0,
        sin_experiencia ? 1 : 0,
        constancia_archivo || null
      ]);

      return await this.findById(result.insertId);
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  // Obtener experiencia por ID
  static async findById(id) {
    try {
      const query = `
        SELECT 
          id,
          user_id,
          pais,
          sector,
          empresa,
          ruc,
          cargo,
          fecha_inicio,
          fecha_fin,
          actual,
          sin_experiencia,
          constancia_archivo
        FROM experiencias_laborales 
        WHERE id = ?
      `;

      const [result] = await pool.execute(query, [String(id)]);
      return result[0] || null;
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }

  // Actualizar experiencia laboral
  static async updateById(id, experienciaData) {
    try {
      const {
        pais,
        sector,
        empresa,
        ruc,
        cargo,
        fecha_inicio,
        fecha_fin,
        actual,
        sin_experiencia,
        constancia_archivo
      } = experienciaData;

      const query = `
        UPDATE experiencias_laborales 
        SET 
          pais = ?,
          sector = ?,
          empresa = ?,
          ruc = ?,
          cargo = ?,
          fecha_inicio = ?,
          fecha_fin = ?,
          actual = ?,
          sin_experiencia = ?,
          constancia_archivo = ?
        WHERE id = ?
      `;

      await pool.execute(query, [
        pais,
        sector,
        empresa,
        ruc || null,
        cargo,
        fecha_inicio,
        fecha_fin || null,
        actual ? 1 : 0,
        sin_experiencia ? 1 : 0,
        constancia_archivo || null,
        String(id)
      ]);

      return await this.findById(id);
    } catch (error) {
      console.error('Error en updateById:', error);
      throw error;
    }
  }

  // Eliminar experiencia laboral
  static async deleteById(id) {
    try {
      const query = `DELETE FROM experiencias_laborales WHERE id = ?`;
      const [result] = await pool.execute(query, [String(id)]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en deleteById:', error);
      throw error;
    }
  }

  // Actualizar solo el documento de una experiencia
  static async updateDocumento(id, constancia_archivo) {
    try {
      const query = `
        UPDATE experiencias_laborales 
        SET constancia_archivo = ?
        WHERE id = ?
      `;

      await pool.execute(query, [constancia_archivo, String(id)]);
      return await this.findById(id);
    } catch (error) {
      console.error('Error en updateDocumento:', error);
      throw error;
    }
  }

  // Eliminar documento de una experiencia
  static async removeDocumento(id) {
    try {
      const query = `
        UPDATE experiencias_laborales 
        SET constancia_archivo = NULL
        WHERE id = ?
      `;

      await pool.execute(query, [String(id)]);
      return await this.findById(id);
    } catch (error) {
      console.error('Error en removeDocumento:', error);
      throw error;
    }
  }

  // Obtener estadísticas de experiencias de un docente
  static async getStatsById(userId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_experiencias,
          COUNT(CASE WHEN sector = 'Público' THEN 1 END) as publicas,
          COUNT(CASE WHEN sector = 'Privado' THEN 1 END) as privadas,
          COUNT(CASE WHEN actual = 1 THEN 1 END) as actuales,
          COUNT(CASE WHEN constancia_archivo IS NOT NULL THEN 1 END) as con_documentos
        FROM experiencias_laborales 
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

module.exports = ExperienciaLaboral;
