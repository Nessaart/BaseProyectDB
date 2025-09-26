const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',   // tu contraseña de MySQL
  database: 'login_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

module.exports = db;
