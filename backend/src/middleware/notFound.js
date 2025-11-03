// Middleware para rutas no encontradas
const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        availableEndpoints: {
            auth: [
                'POST /api/auth/register',
                'POST /api/auth/login',
                'POST /api/auth/refresh',
                'POST /api/auth/verify-email',
                'POST /api/auth/forgot-password',
                'POST /api/auth/reset-password'
            ],
            profile: [
                'GET /api/auth/profile',
                'PUT /api/auth/profile',
                'POST /api/auth/change-password'
            ],
            convocatorias: [
                'GET /api/convocatorias',
                'GET /api/convocatorias/:id',
                'POST /api/convocatorias',
                'PUT /api/convocatorias/:id',
                'DELETE /api/convocatorias/:id'
            ],
            health: [
                'GET /api/health'
            ]
        }
    });
};

module.exports = notFound;
