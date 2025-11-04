const express = require('express');
const CursosController = require('../controllers/CursosController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticate);

// GET /api/cursos - Obtener todos los cursos con paginación
router.get('/', CursosController.getAllCursos);

// GET /api/cursos/stats - Obtener estadísticas de cursos
router.get('/stats', CursosController.getCursosStats);

// GET /api/cursos/:id - Obtener un curso por ID
router.get('/:id', CursosController.getCursoById);

// PATCH /api/cursos/:id/status - Cambiar estado de un curso
router.patch('/:id/status', CursosController.toggleCursoStatus);

module.exports = router;
