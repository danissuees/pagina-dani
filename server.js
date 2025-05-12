require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Obtener todos los demos
app.get('/api/demos', async (req, res) => {
  try {
    const [demos] = await pool.query(`
      SELECT id, nombre, descripcion, url_archivo, portada, fecha_subida 
      FROM demos 
      ORDER BY fecha_subida DESC
    `);
    res.json(demos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener demos');
  }
});

// Agregar nuevo demo
app.post('/api/demos', async (req, res) => {
  const { nombre, descripcion, url_archivo, portada } = req.body;
  
  if (!nombre || !url_archivo) {
    return res.status(400).json({ error: 'Nombre y URL de archivo son requeridos' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO demos (nombre, descripcion, url_archivo, portada) VALUES (?, ?, ?, ?)',
      [nombre, descripcion || '', url_archivo, portada || '']
    );
    res.status(201).json({ 
      id: result.insertId,
      nombre,
      descripcion,
      url_archivo,
      portada,
      fecha_subida: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al guardar demo');
  }
});

// Iniciar servidor
app.listen(process.env.SERVER_PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${process.env.SERVER_PORT}`);
});