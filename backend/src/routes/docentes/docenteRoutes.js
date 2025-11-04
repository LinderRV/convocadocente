const express = require('express');
const { DocenteController, uploadCV } = require('../../controllers/docentes/DocenteController');
const { authenticate } = require('../../middleware/auth');

const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authenticate);

// GET /api/docentes/perfil - Obtener perfil del docente autenticado
router.get('/perfil', DocenteController.getPerfil);

// PUT /api/docentes/perfil - Actualizar perfil del docente
router.put('/perfil', DocenteController.updatePerfil);

// POST /api/docentes/cv - Subir CV (con middleware de multer)
router.post('/cv', uploadCV, DocenteController.uploadCV);

// GET /api/docentes/cv/download - Descargar CV del docente autenticado
router.get('/cv/download', DocenteController.downloadCV);

// DELETE /api/docentes/cv - Eliminar CV del docente
router.delete('/cv', DocenteController.deleteCV);

// GET /api/docentes/stats - Obtener estadísticas (solo para administradores)
router.get('/stats', DocenteController.getStats);

module.exports = router;
