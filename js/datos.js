
// datos.js - Gestión robusta para encuestas locales múltiples

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

// Cargar encuestas almacenadas desde localStorage
export function cargarDatosGuardados() {
  const guardado = localStorage.getItem('datosEncuesta');
  if (guardado) {
    const datos = JSON.parse(guardado);
    Object.assign(datosEncuesta, datos);
  }
}

// Guardar en localStorage después de cada modificación
function guardarEnLocalStorage() {
  localStorage.setItem('datosEncuesta', JSON.stringify(datosEncuesta));
}

// Guardar la sección de datos personales
export function guardarRegistro(data) {
  datosEncuesta.encuestadoActual.registro = data;
  guardarEnLocalStorage();
}

// Guardar una sección del cuestionario
export function guardarRespuestas(seccion, respuestas) {
  datosEncuesta.encuestadoActual[seccion] = respuestas;
  guardarEnLocalStorage();
}

// Verifica que el encuestadoActual tenga todas las secciones llenas
function encuestaCompleta(e) {
  const secciones = ["orientacion", "autodeterminacion", "items", "bienestar", "inclusion"];
  return (
    e.registro.id &&
    secciones.every(seccion =>
      Array.isArray(e[seccion]) &&
      e[seccion].length > 0 &&
      e[seccion].every(r => r !== "")
    )
  );
}

// Finalizar encuesta, guardar y exportar CSV de inmediato
export function finalizarEncuestado() {
  const actual = datosEncuesta.encuestadoActual;

  if (!encuestaCompleta(actual)) {
    alert("⚠️ La encuesta no está completa. Asegúrate de llenar todos los módulos.");
    return;
  }

  datosEncuesta.encuestados.push(structuredClone(actual));

  // Limpiar para el siguiente
  datosEncuesta.encuestadoActual = {
    registro: {},
    orientacion: [],
    autodeterminacion: [],
    items: [],
    bienestar: [],
    inclusion: []
  };

  guardarEnLocalStorage();
  alert("✅ Encuesta finalizada y guardada. Se descargará el archivo CSV.");
  exportarTodoCSV();
}

// Exportar todas las encuestas completas como archivo CSV
export function exportarTodoCSV() {
  if (!datosEncuesta.encuestados.length) {
    alert("No hay encuestas para exportar.");
    return;
  }

  const preguntasPorSeccion = {
    orientacion: 13,
    autodeterminacion: 9,
    items: 3,
    bienestar: 9,
    inclusion: 9
  };

  const headers = [
    "ID", "Nombre", "Fecha", "Sexo", "Procedencia",
    ...Array.from({ length: preguntasPorSeccion.orientacion }, (_, i) => `Orientación_P${i + 1}`),
    ...Array.from({ length: preguntasPorSeccion.autodeterminacion }, (_, i) => `Autodeterminación_P${i + 1}`),
    ...Array.from({ length: preguntasPorSeccion.items }, (_, i) => `Items_P${i + 1}`),
    ...Array.from({ length: preguntasPorSeccion.bienestar }, (_, i) => `Bienestar_P${i + 1}`),
    ...Array.from({ length: preguntasPorSeccion.inclusion }, (_, i) => `Inclusión_P${i + 1}`)
  ];

  let csv = headers.join(',') + '\n';

  datosEncuesta.encuestados.forEach((e) => {
    const fila = [
      e.registro.id || '',
      e.registro.nombre || '',
      e.registro.fecha || '',
      e.registro.sexo || '',
      e.registro.procedencia || '',
      ...(e.orientacion || []).slice(0, preguntasPorSeccion.orientacion),
      ...(e.autodeterminacion || []).slice(0, preguntasPorSeccion.autodeterminacion),
      ...(e.items || []).slice(0, preguntasPorSeccion.items),
      ...(e.bienestar || []).slice(0, preguntasPorSeccion.bienestar),
      ...(e.inclusion || []).slice(0, preguntasPorSeccion.inclusion)
    ];
    csv += fila.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'encuestas_completas.csv';
  link.click();
}
