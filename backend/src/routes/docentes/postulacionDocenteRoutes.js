const express = require('express');
const router = express.Router();
const PostulacionDocenteController = require('../../controllers/docentes/PostulacionDocenteController');
const { authenticate } = require('../../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authenticate);

// GET /api/docentes/postulaciones/facultades - Obtener todas las facultades
router.get('/facultades', PostulacionDocenteController.getFacultades);

// GET /api/docentes/postulaciones/especialidades/:c_codfac - Obtener especialidades por facultad
router.get('/especialidades/:c_codfac', PostulacionDocenteController.getEspecialidadesByFacultad);

// GET /api/docentes/postulaciones/cursos/:c_codfac/:c_codesp - Obtener cursos por especialidad
router.get('/cursos/:c_codfac/:c_codesp', PostulacionDocenteController.getCursosByEspecialidad);

// GET /api/docentes/postulaciones/verificar/:c_codfac/:c_codesp - Verificar si puede crear postulación
router.get('/verificar/:c_codfac/:c_codesp', PostulacionDocenteController.verificarPostulacion);

// POST /api/docentes/postulaciones/crear - Crear nueva postulación completa
router.post('/crear', PostulacionDocenteController.crearPostulacion);

module.exports = router;
