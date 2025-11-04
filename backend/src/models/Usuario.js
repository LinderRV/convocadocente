const { query } = require('../config/database');

class Usuario {
    constructor(data = {}) {
        Object.assign(this, data);
    }

    // Crear un nuevo usuario
    static async create(userData) {
        const sql = `
            INSERT INTO usuarios (email, password, nombre, google_id, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const params = [
            userData.email,
            userData.password,
            userData.nombre,
            userData.google_id || null
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

    // Actualizar último login
    static async updateLastLogin(id) {
        const sql = 'UPDATE usuarios SET last_login = NOW() WHERE id = ?';
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }

    // Actualizar Google ID
    static async updateGoogleId(id, googleId) {
        const sql = 'UPDATE usuarios SET google_id = ? WHERE id = ?';
        const result = await query(sql, [googleId, id]);
        return result.affectedRows > 0;
    }

    // Obtener usuarios administrativos con paginación
    static async findAdministrativeUsers(filters = {}) {
        try {
            console.log('🔍 findAdministrativeUsers iniciado con filtros:', filters);
            const { page = 1, limit = 10, search = '' } = filters;
            const offset = (page - 1) * limit;
            console.log('📊 Parámetros de paginación:', { page, limit, offset, search });

            // Consulta real para usuarios administrativos con JOINs
            const realSql = `
                SELECT
                    u.id,
                    u.nombre AS usuario,
                    u.email,
                    r.nombre AS rol,
                    f.nom_fac AS facultad,
                    e.nomesp AS especialidad,
                    CASE
                        WHEN u.estado = 1 THEN 'Activo'
                        WHEN u.estado = 0 THEN 'Inactivo'
                    END AS estado
                FROM usuarios u
                LEFT JOIN usuario_roles ur ON ur.user_id = u.id
                LEFT JOIN roles r ON r.id = ur.role_id
                LEFT JOIN usuario_facultad uf ON uf.user_id = u.id
                LEFT JOIN facultades f ON f.c_codfac = uf.c_codfac
                LEFT JOIN usuario_especialidad ue ON ue.user_id = u.id
                LEFT JOIN especialidades e ON e.c_codfac = ue.c_codfac
                                           AND e.c_codesp = ue.c_codesp
                WHERE r.id IN (1, 2, 3)
                ORDER BY u.id ASC
            `;

            console.log('🔍 Ejecutando consulta real con JOINs...');
            console.log('SQL real:', realSql);
            
            const realResults = await query(realSql);
            console.log('✅ Resultados reales:', realResults);

            const response = {
                data: realResults,
                page: page,
                limit: limit,
                total: realResults.length,
                totalPages: Math.ceil(realResults.length / limit)
            };
            
            console.log('📤 Respuesta final real:', response);
            return response;
            
        } catch (error) {
            console.error('❌ Error en findAdministrativeUsers:', error);
            console.error('❌ Stack trace:', error.stack);
            throw error;
        }
    }

    // Obtener usuario administrativo por ID
    static async findAdministrativeUserById(id) {
        const sql = `
            SELECT
                u.id,
                u.nombre AS usuario,
                u.email,
                r.nombre AS rol,
                f.nom_fac AS facultad,
                e.nomesp AS especialidad,
                CASE
                    WHEN u.estado = 1 THEN 'Activo'
                    WHEN u.estado = 0 THEN 'Inactivo'
                END AS estado,
                u.google_id
            FROM usuarios u
            LEFT JOIN usuario_roles ur ON ur.user_id = u.id
            LEFT JOIN roles r ON r.id = ur.role_id
            LEFT JOIN usuario_facultad uf ON uf.user_id = u.id
            LEFT JOIN facultades f ON f.c_codfac = uf.c_codfac
            LEFT JOIN usuario_especialidad ue ON ue.user_id = u.id
            LEFT JOIN especialidades e ON e.c_codfac = ue.c_codfac
                                       AND e.c_codesp = ue.c_codesp
            WHERE u.id = ? AND r.id IN (1, 2, 3)
            LIMIT 1
        `;
        
        const results = await query(sql, [id]);
        return results.length > 0 ? results[0] : null;
    }

    // Actualizar estado de usuario
    static async updateUserStatus(id, estado) {
        const sql = 'UPDATE usuarios SET estado = ? WHERE id = ?';
        const result = await query(sql, [estado, id]);
        return result.affectedRows > 0;
    }

    // Método para excluir campos sensibles
    toJSON() {
        const { password, ...userData } = this;
        return userData;
    }
}

module.exports = Usuario;
