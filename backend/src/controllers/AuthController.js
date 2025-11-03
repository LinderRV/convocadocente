const { body, validationResult } = require('express-validator');
const AuthService = require('../services/AuthService');

class AuthController {
    // Validaciones para registro
    static registerValidation = [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Debe proporcionar un email válido'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('La contraseña debe tener al menos 8 caracteres')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
        body('nombre')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('El nombre debe tener entre 2 y 100 caracteres')
            .matches(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/)
            .withMessage('El nombre solo puede contener letras y espacios'),
        body('apellido')
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('El apellido debe tener entre 2 y 100 caracteres')
            .matches(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/)
            .withMessage('El apellido solo puede contener letras y espacios'),
        body('telefono')
            .optional()
            .matches(/^[+]?[\d\s\-()]{7,15}$/)
            .withMessage('Formato de teléfono inválido'),
        body('rol')
            .optional()
            .isIn(['docente', 'coordinador'])
            .withMessage('Rol inválido')
    ];

    // Validaciones para login
    static loginValidation = [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Debe proporcionar un email válido'),
        body('password')
            .notEmpty()
            .withMessage('La contraseña es requerida')
    ];

    // Registrar usuario
    static async register(req, res, next) {
        try {
            // Verificar errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const result = await AuthService.register(req.body);

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente. Verifica tu email para activar tu cuenta.',
                data: {
                    user: result.user,
                    // En producción, no enviar el token de verificación
                    ...(process.env.NODE_ENV === 'development' && {
                        verificationToken: result.verificationToken
                    })
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Iniciar sesión
    static async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;
            const result = await AuthService.login(email, password);

            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // Refrescar token
    static async refreshToken(req, res, next) {
        try {
            const userId = req.user.id;
            const newToken = await AuthService.refreshToken(userId);

            res.json({
                success: true,
                message: 'Token renovado exitosamente',
                data: { token: newToken }
            });
        } catch (error) {
            next(error);
        }
    }

    // Verificar email
    static async verifyEmail(req, res, next) {
        try {
            const { token } = req.body;
            
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token de verificación requerido'
                });
            }

            const result = await AuthService.verifyEmail(token);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    // Solicitar recuperación de contraseña
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Email requerido'
                });
            }

            const result = await AuthService.requestPasswordReset(email);

            res.json({
                success: true,
                message: result.message,
                // En desarrollo, mostrar el token
                ...(process.env.NODE_ENV === 'development' && result.resetToken && {
                    resetToken: result.resetToken
                })
            });
        } catch (error) {
            next(error);
        }
    }

    // Restablecer contraseña
    static async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            
            if (!token || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Token y nueva contraseña requeridos'
                });
            }

            // Validar contraseña
            if (password.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
                });
            }

            const result = await AuthService.resetPassword(token, password);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener perfil del usuario
    static async getProfile(req, res, next) {
        try {
            const profile = await AuthService.getProfile(req.user.id);

            res.json({
                success: true,
                data: profile
            });
        } catch (error) {
            next(error);
        }
    }

    // Actualizar perfil del usuario
    static async updateProfile(req, res, next) {
        try {
            const allowedFields = ['nombre', 'apellido', 'telefono'];
            const updateData = {};
            
            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updateData[field] = req.body[field];
                }
            });

            const updatedProfile = await AuthService.updateProfile(req.user.id, updateData);

            res.json({
                success: true,
                message: 'Perfil actualizado exitosamente',
                data: updatedProfile
            });
        } catch (error) {
            next(error);
        }
    }

    // Cambiar contraseña
    static async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Contraseña actual y nueva contraseña requeridas'
                });
            }

            // Validar nueva contraseña
            if (newPassword.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
                return res.status(400).json({
                    success: false,
                    message: 'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
                });
            }

            const result = await AuthService.changePassword(req.user.id, currentPassword, newPassword);

            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    // Cerrar sesión (cliente maneja la eliminación del token)
    static async logout(req, res) {
        res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    }
}

module.exports = AuthController;
