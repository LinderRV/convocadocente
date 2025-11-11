/**
 * Configuración
 */

require('dotenv').config();

class ConfigurationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConfigurationError';
    }
}

/**
 * Valida que una variable de entorno requerida exista
 */
const validateRequired = (key, defaultValue = null) => {
    const value = process.env[key] || defaultValue;
    if (!value && defaultValue === null) {
        throw new ConfigurationError(`Variable de entorno requerida no encontrada: ${key}`);
    }
    return value;
};

/**
 * Convierte string a número con validación
 */
const parseNumber = (value, defaultValue = 0) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Convierte string a boolean
 */
const parseBoolean = (value, defaultValue = false) => {
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
    }
    return defaultValue;
};

/**
 * Convierte string separado por comas a array
 */
const parseArray = (value, defaultValue = []) => {
    if (!value) return defaultValue;
    return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
};

/**
 * Configuración del Servidor
 */
const server = {
    port: parseNumber(process.env.PORT, 3000),
    environment: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
    isProduction: (process.env.NODE_ENV || 'development') === 'production',
    isTesting: (process.env.NODE_ENV || 'development') === 'testing'
};

/**
 * Configuración de Base de Datos
 */
const database = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'bd_convocadocente',
    port: parseNumber(process.env.DB_PORT, 3306),
    connectionLimit: parseNumber(process.env.DB_CONNECTION_LIMIT, 10),
    queueLimit: parseNumber(process.env.DB_QUEUE_LIMIT, 0),
    acquireTimeout: parseNumber(process.env.DB_ACQUIRE_TIMEOUT, 60000),
    charset: 'utf8mb4',
    timezone: 'local'
};

/**
 * Configuración de JWT
 */
const jwt = {
    secret: validateRequired('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'convocadocente',
    audience: process.env.JWT_AUDIENCE || 'convocadocente-users'
};

/**
 * Configuración de Google OAuth
 */
const google = {
    clientId: validateRequired('GOOGLE_CLIENT_ID'),
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
};

/**
 * Configuración de Archivos
 */
const files = {
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: parseNumber(process.env.MAX_FILE_SIZE, 5242880), // 5MB por defecto
    allowedTypes: parseArray(process.env.ALLOWED_FILE_TYPES, ['pdf', 'doc', 'docx', 'jpg', 'png', 'jpeg']),
    uploadBaseUrl: process.env.UPLOAD_BASE_URL || `http://localhost:${server.port}/uploads`
};

/**
 * Configuración de CORS
 */
const cors = {
    origins: parseArray(process.env.CORS_ORIGINS, [server.frontendUrl]),
    methods: parseArray(process.env.CORS_METHODS, ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']),
    allowedHeaders: parseArray(process.env.CORS_ALLOWED_HEADERS, ['Content-Type', 'Authorization', 'X-Requested-With']),
    credentials: true
};

/**
 * Configuración de Seguridad
 */
const security = {
    bcryptSaltRounds: parseNumber(process.env.BCRYPT_SALT_ROUNDS, 12),
    sessionSecret: process.env.SESSION_SECRET || 'convocadocente_session_secret_2024'
};

/**
 * Configuración de Logs
 */
const logs = {
    level: process.env.LOG_LEVEL || 'combined',
    fileEnabled: parseBoolean(process.env.LOG_FILE_ENABLED, false),
    filePath: process.env.LOG_FILE_PATH || './logs/app.log'
};

/**
 * Configuración de Rate Limiting
 */
const rateLimit = {
    windowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 900000), // 15 minutos
    maxRequests: parseNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 100)
};

/**
 * Configuración de Email (Para futuras implementaciones)
 */
const email = {
    smtp: {
        host: process.env.SMTP_HOST || '',
        port: parseNumber(process.env.SMTP_PORT, 587),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    },
    from: process.env.EMAIL_FROM || ''
};

/**
 * Configuración de Cache/Redis (Para futuras implementaciones)
 */
const cache = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseNumber(process.env.REDIS_PORT, 6379)
    },
    ttl: parseNumber(process.env.CACHE_TTL, 3600) // 1 hora
};

/**
 * Objeto de configuración principal
 */
const config = {
    server,
    database,
    jwt,
    google,
    files,
    cors,
    security,
    logs,
    rateLimit,
    email,
    cache
};

/**
 * Valida la configuración al inicio
 */
const validateConfig = () => {
    const errors = [];

    // Validaciones críticas
    if (!jwt.secret || jwt.secret === 'fallback_secret') {
        errors.push('JWT_SECRET debe ser definido y seguro');
    }

    if (jwt.secret && jwt.secret.length < 32) {
        errors.push('JWT_SECRET debe tener al menos 32 caracteres');
    }

    if (!google.clientId) {
        errors.push('GOOGLE_CLIENT_ID es requerido');
    }

    if (server.isProduction) {
        if (!database.password) {
            errors.push('DB_PASSWORD es requerido en producción');
        }
        
        if (server.frontendUrl.includes('localhost')) {
            errors.push('FRONTEND_URL no puede ser localhost en producción');
        }
    }

    if (errors.length > 0) {
        console.error('❌ Errores de configuración encontrados:');
        errors.forEach(error => console.error(`   - ${error}`));
        throw new ConfigurationError(`Configuración inválida: ${errors.join(', ')}`);
    }

    console.log('✅ Configuración validada correctamente');
};

/**
 * Muestra información de configuración 
 */
const showConfigInfo = () => {
    if (!server.isDevelopment) return;

    console.log('🔧 Información de configuración:');
    console.log(`   - Entorno: ${server.environment}`);
    console.log(`   - Puerto: ${server.port}`);
    console.log(`   - Base de datos: ${database.host}:${database.port}/${database.name}`);
    console.log(`   - Frontend URL: ${server.frontendUrl}`);
    console.log(`   - Uploads: ${files.uploadPath} (Max: ${Math.round(files.maxFileSize / 1024 / 1024)}MB)`);
    console.log(`   - CORS Origins: ${cors.origins.join(', ')}`);
};

// Validar configuración al importar el módulo
try {
    validateConfig();
    showConfigInfo();
} catch (error) {
    console.error('💥 Error fatal en configuración:', error.message);
    process.exit(1);
}

module.exports = config;
