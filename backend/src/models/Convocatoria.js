const { query } = require('../config/database');

class Convocatoria {
    constructor(data = {}) {
        Object.assign(this, data);
    }

    // Crear nueva convocatoria
    static async create(convocatoriaData) {
        const sql = `
            INSERT INTO convocatorias (titulo, descripcion, area, asignatura, estado, fecha_inicio, fecha_fin, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const params = [
            convocatoriaData.titulo,
            convocatoriaData.descripcion,
            convocatoriaData.area,
            convocatoriaData.asignatura,
            convocatoriaData.estado || 'borrador',
            convocatoriaData.fecha_inicio,
            convocatoriaData.fecha_fin
        ];
        
        const result = await query(sql, params);
        return result.insertId;
    }

    // Buscar convocatoria por ID
    static async findById(id) {
        const sql = 'SELECT * FROM convocatorias WHERE id = ? LIMIT 1';
        const results = await query(sql, [id]);
        return results.length > 0 ? new Convocatoria(results[0]) : null;
    }

    // Listar convocatorias
    static async findAll(filters = {}) {
        let sql = 'SELECT * FROM convocatorias WHERE 1=1';
        const params = [];

        if (filters.estado) {
            sql += ' AND estado = ?';
            params.push(filters.estado);
        }

        if (filters.area) {
            sql += ' AND area LIKE ?';
            params.push(`%${filters.area}%`);
        }

        if (filters.search) {
            sql += ' AND (titulo LIKE ? OR descripcion LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        sql += ' ORDER BY created_at DESC';

        if (filters.limit) {
            sql += ' LIMIT ?';
            params.push(parseInt(filters.limit));
        }

        const results = await query(sql, params);
        return results.map(row => new Convocatoria(row));
    }

    // Actualizar convocatoria
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
        const sql = `UPDATE convocatorias SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
        
        const result = await query(sql, values);
        return result.affectedRows > 0;
    }

    // Eliminar convocatoria
    static async delete(id) {
        const sql = 'DELETE FROM convocatorias WHERE id = ?';
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }

    // Contar convocatorias
    static async count(filters = {}) {
        let sql = 'SELECT COUNT(*) as total FROM convocatorias WHERE 1=1';
        const params = [];

        if (filters.estado) {
            sql += ' AND estado = ?';
            params.push(filters.estado);
        }

        const results = await query(sql, params);
        return results[0].total;
    }
}

module.exports = Convocatoria;

module.exports = Convocatoria;
