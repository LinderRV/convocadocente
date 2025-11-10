const ExperienciaLaboral = require('../../models/docentes/ExperienciaLaboral');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configuración de multer para documentos de experiencia
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.user.id;
    const uploadDir = path.join(__dirname, '../../../uploads/experiencia', `usuario_${userId}`);
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Usar el nombre original del archivo
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: fileFilter
});

class ExperienciasController {
  // Obtener todas las experiencias laborales del docente autenticado
  static async getExperiencias(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user.id; // Del middleware de autenticación

      const result = await ExperienciaLaboral.findByUserId(userId, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        data: result.experiencias,
        pagination: result.pagination,
        message: 'Experiencias laborales obtenidas exitosamente'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Obtener experiencia laboral por ID
  static async getExperienciaById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de experiencia inválido'
        });
      }

      const experiencia = await ExperienciaLaboral.findById(parseInt(id));

      if (!experiencia) {
        return res.status(404).json({
          success: false,
          message: 'Experiencia laboral no encontrada'
        });
      }

      // Verificar que la experiencia pertenece al usuario autenticado
      if (experiencia.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para acceder a esta experiencia'
        });
      }

      res.json({
        success: true,
        data: experiencia,
        message: 'Experiencia laboral obtenida exitosamente'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Crear nueva experiencia laboral
  static async createExperiencia(req, res) {
    try {
      const {
        pais,
        sector,
        empresa,
        ruc,
        cargo,
        fecha_inicio,
        fecha_fin,
        actual,
        sin_experiencia,
        constancia_archivo
      } = req.body;

      const userId = req.user.id;

      // Validaciones
      if (!pais || !sector || !empresa || !cargo || !fecha_inicio) {
        return res.status(400).json({
          success: false,
          message: 'País, sector, empresa, cargo y fecha de inicio son obligatorios'
        });
      }

      // Si hay archivo nuevo, usar el nombre del archivo subido
      let constancia_archivo_final = constancia_archivo;
      if (req.file) {
        constancia_archivo_final = req.file.filename;
      }

      const experienciaData = {
        user_id: userId,
        pais,
        sector,
        empresa,
        ruc,
        cargo,
        fecha_inicio,
        fecha_fin,
        actual: actual === 'true' || actual === true,
        sin_experiencia: sin_experiencia === 'true' || sin_experiencia === true,
        constancia_archivo: constancia_archivo_final
      };

      const nuevaExperiencia = await ExperienciaLaboral.create(experienciaData);

      res.status(201).json({
        success: true,
        data: nuevaExperiencia,
        message: 'Experiencia laboral creada exitosamente'
      });

    } catch (error) {
      // Eliminar archivo subido si hubo error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          // Error eliminando archivo
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Actualizar experiencia laboral
  static async updateExperiencia(req, res) {
    try {
      const { id } = req.params;
      const {
        pais,
        sector,
        empresa,
        ruc,
        cargo,
        fecha_inicio,
        fecha_fin,
        actual,
        sin_experiencia
      } = req.body;

      const userId = req.user.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de experiencia inválido'
        });
      }

      // Verificar que la experiencia existe y pertenece al usuario
      const experienciaExistente = await ExperienciaLaboral.findById(parseInt(id));

      if (!experienciaExistente) {
        return res.status(404).json({
          success: false,
          message: 'Experiencia laboral no encontrada'
        });
      }

      if (experienciaExistente.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para actualizar esta experiencia'
        });
      }

      // Validaciones
      if (!pais || !sector || !empresa || !cargo || !fecha_inicio) {
        return res.status(400).json({
          success: false,
          message: 'País, sector, empresa, cargo y fecha de inicio son obligatorios'
        });
      }

      // Si hay archivo nuevo, eliminar el anterior y actualizar con el nuevo
      let constancia_archivo = experienciaExistente.constancia_archivo;
      
      if (req.file) {
        // Eliminar archivo anterior si existe
        if (experienciaExistente.constancia_archivo) {
          const archivoAnterior = path.join(__dirname, '../../../uploads/experiencia', `usuario_${userId}`, experienciaExistente.constancia_archivo);
          try {
            await fs.unlink(archivoAnterior);
          } catch (error) {
            // No se pudo eliminar archivo anterior
          }
        }
        
        // Usar el nuevo archivo
        constancia_archivo = req.file.filename;
      }

      const experienciaData = {
        pais,
        sector,
        empresa,
        ruc,
        cargo,
        fecha_inicio,
        fecha_fin,
        actual: actual === 'true' || actual === true,
        sin_experiencia: sin_experiencia === 'true' || sin_experiencia === true,
        constancia_archivo
      };

      const experienciaActualizada = await ExperienciaLaboral.updateById(parseInt(id), experienciaData);

      res.json({
        success: true,
        data: experienciaActualizada,
        message: 'Experiencia laboral actualizada exitosamente'
      });

    } catch (error) {
      // Eliminar archivo subido si hubo error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          // Error eliminando archivo
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Subir documento de experiencia laboral
  static async uploadDocumento(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de experiencia inválido'
        });
      }

      // Verificar que se subió un archivo
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se seleccionó ningún archivo'
        });
      }

      // Verificar que la experiencia existe y pertenece al usuario
      const experienciaExistente = await ExperienciaLaboral.findById(parseInt(id));

      if (!experienciaExistente) {
        return res.status(404).json({
          success: false,
          message: 'Experiencia laboral no encontrada'
        });
      }

      if (experienciaExistente.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para subir documentos a esta experiencia'
        });
      }

      // Eliminar archivo anterior si existe
      if (experienciaExistente.constancia_archivo) {
        const archivoAnterior = path.join(__dirname, '../../../uploads/experiencia', `usuario_${userId}`, experienciaExistente.constancia_archivo);
        try {
          await fs.unlink(archivoAnterior);
        } catch (error) {
          // No se pudo eliminar archivo anterior
        }
      }

      // Actualizar la base de datos con el nuevo archivo
      const nombreArchivo = req.file.filename;
      const experienciaActualizada = await ExperienciaLaboral.updateDocumento(parseInt(id), nombreArchivo);

      if (!experienciaActualizada) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar la experiencia laboral'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Documento subido correctamente',
        data: {
          constancia_archivo: nombreArchivo,
          experiencia: experienciaActualizada
        }
      });

    } catch (error) {
      // Eliminar archivo subido si hubo error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          // Error eliminando archivo
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Descargar documento de experiencia laboral
  static async downloadDocumento(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de experiencia inválido'
        });
      }

      const experiencia = await ExperienciaLaboral.findById(parseInt(id));

      if (!experiencia) {
        return res.status(404).json({
          success: false,
          message: 'Experiencia laboral no encontrada'
        });
      }

      if (experiencia.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para descargar este documento'
        });
      }

      if (!experiencia.constancia_archivo) {
        return res.status(404).json({
          success: false,
          message: 'No hay documento disponible para esta experiencia'
        });
      }

      const archivoPath = path.join(__dirname, '../../../uploads/experiencia', `usuario_${userId}`, experiencia.constancia_archivo);

      // Verificar que el archivo existe
      try {
        await fs.access(archivoPath);
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: 'Archivo no encontrado en el servidor'
        });
      }

      // Configurar headers para descarga
      res.setHeader('Content-Disposition', `attachment; filename="${experiencia.constancia_archivo}"`);
      res.setHeader('Content-Type', 'application/pdf');

      // Enviar archivo con res.download para nombre original
      res.download(archivoPath, experiencia.constancia_archivo);

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener estadísticas de experiencias laborales del docente
  static async getEstadisticas(req, res) {
    try {
      const userId = req.user.id;

      const stats = await ExperienciaLaboral.getStatsById(userId);

      res.json({
        success: true,
        data: stats,
        message: 'Estadísticas obtenidas exitosamente'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = { ExperienciasController, upload };
