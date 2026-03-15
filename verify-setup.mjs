import mysql from 'mysql2/promise';

async function verifySetup() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✓ Conectado a MySQL\n');

    // Check database exists
    const [dbs] = await connection.query('SHOW DATABASES LIKE "videxa_studio"');
    if (dbs.length === 0) {
      console.error('✗ Base de datos videxa_studio no existe');
      process.exit(1);
    }
    console.log('✓ Base de datos videxa_studio existe');

    // Check admin user
    const [users] = await connection.query(
      'SELECT id, email, role, name, password FROM `videxa_studio`.`users` WHERE email = ?',
      ['admin@videxa.com']
    );

    if (users.length === 0) {
      console.error('✗ Usuario admin no encontrado');
      process.exit(1);
    }

    const user = users[0];
    console.log('\n✓ Usuario Admin encontrado:');
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Password Hash: ${user.password}`);

    if (user.role !== 'admin') {
      console.error('\n✗ ERROR: El rol no es admin, es:', user.role);
      process.exit(1);
    }

    if (!user.password) {
      console.error('\n✗ ERROR: El usuario no tiene contraseña');
      process.exit(1);
    }

    console.log('\n✓ Todo está configurado correctamente');
    console.log('\nProximos pasos:');
    console.log('1. Reinicia el servidor: pnpm dev');
    console.log('2. Abre DevTools (F12) en el navegador');
    console.log('3. Ve a Network y marca "Preserve log"');
    console.log('4. Limpia TODAS las cookies (Application > Cookies > Delete all)');
    console.log('5. Recarga la página (Ctrl+Shift+R hard refresh)');
    console.log('6. Intenta login con: admin@videxa.com / VidexaStudio2026');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

verifySetup();
