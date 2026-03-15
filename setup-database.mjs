import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  let connection;
  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    console.log('✓ Conectado a MySQL');

    // Read SQL file
    const sqlFile = path.join(process.cwd(), 'setup-db.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('Ejecutando script SQL...');
    
    // Execute all statements
    await connection.query(sql);
    
    console.log('✓ Base de datos configurada exitosamente');
    
    // Verify admin user
    const [rows] = await connection.query(
      'SELECT id, email, role, name FROM users WHERE email = ?',
      ['admin@videxa.com']
    );
    
    if (rows.length > 0) {
      console.log('\n✓ Usuario Admin creado correctamente:');
      console.log(JSON.stringify(rows[0], null, 2));
    } else {
      console.log('\n✗ Error: Usuario admin no encontrado');
    }

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

setupDatabase();
