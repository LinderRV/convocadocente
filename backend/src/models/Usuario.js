const { query } = require('../config/database');

class Usuario {
    constructor(data = {}) {
        Object.assign(this, data);
    }

    // Crear un nuevo usuario
    static async create(userData) {
        const sql = `
            INSERT INTO usuarios (email, password, nombre, apellido, telefono, rol, estado, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        const params = [
            userData.email,
            userData.password,
            userData.nombre,
            userData.apellido,
            userData.telefono || null,
            userData.rol || 'docente',
            userData.estado || 'activo'
        ];
        
        const result = await query(sql, params);
        return result.insertId;
    }

    // Buscar usuario por email
    static async findByEmail(email) {
        const sql = 'SELECT * FROM usuarios WHERE email = ? LIMIT 1';
        const results = await query(sql, [email]);
        return results.length > 0 ? new Usuario(results[0]) : null;
    }

    // Buscar usuario por ID
    static async findById(id) {
        const sql = 'SELECT * FROM usuarios WHERE id = ? LIMIT 1';
        const results = await query(sql, [id]);
        return results.length > 0 ? new Usuario(results[0]) : null;
    }

    // Actualizar usuario
    static async update(id, updateData) {
        const fields = [];
        const values = [];
        
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });
        
        if (fields.length === 0) return false;
        
        values.push(id);
        const sql = `UPDATE usuarios SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        
        const result = await query(sql, values);
        return result.affectedRows > 0;
    }

    // Listar usuarios
    static async findAll(filters = {}) {
        let sql = 'SELECT id, email, nombre, apellido, telefono, estado, rol, created_at FROM usuarios WHERE 1=1';
        const params = [];

        if (filters.rol) {
            sql += ' AND rol = ?';
            params.push(filters.rol);
        }

        if (filters.estado) {
            sql += ' AND estado = ?';
            params.push(filters.estado);
        }

        sql += ' ORDER BY created_at DESC';

        if (filters.limit) {
            sql += ' LIMIT ?';
            params.push(parseInt(filters.limit));
        }

        const results = await query(sql, params);
        return results.map(row => new Usuario(row));
    }

    // Eliminar usuario (soft delete)
    static async delete(id) {
        const sql = 'UPDATE usuarios SET estado = "inactivo" WHERE id = ?';
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }

    // Método para excluir campos sensibles
    toJSON() {
        const { password, ...userData } = this;
        return userData;
    }
}

module.exports = Usuario;

module.exports = Usuario;
