const express = require('express');
const router = express.Router();
const PostulacionesController = require('../controllers/PostulacionesController');
const { authenticate } = require('../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authenticate);

// GET /api/postulaciones - Obtener todas las postulaciones (con paginación)
router.get('/', PostulacionesController.getPostulaciones);

// PUT /api/postulaciones/:id/estado - Actualizar estado de postulación
router.put('/:id/estado', PostulacionesController.updateEstado);

module.exports = router;
