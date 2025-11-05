const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Usuario = require('../models/Usuario');

class AuthService {
    // Registrar nuevo usuario
    static async register(userData) {
        try {
            // Verificar si el email ya existe
            const existingUser = await Usuario.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('El email ya está registrado');
            }

            // Encriptar contraseña
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

            // Crear usuario
            const userId = await Usuario.create({
                email: userData.email,
                password: hashedPassword,
                nombre: userData.nombre,
                google_id: userData.google_id || null
            });

            const user = await Usuario.findById(userId);
            
            return {
                user: user.toJSON()
            };
        } catch (error) {
            throw new Error(`Error al registrar usuario: ${error.message}`);
        }
    }

    // Iniciar sesión
    static async login(email, password) {
        try {
            // Buscar usuario por email con roles
            const user = await Usuario.findByEmailWithRoles(email);
            if (!user) {
                throw new Error('Credenciales inválidas');
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Credenciales inválidas');
            }

            // Actualizar último acceso
            await Usuario.updateLastLogin(user.id);

            // Generar token JWT
            const token = this.generateToken(user);

            return {
                user: user.toJSON(),
                token
            };
        } catch (error) {
            throw new Error(`Error al iniciar sesión: ${error.message}`);
        }
    }

    // Iniciar sesión con Google
    static async googleLogin(googlePayload) {
        try {
            const { email, name, sub: google_id, picture } = googlePayload;

            if (!email) {
                throw new Error('Email no encontrado en los datos de Google');
            }

            // Buscar usuario existente por email
            let user = await Usuario.findByEmailWithRoles(email);

            if (!user) {
                // Crear nuevo usuario si no existe
                const userId = await Usuario.create({
                    email: email,
                    nombre: name || email.split('@')[0],
                    google_id: google_id,
                    password: null // Sin contraseña para usuarios de Google
                });

                user = await Usuario.findByIdWithRoles(userId);
            } else {
                // Actualizar google_id si no existe
                if (!user.google_id && google_id) {
                    await Usuario.updateGoogleId(user.id, google_id);
                    user.google_id = google_id;
                }
            }

            // Actualizar último acceso
            await Usuario.updateLastLogin(user.id);

            // Generar token JWT
            const token = this.generateToken(user);

            return {
                user: user.toJSON(),
                token
            };
        } catch (error) {
            throw new Error(`Error al iniciar sesión con Google: ${error.message}`);
        }
    }

    // Generar token JWT
    static generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            nombre: user.nombre
        };

        return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h',
            issuer: 'convocadocente',
            audience: 'convocadocente-users'
        });
    }

    // Verificar token JWT
    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }

    // Refrescar token
    static async refreshToken(userId) {
        try {
            const user = await Usuario.findById(userId);
            if (!user || user.estado !== 'activo') {
                throw new Error('Usuario no encontrado o inactivo');
            }

            return this.generateToken(user);
        } catch (error) {
            throw new Error(`Error al refrescar token: ${error.message}`);
        }
    }

    // Verificar email
    static async verifyEmail(token) {
        try {
            const verified = await Usuario.verifyEmail(token);
            if (!verified) {
                throw new Error('Token de verificación inválido o expirado');
            }

            return { message: 'Email verificado correctamente' };
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    }

    // Solicitar recuperación de contraseña
    static async requestPasswordReset(email) {
        try {
            const user = await Usuario.findByEmail(email);
            if (!user) {
                // Por seguridad, no revelamos si el email existe
                return { message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' };
            }

            // Generar token de recuperación
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

            await Usuario.update(user.id, {
                reset_password_token: resetToken,
                reset_password_expires: resetExpires
            });

            return {
                message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña',
                resetToken // En producción, enviar por email
            };
        } catch (error) {
            throw new Error(`Error al solicitar recuperación: ${error.message}`);
        }
    }

    // Restablecer contraseña
    static async resetPassword(token, newPassword) {
        try {
            // Buscar usuario con token válido
            const sql = `
                SELECT * FROM usuarios 
                WHERE reset_password_token = ? 
                AND reset_password_expires > NOW() 
                AND estado = 'activo'
            `;
            const results = await require('../config/database').query(sql, [token]);
            
            if (results.length === 0) {
                throw new Error('Token inválido o expirado');
            }

            const user = results[0];

            // Encriptar nueva contraseña
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Actualizar contraseña y limpiar tokens
            await Usuario.update(user.id, {
                password: hashedPassword,
                reset_password_token: null,
                reset_password_expires: null
            });

            return { message: 'Contraseña restablecida correctamente' };
        } catch (error) {
            throw new Error(`Error al restablecer contraseña: ${error.message}`);
        }
    }

    // Cambiar contraseña (usuario autenticado)
    static async changePassword(userId, currentPassword, newPassword) {
        try {
            const user = await Usuario.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Verificar contraseña actual
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Contraseña actual incorrecta');
            }

            // Encriptar nueva contraseña
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            await Usuario.update(userId, { password: hashedPassword });

            return { message: 'Contraseña cambiada correctamente' };
        } catch (error) {
            throw new Error(`Error al cambiar contraseña: ${error.message}`);
        }
    }

    // Obtener perfil de usuario
    static async getProfile(userId) {
        try {
            const user = await Usuario.findByIdWithRoles(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            return user.toJSON();
        } catch (error) {
            throw new Error(`Error al obtener perfil: ${error.message}`);
        }
    }

    // Actualizar perfil
    static async updateProfile(userId, updateData) {
        try {
            // Campos permitidos para actualizar
            const allowedFields = ['nombre', 'apellido', 'telefono'];
            const filteredData = {};
            
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    filteredData[field] = updateData[field];
                }
            });

            if (Object.keys(filteredData).length === 0) {
                throw new Error('No hay datos válidos para actualizar');
            }

            const updated = await Usuario.update(userId, filteredData);
            if (!updated) {
                throw new Error('No se pudo actualizar el perfil');
            }

            const user = await Usuario.findById(userId);
            return user.toJSON();
        } catch (error) {
            throw new Error(`Error al actualizar perfil: ${error.message}`);
        }
    }

    // Validar permisos de rol
    static hasRole(userRole, requiredRoles) {
        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(userRole);
        }
        return userRole === requiredRoles;
    }

    // Validar permisos de administrador
    static isAdmin(userRole) {
        return userRole === 'admin';
    }

    // Validar permisos de coordinador o superior
    static isCoordinatorOrAbove(userRole) {
        return ['admin', 'coordinador'].includes(userRole);
    }
}

module.exports = AuthService;
