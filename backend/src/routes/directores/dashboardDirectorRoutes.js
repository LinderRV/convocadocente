const express = require('express');
const router = express.Router();
const DashboardDirectorController = require('../../controllers/directores/DashboardDirectorController');
const { authenticate } = require('../../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authenticate);

// Rutas del dashboard director
// GET /api/directores/dashboard/stats - Obtener estadísticas del dashboard
router.get('/stats', DashboardDirectorController.getDashboardStats);

module.exports = router;
