const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

// Importar configuración centralizada
const config = require('./src/config');

// Importar configuración de base de datos
const { testConnection } = require('./src/config/database');

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const usuariosRoutes = require('./src/routes/usuariosRoutes');
const cursosRoutes = require('./src/routes/cursosRoutes');
const postulacionesRoutes = require('./src/routes/postulacionesRoutes');

// Importar rutas de docentes
const formacionesRoutes = require('./src/routes/docentes/formacionesRoutes');
const experienciasRoutes = require('./src/routes/docentes/experienciasRoutes');
const docenteRoutes = require('./src/routes/docentes/docenteRoutes');
const postulacionDocenteRoutes = require('./src/routes/docentes/postulacionDocenteRoutes');
const listaPostulacionesRoutes = require('./src/routes/docentes/listaPostulacionesRoutes');
const dashboardRoutes = require('./src/routes/docentes/dashboardRoutes');

// Importar rutas de directores
const dashboardDirectorRoutes = require('./src/routes/directores/dashboardDirectorRoutes');

// Importar rutas generales
const dashboardGeneralRoutes = require('./src/routes/dashboardRoutes');

// Importar middleware personalizado
const errorHandler = require('./src/middleware/errorHandler');
const notFound = require('./src/middleware/notFound');

// Crear aplicación Express
const app = express();

// Configurar puerto desde configuración centralizada
const PORT = config.server.port;

// Middleware de seguridad
app.use(helmet());

// Middleware de compresión
app.use(compression());

// Middleware de logging con configuración centralizada
app.use(morgan(config.logs.level));

// Middleware CORS con configuración centralizada
app.use(cors({
    origin: config.cors.origins,
    credentials: config.cors.credentials,
    methods: config.cors.methods,
    allowedHeaders: config.cors.allowedHeaders
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos con configuración centralizada
app.use('/uploads', express.static(path.join(__dirname, config.files.uploadPath.replace('./', ''))));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/postulaciones', postulacionesRoutes);

// Rutas de docentes
app.use('/api/docentes/formaciones', formacionesRoutes);
app.use('/api/docentes/experiencias', experienciasRoutes);
app.use('/api/docentes/postulaciones', postulacionDocenteRoutes);
app.use('/api/docentes/lista-postulaciones', listaPostulacionesRoutes);
app.use('/api/docentes/dashboard', dashboardRoutes);
app.use('/api/docentes', docenteRoutes);

// Rutas de directores
app.use('/api/directores/dashboard', dashboardDirectorRoutes);

// Rutas generales (Dashboard para Admin/Decano)
app.use('/api/dashboard', dashboardGeneralRoutes);

// Ruta de salud con información de configuración
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: config.server.environment,
        version: '1.0.0',
        config: {
            database: {
                host: config.database.host,
                name: config.database.name,
                port: config.database.port
            },
            files: {
                uploadPath: config.files.uploadPath,
                maxFileSize: `${Math.round(config.files.maxFileSize / 1024 / 1024)}MB`,
                allowedTypes: config.files.allowedTypes
            },
            cors: {
                origins: config.cors.origins
            }
        }
    });
});

// Middleware de error 404
app.use(notFound);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
    try {
        // Verificar conexión a la base de datos
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            process.exit(1);
        }
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor iniciado exitosamente`);
            console.log(`   - Puerto: ${PORT}`);
            console.log(`   - Entorno: ${config.server.environment}`);
            console.log(`   - Frontend: ${config.server.frontendUrl}`);
            console.log(`   - Salud: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('💥 Error fatal al iniciar servidor:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;
