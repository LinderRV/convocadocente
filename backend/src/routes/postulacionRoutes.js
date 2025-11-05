const express = require('express');
const router = express.Router();
const PostulacionController = require('../controllers/PostulacionController');
const { authenticate } = require('../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authenticate);

// GET /api/postulaciones/facultades - Obtener todas las facultades
router.get('/facultades', PostulacionController.getFacultades);

// GET /api/postulaciones/especialidades/:c_codfac - Obtener especialidades por facultad
router.get('/especialidades/:c_codfac', PostulacionController.getEspecialidadesByFacultad);

// GET /api/postulaciones/cursos/:c_codfac/:c_codesp - Obtener cursos por especialidad
router.get('/cursos/:c_codfac/:c_codesp', PostulacionController.getCursosByEspecialidad);

// GET /api/postulaciones/verificar/:c_codfac/:c_codesp - Verificar si puede crear postulación
router.get('/verificar/:c_codfac/:c_codesp', PostulacionController.verificarPostulacion);

// POST /api/postulaciones/crear - Crear nueva postulación completa
router.post('/crear', PostulacionController.crearPostulacion);

module.exports = router;
