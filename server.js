require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());

// Respuesta rápida para health checks
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Conexión a DB con manejo de errores
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
}).on('error', (err) => {
  console.error('Error de DB:', err);
});

// Endpoint principal rápido
app.get('/', (req, res) => {
  res.send('Backend listo');
});

// Endpoint de demos (la lógica pesada va aquí)
app.get('/api/demos', async (req, res) => {
  try {
    const [demos] = await pool.query('SELECT * FROM demos');
    res.json(demos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la DB' });
  }
});

// ¡Usa process.env.PORT!
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});