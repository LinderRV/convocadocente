const express = require('express');
const router = express.Router();
const { ExperienciasController, upload } = require('../../controllers/docentes/ExperienciasController');
const { authenticate } = require('../../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authenticate);

// GET /api/docentes/experiencias - Obtener todas las experiencias del docente
router.get('/', ExperienciasController.getExperiencias);

// GET /api/docentes/experiencias/stats - Obtener estadísticas de experiencias
router.get('/stats', ExperienciasController.getEstadisticas);

// GET /api/docentes/experiencias/:id - Obtener experiencia por ID
router.get('/:id', ExperienciasController.getExperienciaById);

// POST /api/docentes/experiencias - Crear nueva experiencia
router.post('/', upload.single('constancia'), ExperienciasController.createExperiencia);

// PUT /api/docentes/experiencias/:id - Actualizar experiencia
router.put('/:id', upload.single('constancia'), ExperienciasController.updateExperiencia);

// POST /api/docentes/experiencias/:id/documento - Subir documento
router.post('/:id/documento', upload.single('constancia'), ExperienciasController.uploadDocumento);

// GET /api/docentes/experiencias/:id/documento - Descargar documento
router.get('/:id/documento', ExperienciasController.downloadDocumento);

module.exports = router;
