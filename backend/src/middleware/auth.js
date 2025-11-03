const AuthService = require('../services/AuthService');

// Middleware para verificar autenticación
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        const token = authHeader.substring(7); // Remover 'Bearer '
        
        try {
            const decoded = AuthService.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Middleware para verificar roles específicos
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para acceder a este recurso'
            });
        }

        next();
    };
};

// Middleware para verificar si es administrador
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.rol !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Acceso restringido a administradores'
        });
    }
    next();
};

// Middleware para verificar si es coordinador o administrador
const requireCoordinatorOrAdmin = (req, res, next) => {
    if (!req.user || !['admin', 'coordinador'].includes(req.user.rol)) {
        return res.status(403).json({
            success: false,
            message: 'Acceso restringido a coordinadores y administradores'
        });
    }
    next();
};

// Middleware para verificar si el usuario puede acceder a su propio recurso
const requireOwnershipOrAdmin = (req, res, next) => {
    const resourceUserId = parseInt(req.params.userId || req.params.id);
    const currentUserId = req.user.id;
    const isAdmin = req.user.rol === 'admin';

    if (!isAdmin && resourceUserId !== currentUserId) {
        return res.status(403).json({
            success: false,
            message: 'Solo puedes acceder a tus propios recursos'
        });
    }

    next();
};

// Middleware opcional de autenticación (no falla si no hay token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            
            try {
                const decoded = AuthService.verifyToken(token);
                req.user = decoded;
            } catch (error) {
                // Token inválido, pero continuamos sin usuario
                req.user = null;
            }
        } else {
            req.user = null;
        }
        
        next();
    } catch (error) {
        console.error('Error en middleware de autenticación opcional:', error);
        req.user = null;
        next();
    }
};

module.exports = {
    authenticate,
    authorize,
    requireAdmin,
    requireCoordinatorOrAdmin,
    requireOwnershipOrAdmin,
    optionalAuth
};
