const { pool } = require('../../config/database');

class Docente {
  // Obtener perfil de docente por user_id
  static async findByUserId(userId) {
    try {
      const query = `
        SELECT 
          d.id,
          d.user_id,
          d.nombres,
          d.apellidos,
          d.dni,
          d.fecha_nacimiento,
          d.genero,
          d.pais,
          d.direccion,
          d.telefono,
          d.cv_archivo,
          u.nombre as nombre_usuario,
          u.email
        FROM docentes d
        INNER JOIN usuarios u ON d.user_id = u.id
        WHERE d.user_id = ? AND u.estado = 1
      `;
      
      const [result] = await pool.execute(query, [userId]);
      return result[0] || null;
      
    } catch (error) {
      console.error('Error en findByUserId:', error);
      throw error;
    }
  }

  // Crear perfil de docente
  static async create(docenteData) {
    try {
      const {
        user_id,
        nombres,
        apellidos,
        dni,
        fecha_nacimiento,
        genero,
        pais,
        direccion,
        telefono,
        cv_archivo = null
      } = docenteData;

      const query = `
        INSERT INTO docentes (
          user_id, nombres, apellidos, dni, fecha_nacimiento, 
          genero, pais, direccion, telefono, cv_archivo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.execute(query, [
        user_id, nombres, apellidos, dni, fecha_nacimiento,
        genero, pais, direccion, telefono, cv_archivo
      ]);
      
      // Retornar el docente creado
      return await this.findByUserId(user_id);
      
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  // Actualizar perfil de docente
  static async update(userId, docenteData) {
    try {
      const {
        nombres,
        apellidos,
        dni,
        fecha_nacimiento,
        genero,
        pais,
        direccion,
        telefono
      } = docenteData;

      const query = `
        UPDATE docentes 
        SET nombres = ?, apellidos = ?, dni = ?, fecha_nacimiento = ?,
            genero = ?, pais = ?, direccion = ?, telefono = ?
        WHERE user_id = ?
      `;
      
      const [result] = await pool.execute(query, [
        nombres, apellidos, dni, fecha_nacimiento,
        genero, pais, direccion, telefono, userId
      ]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      // Retornar el docente actualizado
      return await this.findByUserId(userId);
      
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  // Actualizar CV del docente
  static async updateCV(userId, cvArchivo) {
    try {
      const query = `
        UPDATE docentes 
        SET cv_archivo = ?
        WHERE user_id = ?
      `;
      
      const [result] = await pool.execute(query, [cvArchivo, userId]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      // Retornar el docente actualizado
      return await this.findByUserId(userId);
      
    } catch (error) {
      console.error('Error en updateCV:', error);
      throw error;
    }
  }

  // Verificar si existe un docente con el DNI especificado (para validación)
  static async findByDNI(dni, excludeUserId = null) {
    try {
      let query = `
        SELECT id, user_id, dni 
        FROM docentes 
        WHERE dni = ?
      `;
      let params = [dni];
      
      if (excludeUserId) {
        query += ` AND user_id != ?`;
        params.push(excludeUserId);
      }
      
      const [result] = await pool.execute(query, params);
      return result[0] || null;
      
    } catch (error) {
      console.error('Error en findByDNI:', error);
      throw error;
    }
  }

  // Obtener estadísticas básicas de docentes
  static async getStats() {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_docentes,
          COUNT(CASE WHEN cv_archivo IS NOT NULL THEN 1 END) as con_cv,
          COUNT(CASE WHEN cv_archivo IS NULL THEN 1 END) as sin_cv,
          COUNT(CASE WHEN dni IS NOT NULL THEN 1 END) as con_dni
        FROM docentes d
        INNER JOIN usuarios u ON d.user_id = u.id
        WHERE u.estado = 1
      `;
      
      const [result] = await pool.execute(statsQuery);
      return result[0];
      
    } catch (error) {
      console.error('Error en getStats:', error);
      throw error;
    }
  }

  // Obtener docente por ID (para administradores)
  static async findById(id) {
    try {
      const query = `
        SELECT 
          d.*,
          u.nombre as nombre_usuario,
          u.email
        FROM docentes d
        INNER JOIN usuarios u ON d.user_id = u.id
        WHERE d.id = ? AND u.estado = 1
      `;
      
      const [result] = await pool.execute(query, [id]);
      return result[0] || null;
      
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }

  // Eliminar CV del docente
  static async removeCV(userId) {
    try {
      const query = `
        UPDATE docentes 
        SET cv_archivo = NULL
        WHERE user_id = ?
      `;
      
      const [result] = await pool.execute(query, [userId]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await this.findByUserId(userId);
      
    } catch (error) {
      console.error('Error en removeCV:', error);
      throw error;
    }
  }
}

module.exports = Docente;