const Curso = require('../models/Curso');

class CursosController {
  // Obtener todos los cursos con paginación
  static async getAllCursos(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '' 
      } = req.query;
      
      // Validar parámetros
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Máximo 100 items por página
      
      const userId = req.user.id;
      
      const result = await Curso.findAllCursos(pageNum, limitNum, search, userId);
      
      res.json({
        success: true,
        data: result.cursos,
        pagination: result.pagination,
        message: 'Cursos obtenidos exitosamente'
      });
      
    } catch (error) {
      console.error('[CursosController] Error en getAllCursos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener estadísticas de cursos
  static async getCursosStats(req, res) {
    try {
      const stats = await Curso.getCursosStats();
      
      res.json({
        success: true,
        data: stats,
        message: 'Estadísticas obtenidas exitosamente'
      });
      
    } catch (error) {
      console.error('[CursosController] Error en getCursosStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener un curso por ID
  static async getCursoById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de curso inválido'
        });
      }
      
      const curso = await Curso.findById(parseInt(id));
      
      if (!curso) {
        return res.status(404).json({
          success: false,
          message: 'Curso no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: curso,
        message: 'Curso obtenido exitosamente'
      });
      
    } catch (error) {
      console.error('[CursosController] Error en getCursoById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Cambiar estado de un curso (activar/desactivar)
  static async toggleCursoStatus(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de curso inválido'
        });
      }
      
      // Primero obtener el curso actual y verificar que pertenece a la especialidad del director
      const cursoActual = await Curso.findByIdForUser(parseInt(id), userId);
      
      if (!cursoActual) {
        return res.status(404).json({
          success: false,
          message: 'Curso no encontrado o no tienes permisos para modificarlo'
        });
      }
      
      // Cambiar el estado (0 -> 1, 1 -> 0)
      const nuevoEstado = cursoActual.estado === 1 ? 0 : 1;
      
      const cursoActualizado = await Curso.updateCursoStatus(parseInt(id), nuevoEstado);
      
      if (!cursoActualizado) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo actualizar el estado del curso'
        });
      }
      
      res.json({
        success: true,
        data: cursoActualizado,
        message: `Curso ${nuevoEstado === 1 ? 'activado' : 'desactivado'} exitosamente`
      });
      
    } catch (error) {
      console.error('[CursosController] Error en toggleCursoStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = CursosController;
