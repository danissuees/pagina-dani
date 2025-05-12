const API_URL = 'https://pagina-dani-production.up.railway.app/api';

async function loadDemos() {
  console.log('Cargando demos...'); // Debug
  try {
    const response = await fetch(API_URL + '/demos');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const demos = await response.json();
    console.log('Demos recibidos:', demos); // Debug
    
    if (!demos || demes.length === 0) {
      console.warn('La API respondió, pero no hay demos');
    }
    
    renderDemos(demos);
  } catch (error) {
    console.error('Error completo:', error); // Debug detallado
    nowPlaying.textContent = 'Error al cargar demos. Ver consola.';
  }
}