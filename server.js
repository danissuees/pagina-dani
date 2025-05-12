require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// Configura CORS para GitHub Pages y localhost
app.use(cors({
  origin: ['https://danissuees.github.io', 'http://localhost:3000']
}));

app.use(express.json());

// Conexión a tu base de datos FreeSQLDatabase
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10
});

// Ruta de prueba
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Backend conectado a Railway',
    db: process.env.DB_NAME
  });
});

// Obtener todos los demos
app.get('/api/demos', async (req, res) => {
  try {
    const [demos] = await pool.query(`
      SELECT id, nombre, descripcion, url_archivo, portada, fecha_subida
      FROM demos
      ORDER BY fecha_subida DESC
    `);
    res.json(demos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar demos' });
  }
});

// Agregar nuevo demo (opcional)
app.post('/api/demos', async (req, res) => {
  const { nombre, descripcion, url_archivo, portada } = req.body;
  
  try {
    const [result] = await pool.query(
      `INSERT INTO demos (nombre, descripcion, url_archivo, portada)
       VALUES (?, ?, ?, ?)`,
      [nombre, descripcion, url_archivo, portada]
    );
    res.status(201).json({
      id: result.insertId,
      nombre,
      url_archivo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar demo' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listo en puerto ${PORT}`);
});