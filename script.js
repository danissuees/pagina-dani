// Configuración
const API_URL = 'https://pagina-dani-production.up.railway.app/api';
const demosContainer = document.getElementById('demos-container');
const audioElement = document.getElementById('audio-element');
const nowPlaying = document.getElementById('now-playing');

// Cargar demos al iniciar
document.addEventListener('DOMContentLoaded', () => {
  loadDemos();
  setInterval(loadDemos, 30000); // Actualizar cada 30 segundos
});

// Obtener demos desde la API
async function loadDemos() {
  try {
    const response = await fetch(`${API_URL}/demos?nocache=${Date.now()}`);
    const demos = await response.json();
    renderDemos(demos);
  } catch (error) {
    console.error('Error:', error);
    nowPlaying.textContent = 'Error al cargar demos';
  }
}

// Mostrar demos en pantalla
function renderDemos(demos) {
  demosContainer.innerHTML = demos.map(demo => `
    <div class="demo" onclick="playDemo('${demo.url_archivo}', '${demo.nombre}')">
      <h3>${demo.nombre}</h3>
      ${demo.descripcion ? `<p>${demo.descripcion}</p>` : ''}
      <small>${new Date(demo.fecha_subida).toLocaleDateString('es-MX')}</small>
    </div>
  `).join('');
}

// Reproducir un demo
function playDemo(audioUrl, nombre) {
  audioElement.src = audioUrl;
  audioElement.play();
  nowPlaying.textContent = `Reproduciendo: ${nombre}`;
}

// Función global para agregar demos desde consola (opcional)
window.addDemo = async (nombre, url_archivo, descripcion = '', portada = '') => {
  try {
    const response = await fetch(`${API_URL}/demos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion, url_archivo, portada })
    });
    if (response.ok) loadDemos();
  } catch (error) {
    console.error('Error al agregar demo:', error);
  }
};