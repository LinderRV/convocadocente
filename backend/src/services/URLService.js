/**
 * Servicio de URLs - ConvocaDocente
 * 
 * Este servicio centraliza el manejo de URLs para archivos estáticos,
 * permitiendo configuración dinámica y fácil cambio entre ambientes.
 */

const config = require('../config');
const path = require('path');

class URLService {
    /**
     * Obtiene la URL base para uploads
     */
    static getUploadBaseURL() {
        return config.files.uploadBaseUrl;
    }

    /**
     * Construye URL completa para archivo de CV
     * @param {number} userId - ID del usuario
     * @param {string} filename - Nombre del archivo
     * @returns {string} URL completa
     */
    static getCVURL(userId, filename) {
        if (!filename) return null;
        return `${this.getUploadBaseURL()}/cv/usuario_${userId}/${filename}`;
    }

    /**
     * Construye URL completa para archivo de formación académica
     * @param {number} userId - ID del usuario
     * @param {string} filename - Nombre del archivo
     * @returns {string} URL completa
     */
    static getFormacionURL(userId, filename) {
        if (!filename) return null;
        return `${this.getUploadBaseURL()}/formacion/usuario_${userId}/${filename}`;
    }

    /**
     * Construye URL completa para archivo de experiencia laboral
     * @param {number} userId - ID del usuario
     * @param {string} filename - Nombre del archivo
     * @returns {string} URL completa
     */
    static getExperienciaURL(userId, filename) {
        if (!filename) return null;
        return `${this.getUploadBaseURL()}/experiencia/usuario_${userId}/${filename}`;
    }

    /**
     * Construye URL completa para cualquier tipo de archivo
     * @param {string} category - Categoría del archivo (cv, formacion, experiencia, etc.)
     * @param {number} userId - ID del usuario
     * @param {string} filename - Nombre del archivo
     * @returns {string} URL completa
     */
    static getFileURL(category, userId, filename) {
        if (!filename) return null;
        return `${this.getUploadBaseURL()}/${category}/usuario_${userId}/${filename}`;
    }

    /**
     * Obtiene el path físico para almacenar archivos
     * @param {string} category - Categoría del archivo
     * @param {number} userId - ID del usuario
     * @returns {string} Path físico
     */
    static getUploadPath(category, userId) {
        return path.join(config.files.uploadPath, category, `usuario_${userId}`);
    }

    /**
     * Valida si el tipo de archivo está permitido
     * @param {string} filename - Nombre del archivo
     * @returns {boolean} True si está permitido
     */
    static isFileTypeAllowed(filename) {
        if (!filename) return false;
        
        const extension = path.extname(filename).toLowerCase().slice(1);
        return config.files.allowedTypes.includes(extension);
    }

    /**
     * Valida si el tamaño del archivo está permitido
     * @param {number} fileSize - Tamaño del archivo en bytes
     * @returns {boolean} True si está permitido
     */
    static isFileSizeAllowed(fileSize) {
        return fileSize <= config.files.maxFileSize;
    }

    /**
     * Obtiene información de configuración de archivos
     * @returns {object} Información de configuración
     */
    static getFileConfig() {
        return {
            maxFileSize: config.files.maxFileSize,
            maxFileSizeMB: Math.round(config.files.maxFileSize / 1024 / 1024),
            allowedTypes: config.files.allowedTypes,
            uploadPath: config.files.uploadPath,
            uploadBaseUrl: config.files.uploadBaseUrl
        };
    }

    /**
     * Genera nombre único para archivo
     * @param {string} originalName - Nombre original del archivo
     * @param {number} userId - ID del usuario
     * @returns {string} Nombre único
     */
    static generateUniqueFilename(originalName, userId) {
        const extension = path.extname(originalName);
        const baseName = path.basename(originalName, extension);
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        
        return `${baseName}_${userId}_${timestamp}_${random}${extension}`;
    }

    /**
     * Extrae información de un archivo para respuesta API
     * @param {string} category - Categoría del archivo
     * @param {number} userId - ID del usuario
     * @param {string} filename - Nombre del archivo
     * @param {string} originalName - Nombre original (opcional)
     * @returns {object} Información del archivo
     */
    static getFileInfo(category, userId, filename, originalName = null) {
        if (!filename) return null;

        return {
            filename,
            originalName: originalName || filename,
            url: this.getFileURL(category, userId, filename),
            category,
            userId,
            uploadedAt: new Date().toISOString()
        };
    }

    /**
     * Valida y prepara información de archivo para upload
     * @param {object} file - Objeto file de multer
     * @param {string} category - Categoría del archivo
     * @param {number} userId - ID del usuario
     * @returns {object} Resultado de validación
     */
    static validateAndPrepareFile(file, category, userId) {
        const errors = [];

        // Validar que el archivo existe
        if (!file) {
            errors.push('No se proporcionó ningún archivo');
            return { isValid: false, errors };
        }

        // Validar tipo de archivo
        if (!this.isFileTypeAllowed(file.originalname)) {
            errors.push(`Tipo de archivo no permitido. Tipos permitidos: ${config.files.allowedTypes.join(', ')}`);
        }

        // Validar tamaño del archivo
        if (!this.isFileSizeAllowed(file.size)) {
            errors.push(`Archivo demasiado grande. Tamaño máximo: ${Math.round(config.files.maxFileSize / 1024 / 1024)}MB`);
        }

        // Validar categoría
        const allowedCategories = ['cv', 'formacion', 'experiencia'];
        if (!allowedCategories.includes(category)) {
            errors.push(`Categoría no válida: ${category}`);
        }

        if (errors.length > 0) {
            return { isValid: false, errors };
        }

        // Generar información del archivo
        const uniqueFilename = this.generateUniqueFilename(file.originalname, userId);
        const uploadPath = this.getUploadPath(category, userId);
        const fileUrl = this.getFileURL(category, userId, uniqueFilename);

        return {
            isValid: true,
            file: {
                originalName: file.originalname,
                filename: uniqueFilename,
                mimetype: file.mimetype,
                size: file.size,
                category,
                userId,
                uploadPath,
                url: fileUrl
            }
        };
    }
}

module.exports = URLService;
