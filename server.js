require('dotenv').config();
const express = require('express');
const app = express();

// Middleware básico
app.use(express.json());

// Endpoint de supervivencia
app.get('/railway-lifecheck', (req, res) => {
  res.status(200).json({ 
    status: 'alive',
    timestamp: new Date().toISOString() 
  });
});

// Puerto DINÁMICO (obligatorio para Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor ACTIVO en puerto ${PORT}`);
});

// Mantén el proceso vivo
setInterval(() => {
  console.log('❤️ Latido del servidor', new Date().toISOString());
}, 30000);