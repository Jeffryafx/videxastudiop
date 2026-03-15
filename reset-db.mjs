import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function resetAndSetup() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    console.log('✓ Conectado a MySQL\n');

    // Drop and recreate database
    console.log('Reseteando BD...');
    await connection.query('DROP DATABASE IF EXISTS videxa_studio');
    console.log('✓ BD eliminada');

    // Read the setup SQL file
    const fs = await import('fs');
    const path = await import('path');
    const sqlFile = path.resolve('./setup-db.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute setup SQL
    await connection.query(sql);
    console.log('✓ BD recreada con estructura\n');

    // Create a new test user
    const testPassword = 'TestUser123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    console.log('Creando nuevo usuario de prueba...');
    await connection.query(
      `INSERT INTO videxa_studio.users (email, password, name, role, loginMethod, lastSignedIn, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
      ['test@videxa.com', hashedPassword, 'Test User', 'admin', 'email']
    );
    console.log('✓ Usuario creado\n');

    // Verify users
    const [users] = await connection.query(
      'SELECT id, email, name, role FROM videxa_studio.users'
    );

    console.log('📋 Usuarios en la BD:');
    users.forEach((user) => {
      console.log(`  - ${user.email} (Role: ${user.role}) [ID: ${user.id}]`);
    });

    console.log('\n✅ Setup completado exitosamente!\n');
    console.log('Credenciales para testing:');
    console.log(`  Email: test@videxa.com`);
    console.log(`  Contraseña: ${testPassword}`);
    console.log(`  Rol: admin\n`);
    console.log('Próximos pasos:');
    console.log('1. Reinicia el servidor: pnpm dev');
    console.log('2. Abre el navegador en http://localhost:5173/login');
    console.log('3. Limpia las cookies (F12 > Application > Cookies > Delete All)');
    console.log('4. Recarga la página (Ctrl+Shift+R)');
    console.log('5. Intenta login con las credenciales anteriores');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetAndSetup();
