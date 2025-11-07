const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

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

// Importar middleware personalizado
const errorHandler = require('./src/middleware/errorHandler');
const notFound = require('./src/middleware/notFound');

// Crear aplicación Express
const app = express();

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());

// Middleware de compresión
app.use(compression());

// Middleware de logging
app.use(morgan('combined'));

// Middleware CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/docentes', docenteRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
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
        console.log('🔍 Verificando conexión a la base de datos...');
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ No se pudo conectar a la base de datos');
            process.exit(1);
        }
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`🗄️  Base de datos: ${process.env.DB_NAME}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
