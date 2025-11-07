const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const ListaPostulacionesController = require('../../controllers/docentes/ListaPostulacionesController');

// Middleware de autenticación para todas las rutas
router.use(authenticate);

// GET /api/docentes/lista-postulaciones - Obtener todas las postulaciones del docente
router.get('/', ListaPostulacionesController.obtenerPostulaciones);

// GET /api/docentes/lista-postulaciones/:id - Obtener detalle de una postulación específica
router.get('/:id', ListaPostulacionesController.obtenerDetallePostulacion);

module.exports = router;
