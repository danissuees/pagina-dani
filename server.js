// Habilita CORS con más opciones
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

// Endpoint mejorado para demos
app.get('/api/demos', async (req, res) => {
  console.log('Recibida petición a /api/demos'); // Log para debug
  try {
    const [demos] = await pool.query('SELECT * FROM demos');
    console.log('Demos encontrados:', demes.length); // Log para debug
    res.json(demos);
  } catch (error) {
    console.error('Error en DB:', error.message); // Log detallado
    res.status(500).json({ 
      error: 'Error al cargar demos',
      details: error.message
    });
  }
});