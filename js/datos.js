
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
/* export function cargarDatosGuardados() {
  const guardado = localStorage.getItem('datosEncuesta');
  if (guardado) {
    const datos = JSON.parse(guardado);
    Object.assign(datosEncuesta, datos);
  }
} */
export function cargarDatosGuardados() {
  const guardado = localStorage.getItem('datosEncuesta');
  if (guardado) {
    const datos = JSON.parse(guardado);
    datosEncuesta.encuestados = datos.encuestados || [];
    datosEncuesta.encuestadoActual = datos.encuestadoActual || null;
  }
}


// Guardar en localStorage después de cada modificación
function guardarEnLocalStorage() {
  localStorage.setItem('datosEncuesta', JSON.stringify(datosEncuesta));
}

// Guardar la sección de datos personales
/*export function guardarRegistro(data) {
  datosEncuesta.encuestadoActual.registro = data;
  guardarEnLocalStorage();
}*/
export function guardarRegistro(data) {
  // Si hay un encuestado anterior completo no finalizado, lo guardamos
  if (
    datosEncuesta.encuestadoActual?.registro?.id &&
    encuestaCompleta(datosEncuesta.encuestadoActual)
  ) {
    datosEncuesta.encuestados.push({ ...datosEncuesta.encuestadoActual });
  }

  // Iniciar nuevo registro
  datosEncuesta.encuestadoActual = {
    registro: data,
    orientacion: [],
    autodeterminacion: [],
    items: [],
    bienestar: [],
    inclusion: []
  };

  localStorage.setItem("datosEncuesta", JSON.stringify(datosEncuesta));
}


// Guardar una sección del cuestionario
export function guardarRespuestas(seccion, respuestas) {
  datosEncuesta.encuestadoActual[seccion] = respuestas;
  guardarEnLocalStorage();
}

// Verifica que el encuestadoActual tenga todas las secciones llenas
function encuestaCompleta(e) {
  const seccionesEsperadas = {
    orientacion: 13,
    autodeterminacion: 9,
    bienestar: 9,
    inclusion: 9
  };

  for (const [seccion, cantidad] of Object.entries(seccionesEsperadas)) {
    const respuestas = e[seccion];
    if (!Array.isArray(respuestas)) {
      console.warn(`No es un arreglo: ${seccion}`, respuestas);
      return false;
    }

    if (respuestas.length !== cantidad) {
      console.warn(`Cantidad incorrecta en ${seccion}. Esperado: ${cantidad}, Recibido: ${respuestas.length}`);
      return false;
    }

    if (respuestas.some(r => r === "" || r === undefined || r === null)) {
      console.warn(`Respuestas vacías en ${seccion}:`, respuestas);
      return false;
    }
  }

  const reg = e.registro;
  if (!reg || !reg.id || !reg.nombre || !reg.fecha) {
    console.warn("Registro incompleto:", reg);
    return false;
  }

  return true;
}




// Finalizar encuesta, guardar y exportar CSV de inmediato
export function finalizarEncuestado() {
  cargarDatosGuardados(); // Asegurarse de que los datos estén actualizados
  if (!encuestaCompleta(datosEncuesta.encuestadoActual)) {
    alert("⚠️ La encuesta no está completa. Asegúrate de llenar todos los módulos.");
    return;
  }

  const copia = { ...datosEncuesta.encuestadoActual };
  // Reconfirma que encuestados existe
  if (!Array.isArray(datosEncuesta.encuestados)) {
    datosEncuesta.encuestados = [];
  }

  datosEncuesta.encuestados.push(copia);
  datosEncuesta.encuestadoActual = null;
  localStorage.setItem("datosEncuesta", JSON.stringify(datosEncuesta));

  alert("✅ Encuesta finalizada y guardada correctamente.");

  exportarTodoCSV();                // CSV general
  exportarIndividualCSV(copia);    // CSV por encuestado

  window.location.href = "../index.html";
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
    bienestar: 9,
    inclusion: 9
  };

  const headers = [
    "ID", "Nombre", "Fecha", "Sexo", "Procedencia",
    ...Array.from({ length: preguntasPorSeccion.orientacion }, (_, i) => `Orientación_P${i + 1}`),
    ...Array.from({ length: preguntasPorSeccion.autodeterminacion }, (_, i) => `Autodeterminación_P${i + 1}`),
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
// Funcion para exportar un encuestado individual a CSV
function exportarIndividualCSV(e) {
  const preguntasPorSeccion = {
    orientacion: 13,
    autodeterminacion: 9,
    bienestar: 9,
    inclusion: 9
  };

  const headers = [
    "ID", "Nombre", "Fecha", "Sexo", "Procedencia",
    ...Array.from({ length: preguntasPorSeccion.orientacion }, (_, i) => `Orientación_P${i + 1}`),
    ...Array.from({ length: preguntasPorSeccion.autodeterminacion }, (_, i) => `Autodeterminación_P${i + 1}`),
    ...Array.from({ length: preguntasPorSeccion.bienestar }, (_, i) => `Bienestar_P${i + 1}`),
    ...Array.from({ length: preguntasPorSeccion.inclusion }, (_, i) => `Inclusión_P${i + 1}`)
  ];

  const fila = [
    e.registro.id || '',
    e.registro.nombre || '',
    e.registro.fecha || '',
    e.registro.sexo || '',
    e.registro.procedencia || '',
    ...(e.orientacion || []),
    ...(e.autodeterminacion || []),
    ...(e.bienestar || []),
    ...(e.inclusion || [])
  ];

  const csv = [headers.join(','), fila.join(',')].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `encuesta_${e.registro.id || "respaldo"}.csv`;
  link.click();
}


