const FormacionAcademica = require('../../models/docentes/FormacionAcademica');

class FormacionesController {
  // Obtener todas las formaciones académicas del docente autenticado
  static async getFormaciones(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user.id; // Del middleware de autenticación

      const result = await FormacionAcademica.findByUserId(userId, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        data: result.formaciones,
        pagination: result.pagination,
        message: 'Formaciones académicas obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error en getFormaciones:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener formación académica por ID
  static async getFormacionById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de formación inválido'
        });
      }

      const formacion = await FormacionAcademica.findById(parseInt(id));

      if (!formacion) {
        return res.status(404).json({
          success: false,
          message: 'Formación académica no encontrada'
        });
      }

      // Verificar que la formación pertenece al usuario autenticado
      if (formacion.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para acceder a esta formación'
        });
      }

      res.json({
        success: true,
        data: formacion,
        message: 'Formación académica obtenida exitosamente'
      });

    } catch (error) {
      console.error('Error en getFormacionById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Crear nueva formación académica
  static async createFormacion(req, res) {
    try {
      const {
        nivel_formacion,
        programa_academico,
        institucion,
        pais,
        fecha_obtencion,
        documento_archivo
      } = req.body;

      const userId = req.user.id;

      // Validaciones
      if (!nivel_formacion || !programa_academico || !institucion || !pais) {
        return res.status(400).json({
          success: false,
          message: 'Nivel de formación, programa académico, institución y país son obligatorios'
        });
      }

      const formacionData = {
        user_id: userId,
        nivel_formacion,
        programa_academico,
        institucion,
        pais,
        fecha_obtencion,
        documento_archivo
      };

      const nuevaFormacion = await FormacionAcademica.create(formacionData);

      res.status(201).json({
        success: true,
        data: nuevaFormacion,
        message: 'Formación académica creada exitosamente'
      });

    } catch (error) {
      console.error('Error en createFormacion:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Actualizar formación académica
  static async updateFormacion(req, res) {
    try {
      const { id } = req.params;
      const {
        nivel_formacion,
        programa_academico,
        institucion,
        pais,
        fecha_obtencion,
        documento_archivo
      } = req.body;

      const userId = req.user.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de formación inválido'
        });
      }

      // Verificar que la formación existe y pertenece al usuario
      const formacionExistente = await FormacionAcademica.findById(parseInt(id));

      if (!formacionExistente) {
        return res.status(404).json({
          success: false,
          message: 'Formación académica no encontrada'
        });
      }

      if (formacionExistente.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para actualizar esta formación'
        });
      }

      // Validaciones
      if (!nivel_formacion || !programa_academico || !institucion || !pais) {
        return res.status(400).json({
          success: false,
          message: 'Nivel de formación, programa académico, institución y país son obligatorios'
        });
      }

      const formacionData = {
        nivel_formacion,
        programa_academico,
        institucion,
        pais,
        fecha_obtencion,
        documento_archivo
      };

      const formacionActualizada = await FormacionAcademica.updateById(parseInt(id), formacionData);

      res.json({
        success: true,
        data: formacionActualizada,
        message: 'Formación académica actualizada exitosamente'
      });

    } catch (error) {
      console.error('Error en updateFormacion:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Eliminar formación académica
  static async deleteFormacion(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de formación inválido'
        });
      }

      // Verificar que la formación existe y pertenece al usuario
      const formacionExistente = await FormacionAcademica.findById(parseInt(id));

      if (!formacionExistente) {
        return res.status(404).json({
          success: false,
          message: 'Formación académica no encontrada'
        });
      }

      if (formacionExistente.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar esta formación'
        });
      }

      const eliminado = await FormacionAcademica.deleteById(parseInt(id));

      if (!eliminado) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo eliminar la formación académica'
        });
      }

      res.json({
        success: true,
        message: 'Formación académica eliminada exitosamente'
      });

    } catch (error) {
      console.error('Error en deleteFormacion:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener estadísticas de formaciones académicas del docente
  static async getEstadisticas(req, res) {
    try {
      const userId = req.user.id;

      const stats = await FormacionAcademica.getStatsById(userId);

      res.json({
        success: true,
        data: stats,
        message: 'Estadísticas obtenidas exitosamente'
      });

    } catch (error) {
      console.error('Error en getEstadisticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = FormacionesController;
