const Docente = require('../../models/docentes/Docente');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configuración de multer para subir CV
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.user.id;
    const uploadDir = path.join(__dirname, '../../../uploads/cv', `usuario_${userId}`);
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
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  // Solo permitir archivos PDF
  if (fileExtension === '.pdf') {
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

class DocenteController {
  
  // Obtener perfil del docente autenticado
  static async getPerfil(req, res) {
    try {
      const userId = req.user.id;
      
      let docente = await Docente.findByUserId(userId);
      
      // Si no existe perfil de docente, crear uno básico
      if (!docente) {
        const newDocenteData = {
          user_id: userId,
          nombres: req.user.nombre || '',
          apellidos: '',
          dni: null,
          fecha_nacimiento: null,
          genero: '',
          pais: 'Perú',
          direccion: '',
          telefono: ''
        };
        
        docente = await Docente.create(newDocenteData);
      }
      
      res.status(200).json({
        success: true,
        message: 'Perfil obtenido correctamente',
        data: docente
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Actualizar perfil del docente
  static async updatePerfil(req, res) {
    try {
      const userId = req.user.id;
      const {
        nombres,
        apellidos,
        dni,
        fecha_nacimiento,
        genero,
        pais,
        direccion,
        telefono
      } = req.body;

      // Validaciones básicas
      if (!nombres || !apellidos) {
        return res.status(400).json({
          success: false,
          message: 'Nombres y apellidos son obligatorios'
        });
      }

      // Validar DNI único si se proporciona
      if (dni && dni.trim()) {
        const existeDNI = await Docente.findByDNI(dni.trim(), userId);
        if (existeDNI) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe otro docente con este DNI'
          });
        }
      }

      const docenteData = {
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        dni: dni && dni.trim() ? dni.trim() : null,
        fecha_nacimiento,
        genero,
        pais,
        direccion: direccion || '',
        telefono: telefono || ''
      };

      // Verificar si el docente existe
      let docente = await Docente.findByUserId(userId);
      
      if (!docente) {
        // Crear nuevo perfil
        docenteData.user_id = userId;
        docente = await Docente.create(docenteData);
      } else {
        // Actualizar perfil existente
        docente = await Docente.update(userId, docenteData);
      }

      if (!docente) {
        return res.status(404).json({
          success: false,
          message: 'No se pudo actualizar el perfil'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Perfil actualizado correctamente',
        data: docente
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Subir CV
  static async uploadCV(req, res) {
    try {
      const userId = req.user.id;
      
      // Verificar que se subió un archivo
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se seleccionó ningún archivo'
        });
      }

      // Obtener el docente actual para eliminar CV anterior si existe
      const docenteActual = await Docente.findByUserId(userId);
      
      // Eliminar archivo anterior si existe
      if (docenteActual && docenteActual.cv_archivo) {
        const archivoAnterior = path.join(__dirname, '../../../uploads/cv', `usuario_${userId}`, docenteActual.cv_archivo);
        try {
          await fs.unlink(archivoAnterior);
        } catch (error) {
          // Archivo anterior no encontrado
        }
      }

      // Actualizar la base de datos con el nuevo archivo
      const nombreArchivo = req.file.filename;
      const docente = await Docente.updateCV(userId, nombreArchivo);

      if (!docente) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró el perfil del docente'
        });
      }

      res.status(200).json({
        success: true,
        message: 'CV subido correctamente',
        data: {
          cv_archivo: nombreArchivo,
          docente: docente
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

  // Eliminar CV
  static async deleteCV(req, res) {
    try {
      const userId = req.user.id;
      
      const docente = await Docente.findByUserId(userId);
      
      if (!docente || !docente.cv_archivo) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró CV para eliminar'
        });
      }

      // Eliminar archivo físico
      const archivoPath = path.join(__dirname, '../../../uploads/cv', `usuario_${userId}`, docente.cv_archivo);
      try {
        await fs.unlink(archivoPath);
      } catch (error) {
        // Archivo físico no encontrado
      }

      // Actualizar base de datos
      const docenteActualizado = await Docente.removeCV(userId);

      res.status(200).json({
        success: true,
        message: 'CV eliminado correctamente',
        data: docenteActualizado
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Descargar CV
  static async downloadCV(req, res) {
    try {
      const userId = req.user.id;
      
      const docente = await Docente.findByUserId(userId);
      
      if (!docente || !docente.cv_archivo) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró CV para descargar'
        });
      }

      const archivoPath = path.join(__dirname, '../../../uploads/cv', `usuario_${userId}`, docente.cv_archivo);
      
      // Verificar que el archivo existe
      try {
        await fs.access(archivoPath);
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: 'El archivo CV no se encuentra disponible'
        });
      }

      // Enviar archivo con su nombre original
      res.download(archivoPath, docente.cv_archivo, (error) => {
        if (error) {
          res.status(500).json({
            success: false,
            message: 'Error al descargar el archivo'
          });
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener estadísticas (para administradores)
  static async getStats(req, res) {
    try {
      const stats = await Docente.getStats();
      
      res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas correctamente',
        data: stats
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

// Exportar el controller y middleware de upload
module.exports = {
  DocenteController,
  uploadCV: upload.single('cv')
};