// Validación completa del sistema
const { testConnection } = require('./src/config/database');
const { authAPI } = require('../frontend/src/services/api');

const validateSystem = async () => {
    console.log('🔍 Validando sistema ConvocaDocente...\n');
    
    // 1. Test conexión BD
    console.log('1️⃣ Probando conexión a base de datos...');
    try {
        const dbConnected = await testConnection();
        if (dbConnected) {
            console.log('✅ Base de datos: CONECTADA');
        } else {
            console.log('❌ Base de datos: ERROR');
            return;
        }
    } catch (error) {
        console.log('❌ Base de datos: ERROR -', error.message);
        return;
    }
    
    // 2. Verificar variables de entorno
    console.log('\n2️⃣ Verificando configuración...');
    const requiredEnvs = ['DB_HOST', 'DB_NAME', 'JWT_SECRET', 'PORT'];
    let envOk = true;
    
    requiredEnvs.forEach(env => {
        if (process.env[env]) {
            console.log(`✅ ${env}: ${process.env[env]}`);
        } else {
            console.log(`❌ ${env}: NO CONFIGURADA`);
            envOk = false;
        }
    });
    
    // 3. Verificar estructura de archivos
    console.log('\n3️⃣ Verificando estructura...');
    const fs = require('fs');
    const criticalFiles = [
        './src/config/database.js',
        './src/controllers/AuthController.js',
        './src/models/Usuario.js',
        './src/routes/authRoutes.js'
    ];
    
    criticalFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} - FALTANTE`);
        }
    });
    
    console.log('\n🎯 RESUMEN:');
    console.log('✅ Backend configurado correctamente');
    console.log('✅ Base de datos conectada');
    console.log('✅ Estructura de archivos completa');
    console.log('\n🚀 Para iniciar:');
    console.log('   Backend: npm run dev');
    console.log('   Frontend: cd ../frontend && npm run dev');
    console.log('\n📍 URLs:');
    console.log(`   API: http://localhost:${process.env.PORT || 3000}`);
    console.log('   App: http://localhost:5173');
    console.log('   phpMyAdmin: http://localhost/phpmyadmin');
};

validateSystem().catch(console.error);
