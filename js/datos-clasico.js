window.datosEncuesta = {
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

window.cargarDatosGuardados = function () {
  const guardado = localStorage.getItem("datosEncuesta");
  if (guardado) {
    const datos = JSON.parse(guardado);
    window.datosEncuesta.encuestados = datos.encuestados || [];
    window.datosEncuesta.encuestadoActual = datos.encuestadoActual || null;
  }
};

function guardarEnLocalStorage() {
  localStorage.setItem("datosEncuesta", JSON.stringify(window.datosEncuesta));
}

window.guardarRegistro = function (data) {
  const actual = window.datosEncuesta.encuestadoActual;

  if (
    actual?.registro?.id &&
    window.encuestaCompleta(actual)
  ) {
    window.datosEncuesta.encuestados.push({ ...actual });
  }

  window.datosEncuesta.encuestadoActual = {
    registro: data,
    orientacion: [],
    autodeterminacion: [],
    items: [],
    bienestar: [],
    inclusion: []
  };

  guardarEnLocalStorage();
};

window.guardarRespuestas = function (seccion, respuestas) {
  window.datosEncuesta.encuestadoActual[seccion] = respuestas;
  guardarEnLocalStorage();
};

window.encuestaCompleta = function (e) {
  const seccionesEsperadas = {
    orientacion: 13,
    autodeterminacion: 9,
    bienestar: 9,
    inclusion: 9
  };

  for (const [seccion, cantidad] of Object.entries(seccionesEsperadas)) {
    const respuestas = e[seccion];
    if (!Array.isArray(respuestas) || respuestas.length !== cantidad || respuestas.some(r => r === "" || r == null)) {
      return false;
    }
  }

  const reg = e.registro;
  return reg && reg.id && reg.nombre && reg.fecha;
};

window.finalizarEncuestado = function () {
  window.cargarDatosGuardados();
  if (!window.encuestaCompleta(window.datosEncuesta.encuestadoActual)) {
    alert("⚠️ La encuesta no está completa.");
    return;
  }

  const copia = { ...window.datosEncuesta.encuestadoActual };
  window.datosEncuesta.encuestados.push(copia);
  window.datosEncuesta.encuestadoActual = null;
  guardarEnLocalStorage();

  alert("✅ Encuesta finalizada.");
  window.exportarTodoCSV();
  window.exportarIndividualCSV(copia);
  window.location.href = "../index.html";
};

window.exportarTodoCSV = function () {
  const encuestados = window.datosEncuesta.encuestados;
  if (!encuestados.length) {
    alert("No hay encuestas.");
    return;
  }

  const preguntas = {
    orientacion: 13,
    autodeterminacion: 9,
    bienestar: 9,
    inclusion: 9
  };

  const headers = [
    "ID", "Nombre", "Fecha", "Sexo", "Procedencia",
    ...Array.from({ length: preguntas.orientacion }, (_, i) => `Orientación_P${i + 1}`),
    ...Array.from({ length: preguntas.autodeterminacion }, (_, i) => `Autodeterminación_P${i + 1}`),
    ...Array.from({ length: preguntas.bienestar }, (_, i) => `Bienestar_P${i + 1}`),
    ...Array.from({ length: preguntas.inclusion }, (_, i) => `Inclusión_P${i + 1}`)
  ];

  let csv = headers.join(',') + '\n';

  encuestados.forEach(e => {
    const fila = [
      e.registro.id, e.registro.nombre, e.registro.fecha,
      e.registro.sexo, e.registro.procedencia,
      ...e.orientacion, ...e.autodeterminacion,
      ...e.bienestar, ...e.inclusion
    ];
    csv += fila.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'encuestas_completas.csv';
  link.click();
};

window.exportarIndividualCSV = function (e) {
  const preguntas = {
    orientacion: 13,
    autodeterminacion: 9,
    bienestar: 9,
    inclusion: 9
  };

  const headers = [
    "ID", "Nombre", "Fecha", "Sexo", "Procedencia",
    ...Array.from({ length: preguntas.orientacion }, (_, i) => `Orientación_P${i + 1}`),
    ...Array.from({ length: preguntas.autodeterminacion }, (_, i) => `Autodeterminación_P${i + 1}`),
    ...Array.from({ length: preguntas.bienestar }, (_, i) => `Bienestar_P${i + 1}`),
    ...Array.from({ length: preguntas.inclusion }, (_, i) => `Inclusión_P${i + 1}`)
  ];

  const fila = [
    e.registro.id, e.registro.nombre, e.registro.fecha,
    e.registro.sexo, e.registro.procedencia,
    ...e.orientacion, ...e.autodeterminacion,
    ...e.bienestar, ...e.inclusion
  ];

  const csv = [headers.join(','), fila.join(',')].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `encuesta_${e.registro.id}.csv`;
  link.click();
};
