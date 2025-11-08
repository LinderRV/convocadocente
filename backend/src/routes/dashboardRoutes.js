const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const { authenticate } = require('../middleware/auth');

// Ruta para obtener estadísticas del dashboard (Administrador y Decano)
router.get('/stats', authenticate, DashboardController.getDashboardStats);

module.exports = router;
