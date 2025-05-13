require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// 1. Primero define la instancia de Express
const app = express();

// 2. Configura CORS después de definir `app`
const corsOptions = {
  origin: [
    'https://danissuees.github.io',
    'http://localhost:3000',
    'https://pagina-dani-production.up.railway.app'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

// 3. Middleware para parsear JSON
app.use(express.json());

// 4. Conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10
});
// Endpoint de prueba de DB
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM demos LIMIT 1');
    res.json({ 
      status: 'Conexión exitosa a la DB',
      demo: rows[0] || 'No hay demos en la tabla'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al conectar a la DB',
      details: error.message
    });
  }
});
// 5. Endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando' });
});

app.get('/api/demos', async (req, res) => {
  try {
    const [demos] = await pool.query('SELECT * FROM demos');
    res.json(demos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener demos' });
  }
});


// 6. Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
