const { query } = require('./src/config/database');

async function testRoles() {
    try {
        console.log('=== PROBANDO CONSULTA DE ROLES ===');
        
        // Usuario 1 (REVILLA - Admin)
        const roles1 = await query(`
            SELECT r.nombre as rol_nombre
            FROM usuario_roles ur 
            INNER JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = ?
        `, [1]);
        console.log('Usuario 1 (REVILLA) roles:', roles1);
        
        // Usuario 10 (James - Director)  
        const roles10 = await query(`
            SELECT r.nombre as rol_nombre
            FROM usuario_roles ur 
            INNER JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = ?
        `, [10]);
        console.log('Usuario 10 (James) roles:', roles10);
        
        // Usuario 11 (drmedicina - Docente sin roles)
        const roles11 = await query(`
            SELECT r.nombre as rol_nombre
            FROM usuario_roles ur 
            INNER JOIN roles r ON ur.role_id = r.id 
            WHERE ur.user_id = ?
        `, [11]);
        console.log('Usuario 11 (drmedicina) roles:', roles11);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testRoles();
