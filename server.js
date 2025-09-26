const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlRoutes = require('./routes/sqlRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (html, js, css)
app.use(express.static('public'));

// Rutas SQL
app.use('/auth', sqlRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
