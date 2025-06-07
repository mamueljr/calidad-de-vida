import { guardarRegistro, cargarDatosGuardados } from './datos.js';

cargarDatosGuardados();

window.guardarRegistro = function () {
  const data = {
    fecha: document.getElementById("fecha").value,
    nombre: document.getElementById("nombre").value.trim(),
    sexo: document.getElementById("sexo").value,
    procedencia: document.getElementById("procedencia").value.trim(),
    id: document.getElementById("id").value.trim()
  };

  if (!data.fecha || !data.nombre || !data.sexo || !data.procedencia || !data.id) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  guardarRegistro(data);
  alert("✅ Registro guardado correctamente.");
};

window.continuarCuestionario = function () {
  window.location.href = "orientacion.html";
};

window.regresarMenu = function () {
  window.location.href = "../index.html";
};
