const express = require('express');
const SqlConnection = require('../../services/sqlService');
const router = express.Router();

const db = new SqlConnection();

// Conectar antes de usar
db.connectToDb();

// ===== POST: registrar usuario =====
router.post('/register', async (req, res) => {
  try {
    const { username, password_enc } = req.body;
    await db.insertUser(username, password_enc);
    res.status(201).send('Usuario registrado correctamente');
  } catch (err) {
    console.error('Error al registrar:', err);
    res.status(500).send('Error en el registro');
  }
});

// ===== POST: login =====
router.post('/login', async (req, res) => {
  try {
    const { username, password_enc } = req.body;
    const result = await db.findUser(username, password_enc);

    if (result.length > 0) {
      res.status(200).send('Login exitoso ✅');
    } else {
      res.status(401).send('Usuario o contraseña incorrectos ❌');
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).send('Error en el login');
  }
});

module.exports = router;
