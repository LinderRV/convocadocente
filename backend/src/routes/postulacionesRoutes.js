const express = require('express');
const router = express.Router();
const PostulacionesController = require('../controllers/PostulacionesController');
const { authenticate, authorize } = require('../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authenticate);

// GET /api/postulaciones - Obtener todas las postulaciones (con paginación)
// Permitir acceso a Administradores, Decanos y Directores
router.get('/', authorize('Administrador', 'Decano', 'Director'), PostulacionesController.getPostulaciones);

// PUT /api/postulaciones/:id/estado - Actualizar estado de postulación
// Permitir acceso a Administradores, Decanos y Directores
router.put('/:id/estado', authorize('Administrador', 'Decano', 'Director'), PostulacionesController.updateEstado);

module.exports = router;
