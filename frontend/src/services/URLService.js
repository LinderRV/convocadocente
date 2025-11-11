/**
 * Servicio de URLs - Frontend
 * ConvocaDocente - Sistema de Convocatorias
 * 
 * Centraliza el manejo de URLs para archivos y configuraciones dinámicas
 */

class URLService {
    /**
     * Obtiene la URL base de la API
     */
    static getApiBaseURL() {
        return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    }

    /**
     * Obtiene la URL base para uploads
     */
    static getUploadsBaseURL() {
        return import.meta.env.VITE_UPLOADS_BASE_URL || 'http://localhost:3000/uploads';
    }

    /**
     * Construye URL completa para archivo de CV
     * @param {number} userId - ID del usuario
     * @param {string} filename - Nombre del archivo
     * @returns {string|null} URL completa o null si no hay archivo
     */
    static getCVURL(userId, filename) {
        if (!filename || !userId) return null;
        return `${this.getUploadsBaseURL()}/cv/usuario_${userId}/${filename}`;
    }

    /**
     * Construye URL completa para archivo de formación académica
     * @param {number} userId - ID del usuario
     * @param {string} filename - Nombre del archivo
     * @returns {string|null} URL completa o null si no hay archivo
     */
    static getFormacionURL(userId, filename) {
        if (!filename || !userId) return null;
        return `${this.getUploadsBaseURL()}/formacion/usuario_${userId}/${filename}`;
    }

    /**
     * Construye URL completa para archivo de experiencia laboral
     * @param {number} userId - ID del usuario
     * @param {string} filename - Nombre del archivo
     * @returns {string|null} URL completa o null si no hay archivo
     */
    static getExperienciaURL(userId, filename) {
        if (!filename || !userId) return null;
        return `${this.getUploadsBaseURL()}/experiencia/usuario_${userId}/${filename}`;
    }

    /**
     * Construye URL completa para cualquier tipo de archivo
     * @param {string} category - Categoría del archivo (cv, formacion, experiencia, etc.)
     * @param {number} userId - ID del usuario
     * @param {string} filename - Nombre del archivo
     * @returns {string|null} URL completa o null si no hay archivo
     */
    static getFileURL(category, userId, filename) {
        if (!filename || !userId || !category) return null;
        return `${this.getUploadsBaseURL()}/${category}/usuario_${userId}/${filename}`;
    }

    /**
     * Obtiene configuración de archivos desde variables de entorno
     * @returns {object} Configuración de archivos
     */
    static getFileConfig() {
        return {
            maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880,
            maxFileSizeMB: Math.round((parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880) / 1024 / 1024),
            allowedTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'pdf,doc,docx,jpg,png,jpeg').split(','),
            uploadsBaseUrl: this.getUploadsBaseURL()
        };
    }

    /**
     * Obtiene configuración de Google OAuth
     * @returns {object} Configuración de Google
     */
    static getGoogleConfig() {
        return {
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        };
    }

    /**
     * Obtiene configuración de la aplicación
     * @returns {object} Configuración de la app
     */
    static getAppConfig() {
        return {
            name: import.meta.env.VITE_APP_NAME || 'ConvocaDocente',
            version: import.meta.env.VITE_APP_VERSION || '1.0.0',
            environment: import.meta.env.VITE_NODE_ENV || 'development',
            enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
            enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
        };
    }

    /**
     * Valida si un archivo es del tipo permitido
     * @param {string} filename - Nombre del archivo
     * @returns {boolean} True si está permitido
     */
    static isFileTypeAllowed(filename) {
        if (!filename) return false;
        
        const extension = filename.split('.').pop()?.toLowerCase();
        const allowedTypes = this.getFileConfig().allowedTypes;
        
        return allowedTypes.includes(extension);
    }

    /**
     * Valida si un archivo está dentro del límite de tamaño
     * @param {number} fileSize - Tamaño del archivo en bytes
     * @returns {boolean} True si está permitido
     */
    static isFileSizeAllowed(fileSize) {
        const maxSize = this.getFileConfig().maxFileSize;
        return fileSize <= maxSize;
    }

    /**
     * Formatea el tamaño de archivo en formato legible
     * @param {number} bytes - Tamaño en bytes
     * @returns {string} Tamaño formateado
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Obtiene mensaje de error para validación de archivos
     * @param {File} file - Archivo a validar
     * @returns {string|null} Mensaje de error o null si es válido
     */
    static validateFile(file) {
        if (!file) return 'No se seleccionó ningún archivo';

        const config = this.getFileConfig();

        // Validar tipo
        if (!this.isFileTypeAllowed(file.name)) {
            return `Tipo de archivo no permitido. Tipos permitidos: ${config.allowedTypes.join(', ').toUpperCase()}`;
        }

        // Validar tamaño
        if (!this.isFileSizeAllowed(file.size)) {
            return `El archivo es demasiado grande. Tamaño máximo: ${config.maxFileSizeMB}MB`;
        }

        return null; // Archivo válido
    }

    /**
     * Obtiene información completa de configuración para debugging
     * @returns {object} Información de configuración
     */
    static getDebugInfo() {
        return {
            api: {
                baseURL: this.getApiBaseURL(),
                uploadsURL: this.getUploadsBaseURL()
            },
            app: this.getAppConfig(),
            files: this.getFileConfig(),
            google: this.getGoogleConfig(),
            environment: import.meta.env
        };
    }
}

export default URLService;
