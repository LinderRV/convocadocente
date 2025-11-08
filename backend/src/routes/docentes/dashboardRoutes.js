const express = require('express');
const router = express.Router();
const DashboardController = require('../../controllers/docentes/DashboardController');
const { authenticate } = require('../../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticate);

// Ruta principal del dashboard
router.get('/estadisticas', DashboardController.getEstadisticas);

module.exports = router;
