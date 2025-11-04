const express = require('express');
const router = express.Router();
const FormacionesController = require('../../controllers/docentes/FormacionesController');
const { authenticate } = require('../../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authenticate);

// GET /api/docentes/formaciones - Obtener todas las formaciones del docente
router.get('/', FormacionesController.getFormaciones);

// GET /api/docentes/formaciones/stats - Obtener estadísticas de formaciones
router.get('/stats', FormacionesController.getEstadisticas);

// GET /api/docentes/formaciones/:id - Obtener formación por ID
router.get('/:id', FormacionesController.getFormacionById);

// POST /api/docentes/formaciones - Crear nueva formación
router.post('/', FormacionesController.createFormacion);

// PUT /api/docentes/formaciones/:id - Actualizar formación
router.put('/:id', FormacionesController.updateFormacion);

// DELETE /api/docentes/formaciones/:id - Eliminar formación
router.delete('/:id', FormacionesController.deleteFormacion);

module.exports = router;
