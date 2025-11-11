const mysql = require('mysql2/promise');
const config = require('./index');

// Configuración de la base de datos desde config centralizada
const dbConfig = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    port: config.database.port,
    waitForConnections: true,
    connectionLimit: config.database.connectionLimit,
    queueLimit: config.database.queueLimit,
    acquireTimeout: config.database.acquireTimeout,
    charset: config.database.charset,
    timezone: config.database.timezone
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para verificar la conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ Conexión a MySQL establecida correctamente`);
        console.log(`   - Host: ${config.database.host}:${config.database.port}`);
        console.log(`   - Base de datos: ${config.database.name}`);
        console.log(`   - Usuario: ${config.database.user}`);
        console.log(`   - Pool: ${config.database.connectionLimit} conexiones máx.`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error.message);
        console.error(`   - Host: ${config.database.host}:${config.database.port}`);
        console.error(`   - Base de datos: ${config.database.name}`);
        console.error(`   - Usuario: ${config.database.user}`);
        return false;
    }
};

// Función para ejecutar queries
const query = async (sql, params = []) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
};

// Función para transacciones
const transaction = async (callback) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    pool,
    query,
    transaction,
    testConnection
};
