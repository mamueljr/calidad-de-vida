// registro.js
export function guardarEnLocalStorage(datos) {
  const registros = JSON.parse(localStorage.getItem("encuestados") || "[]");
  registros.push(datos);
  localStorage.setItem("encuestados", JSON.stringify(registros));
}

function obtenerDatosFormulario() {
  return {
    fecha: document.getElementById("fecha").value,
    nombre: document.getElementById("nombre").value,
    sexo: document.getElementById("sexo").value,
    procedencia: document.getElementById("procedencia").value,
    id: document.getElementById("id").value,
    orientacion: null,
    evaluacion: null
  };
}

function validarFormulario(datos) {
  return datos.fecha && datos.nombre && datos.sexo && datos.procedencia && datos.id;
}

window.guardarRegistro = function () {
  const datos = obtenerDatosFormulario();

  if (!validarFormulario(datos)) {
    alert("Por favor completa todos los campos.");
    return;
  }

  guardarEnLocalStorage(datos);
  alert("Registro guardado correctamente.");
};

window.continuarCuestionario = function () {
  const datos = obtenerDatosFormulario();

  if (!validarFormulario(datos)) {
    alert("Por favor completa todos los campos.");
    return;
  }

  guardarEnLocalStorage(datos);
  window.location.href = "orientacion.html";
};

window.regresarMenu = function () {
  window.location.href = "../index.html";
};
