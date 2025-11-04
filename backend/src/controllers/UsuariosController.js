const Usuario = require('../models/Usuario');

class UsuariosController {
    // Obtener usuarios administrativos
    static async getAdministrativeUsers(req, res) {
        try {
            console.log('🔍 Iniciando búsqueda de usuarios administrativos...');
            const { page = 1, limit = 10, search = '' } = req.query;
            console.log('📄 Parámetros recibidos:', { page, limit, search });
            
            console.log('🔄 Llamando a Usuario.findAdministrativeUsers...');
            const usuarios = await Usuario.findAdministrativeUsers({
                page: parseInt(page),
                limit: parseInt(limit),
                search: search.trim()
            });
            
            console.log('✅ Usuarios obtenidos:', usuarios);

            res.json({
                success: true,
                data: usuarios.data,
                pagination: {
                    page: usuarios.page,
                    limit: usuarios.limit,
                    total: usuarios.total,
                    totalPages: usuarios.totalPages
                }
            });
        } catch (error) {
            console.error('❌ Error al obtener usuarios administrativos:', error);
            console.error('❌ Stack trace:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener usuario administrativo por ID
    static async getAdministrativeUserById(req, res) {
        try {
            const { id } = req.params;
            
            const usuario = await Usuario.findAdministrativeUserById(id);
            
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: usuario
            });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Cambiar estado de usuario administrativo
    static async toggleUserStatus(req, res) {
        try {
            console.log('🔄 Cambiando estado de usuario...');
            const { id } = req.params;
            const { estado } = req.body;
            
            console.log('📄 Parámetros:', { id, estado });

            // Validar que el estado sea válido
            if (!['Activo', 'Inactivo'].includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado inválido. Debe ser "Activo" o "Inactivo"'
                });
            }

            // Convertir estado a valor numérico para la base de datos
            const estadoNumerico = estado === 'Activo' ? 1 : 0;
            
            const result = await Usuario.updateUserStatus(id, estadoNumerico);
            
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            console.log('✅ Estado actualizado correctamente');
            res.json({
                success: true,
                message: `Usuario ${estado === 'Activo' ? 'activado' : 'desactivado'} correctamente`,
                data: { id, estado }
            });
        } catch (error) {
            console.error('❌ Error al cambiar estado del usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

module.exports = UsuariosController;
