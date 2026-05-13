const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión usando la variable de entorno DATABASE_URL
const pool = new Pool({
  connectionString: process.env.BASE_URL,
  ssl: { rejectUnauthorized: false } // Obligatorio para conexiones externas en Render
});

app.get('/', async (req, res) => {
  try {
    // 1. Realizamos una consulta a la tabla 'alumnos' creada en DBeaver
    // Si la tabla no existe aún, fallará. Asegúrate de haber ejecutado:
    // CREATE TABLE alumnos (id SERIAL PRIMARY KEY, nombre TEXT);
    const result = await pool.query('SELECT * FROM alumnos');
    
    // 2. También obtenemos la hora del servidor para confirmar la conexión en tiempo real
    const timeResult = await pool.query('SELECT NOW()');
    const dbTime = timeResult.rows[0].now;

    // 3. Generamos la lista de alumnos dinámicamente
    const listaAlumnos = result.rows.length > 0 
      ? result.rows.map(a => `<li>${a.nombre} (ID: ${a.id})</li>`).join('')
      : '<li>No hay alumnos registrados todavía.</li>';

    // 4. Enviamos la respuesta al navegador
    res.send(`
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #2c3e50;">Hola mundo desde Render Dinámico</h1>
        <p><strong>Estado de la BD:</strong> <span style="color: green;">Conectada correctamente ✅</span></p>
        <p><strong>Hora actual del servidor DB:</strong> ${dbTime}</p>
        
        <h2 style="color: #2980b9;">Lista de Alumnos (Datos Reales):</h2>
        <ul>
          ${listaAlumnos}
        </ul>
        
        <hr>
        <p><small>Desplegado por Samir - Práctica FP</small></p>
      </div>
    `);
  } catch (err) {
    // Si hay un error (ej. la tabla no existe), lo mostramos en pantalla para debuguear
    res.status(500).send(`
      <h1>Error en la conexión ❌</h1>
      <p>Detalle técnico: ${err.message}</p>
    `);
  }
});

app.listen(port, () => {
  console.log(`Servidor dinámico escuchando en el puerto ${port}`);
});
