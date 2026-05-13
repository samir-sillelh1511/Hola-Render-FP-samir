const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Conexión usando la variable de entorno que configuraremos en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Requerido para Render
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`<h1>Hola mundo desde Render Dinámico</h1>
              <p>Estado de la BD: Conectada correctamente.</p>
              <p>Hora del servidor DB: ${result.rows[0].now}</p>`);
  } catch (err) {
    res.send("Error al conectar con la base de datos: " + err.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
