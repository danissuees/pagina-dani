const API_URL = 'http://localhost:3000/api';
const demosContainer = document.getElementById('demos');
const audioElement = document.getElementById('audio');
const nowPlaying = document.getElementById('now-playing');

// Cargar demos al iniciar
document.addEventListener('DOMContentLoaded', loadDemos);

async function loadDemos() {
  try {
    const response = await fetch(`${API_URL}/demos`);
    const demos = await response.json();
    renderDemos(demos);
  } catch (err) {
    console.error('Error al cargar demos:', err);
    nowPlaying.textContent = 'error al cargar demos';
  }
}

function renderDemos(demos) {
  demosContainer.innerHTML = '';
  
  demos.forEach(demo => {
    const demoEl = document.createElement('div');
    demoEl.className = 'demo';
    
    // Si hay portada, mostrarla, sino mostrar placeholder
    const coverImg = demo.portada 
      ? `<img src="${demo.portada}" alt="${demo.nombre}" class="demo-cover">`
      : '<div class="demo-cover placeholder"></div>';
    
    demoEl.innerHTML = `
      ${coverImg}
      <div class="demo-info">
        <h3>${demo.nombre}</h3>
        ${demo.descripcion ? `<p>${demo.descripcion}</p>` : ''}
        <small>${formatDate(demo.fecha_subida)}</small>
      </div>
    `;
    
    demoEl.addEventListener('click', () => {
      playDemo(demo);
    });
    
    demosContainer.appendChild(demoEl);
  });
}

function playDemo(demo) {
  audioElement.src = demo.url_archivo;
  audioElement.play();
  nowPlaying.textContent = `reproduciendo: ${demo.nombre}`;
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función para agregar demos desde la consola
window.addDemo = async (nombre, url_archivo, descripcion = '', portada = '') => {
  try {
    const response = await fetch(`${API_URL}/demos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion, url_archivo, portada })
    });
    
    if (response.ok) {
      loadDemos(); // Recargar lista
      console.log('Demo agregado correctamente');
    }
  } catch (err) {
    console.error('Error al agregar demo:', err);
  }
};