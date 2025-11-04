const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/UsuariosController');
const { authenticate } = require('../middleware/auth');

// Rutas para usuarios administrativos (requieren autenticación)
router.get('/administrative', authenticate, UsuariosController.getAdministrativeUsers);
router.get('/administrative/:id', authenticate, UsuariosController.getAdministrativeUserById);
router.patch('/administrative/:id/status', authenticate, UsuariosController.toggleUserStatus);

module.exports = router;
