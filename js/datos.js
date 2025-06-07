// datos.js - Módulo central para almacenar y exportar respuestas

export const datosEncuesta = {
  registro: {},
  orientacion: [],
  autodeterminacion: [],
  items: [],
  bienestar: [],
  inclusion: []
};

export function guardarRegistro(data) {
  datosEncuesta.registro = data;
  localStorage.setItem('datosEncuesta', JSON.stringify(datosEncuesta));
}

export function guardarRespuestas(seccion, respuestas) {
  datosEncuesta[seccion] = respuestas;
  localStorage.setItem('datosEncuesta', JSON.stringify(datosEncuesta));
}

export function cargarDatosGuardados() {
  const datosGuardados = localStorage.getItem('datosEncuesta');
  if (datosGuardados) {
    const datos = JSON.parse(datosGuardados);
    Object.assign(datosEncuesta, datos);
  }
}

export function exportarTodoCSV() {
  let csv = '';
  
  // Datos de registro
  if (Object.keys(datosEncuesta.registro).length) {
    csv += 'Registro\n';
    for (const [k, v] of Object.entries(datosEncuesta.registro)) {
      csv += `${k},${v}\n`;
    }
    csv += '\n';
  }

  // Función para convertir arrays de respuestas
  function convertirRespuestas(titulo, respuestas) {
    if (!respuestas.length) return '';
    let csvSec = titulo + '\n';
    csvSec += respuestas[0].map((_, i) => `P${i+1}`).join(',') + '\n';
    csvSec += respuestas.map(r => r.join(',')).join('\n') + '\n\n';
    return csvSec;
  }

  csv += convertirRespuestas('Orientación', datosEncuesta.orientacion);
  csv += convertirRespuestas('Autodeterminación', datosEncuesta.autodeterminacion);
  csv += convertirRespuestas('Items', datosEncuesta.items);
  csv += convertirRespuestas('Bienestar', datosEncuesta.bienestar);
  csv += convertirRespuestas('Inclusión', datosEncuesta.inclusion);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'resultados_completos.csv';
  link.click();
}
