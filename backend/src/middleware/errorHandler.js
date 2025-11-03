// Middleware para manejar errores
const errorHandler = (err, req, res, next) => {
    console.error('Error stack:', err.stack);

    // Error de validación de Mongoose/Sequelize
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors
        });
    }

    // Error de clave duplicada (MySQL)
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'El recurso ya existe',
            error: 'Duplicate entry'
        });
    }

    // Error de referencia foránea (MySQL)
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
            success: false,
            message: 'Referencia inválida a recurso relacionado',
            error: 'Foreign key constraint'
        });
    }

    // Error de sintaxis SQL
    if (err.code && err.code.startsWith('ER_')) {
        return res.status(500).json({
            success: false,
            message: 'Error en la base de datos',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Database error'
        });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expirado'
        });
    }

    // Error de multer (subida de archivos)
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            message: 'El archivo es demasiado grande',
            maxSize: '5MB'
        });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            message: 'Tipo de archivo no permitido'
        });
    }

    // Errores personalizados
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message || 'Error en la solicitud'
        });
    }

    // Error por defecto
    const statusCode = err.status || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message;

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            error: err
        })
    });
};

module.exports = errorHandler;
