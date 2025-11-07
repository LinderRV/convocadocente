const FormacionAcademica = require('../../models/docentes/FormacionAcademica');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configuración de multer para documentos de formación
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.user.id;
    const uploadDir = path.join(__dirname, '../../../uploads/formacion', `usuario_${userId}`);
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Mantener el nombre original del archivo
    const originalName = file.originalname;
    cb(null, originalName);
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

      // Si hay archivo nuevo, usar el nombre del archivo subido
      let documento_archivo_final = documento_archivo;
      if (req.file) {
        documento_archivo_final = req.file.filename;
        console.log('Archivo asignado en creación:', documento_archivo_final);
      }

      const formacionData = {
        user_id: userId,
        nivel_formacion,
        programa_academico,
        institucion,
        pais,
        fecha_obtencion,
        documento_archivo: documento_archivo_final
      };

      const nuevaFormacion = await FormacionAcademica.create(formacionData);

      res.status(201).json({
        success: true,
        data: nuevaFormacion,
        message: 'Formación académica creada exitosamente'
      });

    } catch (error) {
      console.error('Error en createFormacion:', error);
      
      // Eliminar archivo subido si hubo error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error eliminando archivo:', unlinkError);
        }
      }
      
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
        fecha_obtencion
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

      // Si hay archivo nuevo, eliminar el anterior y actualizar con el nuevo
      let documento_archivo = formacionExistente.documento_archivo;
      
      if (req.file) {
        // Eliminar archivo anterior si existe
        if (formacionExistente.documento_archivo) {
          const archivoAnterior = path.join(__dirname, '../../../uploads/formacion', `usuario_${userId}`, formacionExistente.documento_archivo);
          try {
            await fs.unlink(archivoAnterior);
            console.log('Archivo anterior eliminado:', formacionExistente.documento_archivo);
          } catch (error) {
            console.log('No se pudo eliminar archivo anterior:', error.message);
          }
        }
        
        // Usar el nuevo archivo
        documento_archivo = req.file.filename;
        console.log('Nuevo archivo asignado:', documento_archivo);
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
      
      // Eliminar archivo subido si hubo error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error eliminando archivo:', unlinkError);
        }
      }
      
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

  // Subir documento de formación académica
  static async uploadDocumento(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de formación inválido'
        });
      }

      // Verificar que se subió un archivo
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se seleccionó ningún archivo'
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
          message: 'No tienes permiso para subir documentos a esta formación'
        });
      }

      // Eliminar archivo anterior si existe
      if (formacionExistente.documento_archivo) {
        const archivoAnterior = path.join(__dirname, '../../../uploads/formacion', `usuario_${userId}`, formacionExistente.documento_archivo);
        try {
          await fs.unlink(archivoAnterior);
        } catch (error) {
          console.log('No se pudo eliminar archivo anterior:', error.message);
        }
      }

      // Actualizar la base de datos con el nuevo archivo
      const nombreArchivo = req.file.filename;
      const formacionActualizada = await FormacionAcademica.updateDocumento(parseInt(id), nombreArchivo);

      if (!formacionActualizada) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar la formación académica'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Documento subido correctamente',
        data: {
          documento_archivo: nombreArchivo,
          formacion: formacionActualizada
        }
      });

    } catch (error) {
      console.error('Error en uploadDocumento:', error);
      
      // Eliminar archivo subido si hubo error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error eliminando archivo:', unlinkError);
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Descargar documento de formación académica
  static async downloadDocumento(req, res) {
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

      if (formacion.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para descargar este documento'
        });
      }

      if (!formacion.documento_archivo) {
        return res.status(404).json({
          success: false,
          message: 'No hay documento disponible para esta formación'
        });
      }

      const archivoPath = path.join(__dirname, '../../../uploads/formacion', `usuario_${userId}`, formacion.documento_archivo);

      // Verificar que el archivo existe
      try {
        await fs.access(archivoPath);
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: 'Archivo no encontrado en el servidor'
        });
      }

      // Enviar archivo con su nombre original
      res.download(archivoPath, formacion.documento_archivo, (error) => {
        if (error) {
          console.error('Error en descarga:', error);
          res.status(500).json({
            success: false,
            message: 'Error al descargar el archivo'
          });
        }
      });

    } catch (error) {
      console.error('Error en downloadDocumento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Eliminar documento de formación académica
  static async deleteDocumento(req, res) {
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

      if (formacion.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar este documento'
        });
      }

      if (!formacion.documento_archivo) {
        return res.status(404).json({
          success: false,
          message: 'No hay documento para eliminar'
        });
      }

      // Eliminar archivo físico
      const archivoPath = path.join(__dirname, '../../../uploads/formacion', `usuario_${userId}`, formacion.documento_archivo);
      try {
        await fs.unlink(archivoPath);
      } catch (error) {
        console.log('Archivo físico no encontrado:', error.message);
      }

      // Actualizar base de datos
      const formacionActualizada = await FormacionAcademica.removeDocumento(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Documento eliminado correctamente',
        data: formacionActualizada
      });

    } catch (error) {
      console.error('Error en deleteDocumento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
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

module.exports = { FormacionesController, upload };
