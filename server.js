// server.js - VERSIÓN DEFINITIVA
require('dotenv').config();
const express = require('express');
const app = express();

// 1. Middleware esencial
app.use(express.json());

// 2. Health Check ESPECÍFICO para Railway
app.get('/railway-health', (req, res) => {
  res.status(200).json({ 
    status: 'ready',
    timestamp: Date.now() 
  });
});

// 3. Puerto DINÁMICO (OBLIGATORIO)
const PORT = process.env.PORT || 3000; // ¡Nunca 8080!

// 4. Inicio con verificación
app.listen(PORT, '0.0.0.0', () => { // '0.0.0.0' es crucial
  console.log(`🔥 Servidor OPERATIVO en ${PORT}`);
  setInterval(() => {
    console.log('💓 Latido activo:', new Date().toISOString());
  }, 15000); // Latidos cada 15 segundos
});

// 5. Manejo de SIGTERM (Para Railway)
process.on('SIGTERM', () => {
  console.log('Recibido SIGTERM. Cerrando limpiamente...');
  process.exit(0);
});