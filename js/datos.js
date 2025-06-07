// datos.js - Gestión centralizada de múltiples encuestas

// Estructura principal: un encuestado actual y un arreglo de encuestados ya completados
export const datosEncuesta = {
  encuestadoActual: {
    registro: {},
    orientacion: [],
    autodeterminacion: [],
    items: [],
    bienestar: [],
    inclusion: []
  },
  encuestados: []
};

// Carga datos previos desde localStorage al iniciar el sistema
export function cargarDatosGuardados() {
  const guardado = localStorage.getItem('datosEncuesta');
  if (guardado) {
    const datos = JSON.parse(guardado);
    Object.assign(datosEncuesta, datos);
  }
}

// Guarda el estado actual del sistema (actual y todos los encuestados) en localStorage
function guardarEnLocalStorage() {
  localStorage.setItem('datosEncuesta', JSON.stringify(datosEncuesta));
}

// Guarda los datos del registro en el encuestado actual
export function guardarRegistro(data) {
  datosEncuesta.encuestadoActual.registro = data;
  guardarEnLocalStorage();
}

// Guarda las respuestas de una sección para el encuestado actual
export function guardarRespuestas(seccion, respuestas) {
  datosEncuesta.encuestadoActual[seccion] = respuestas;
  guardarEnLocalStorage();
}

// Finaliza una encuesta: guarda la actual en el arreglo de encuestados y limpia para el siguiente
export function finalizarEncuestado() {
  const nuevo = structuredClone(datosEncuesta.encuestadoActual); // se clona para no vincular referencias
  datosEncuesta.encuestados.push(nuevo);

  // Limpia el encuestado actual para comenzar otra encuesta
  datosEncuesta.encuestadoActual = {
    registro: {},
    orientacion: [],
    autodeterminacion: [],
    items: [],
    bienestar: [],
    inclusion: []
  };

  guardarEnLocalStorage();
  alert("✅ Encuesta finalizada. Lista para un nuevo participante.");
}

// Exporta todas las encuestas completadas a un solo archivo CSV
export function exportarTodoCSV() {
  if (!datosEncuesta.encuestados.length) {
    alert("No hay encuestas para exportar.");
    return;
  }

  let csv = '';

  // Encabezados
  const headers = [
    "ID", "Nombre", "Fecha", "Sexo", "Procedencia",
    ...Array.from({ length: 10 }, (_, i) => `Orientación_P${i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `Autodeterminación_P${i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `Items_P${i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `Bienestar_P${i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `Inclusión_P${i + 1}`)
  ];

  csv += headers.join(',') + '\\n';

  // Cuerpo del CSV
  datosEncuesta.encuestados.forEach((e) => {
    const fila = [
      e.registro.id || '',
      e.registro.nombre || '',
      e.registro.fecha || '',
      e.registro.sexo || '',
      e.registro.procedencia || '',
      ...(e.orientacion || []),
      ...(e.autodeterminacion || []),
      ...(e.items || []),
      ...(e.bienestar || []),
      ...(e.inclusion || [])
    ];
    csv += fila.join(',') + '\\n';
  });

  // Descarga del archivo
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'encuestas_completas.csv';
  link.click();
}
