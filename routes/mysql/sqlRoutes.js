const express = require('express');
const router = express.Router();
const db = require('../mysqlConfig');

// 🔑 Función de encriptación personalizada
function customEncrypt(password) {
  return Buffer.from(password.split('').reverse().join('')).toString('base64');
}

// ================== REGISTRO ==================
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "❌ Usuario y contraseña requeridos" });
  }

  const encryptedPassword = customEncrypt(password);

  const query = "INSERT INTO usuarios (username, password_enc) VALUES (?, ?)";
  db.query(query, [username, encryptedPassword], (err, result) => {
    if (err) {
      console.error("❌ Error en registro:", err.message);
      return res.json({ success: false, message: "Error al registrar usuario" });
    }
    res.json({ success: true, message: "✅ Usuario registrado correctamente" });
  });
});

// ================== LOGIN ==================
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: "❌ Usuario y contraseña requeridos" });
  }

  const encryptedPassword = customEncrypt(password);

  const query = "SELECT * FROM usuarios WHERE username = ? AND password_enc = ?";
  db.query(query, [username, encryptedPassword], (err, results) => {
    if (err) {
      console.error("❌ Error en login:", err.message);
      return res.json({ success: false, message: "Error en servidor" });
    }

    if (results.length > 0) {
      res.json({ success: true, message: `✅ Bienvenido ${username}` });
    } else {
      res.json({ success: false, message: "❌ Usuario o contraseña incorrectos" });
    }
  });
});

module.exports = router;