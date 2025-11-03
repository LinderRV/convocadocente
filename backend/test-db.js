// Script para probar la conexión a la base de datos
const { testConnection } = require('./src/config/database');

const testDB = async () => {
    console.log('🔍 Probando conexión a la base de datos...');
    
    try {
        const isConnected = await testConnection();
        if (isConnected) {
            console.log('✅ Conexión exitosa a bd_convocadocente');
        } else {
            console.log('❌ Error en la conexión');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
    
    process.exit(0);
};

testDB();
