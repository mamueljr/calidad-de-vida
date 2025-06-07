// Mostrar preguntas como botones seleccionables
const preguntas = [
  "EGO1: Soy el único(a) que puede hacer las cosas correctamente.",
  "TASK1: Aprendo a hacer cosas nuevas.",
  "EGO2: Soy mejor que mis amigos(as).",
  "TASK2: Aprendo algo que es divertido.",
  "EGO3: Los demás se equivocan, pero yo no.",
  "TASK3: Aprendo una nueva habilidad al trabajar duro.",
  "TASK4: Trabajo muy duro.",
  "EGO4: Anoto la mayor cantidad de puntos o goles en un juego.",
  "TASK5: Lo que aprendo me motiva a practicar más.",
  "EGO5: Soy el/la mejor.",
  "TASK6: Aprendo algo que me hace sentir bien.",
  "TASK7: Doy lo mejor de mí."
];

const form = document.getElementById("form-orientacion");

preguntas.forEach((texto, i) => {
  const div = document.createElement("div");
  div.className = "pregunta";
  div.innerHTML = `
    <p>${i + 1}. ${texto}</p>
    <div class="opciones">
      ${[1, 2, 3, 4, 5, 6].map(n => `
        <button type="button" onclick="seleccionarOpcion(${i+1}, ${n}, this)"> ${n} </button>
      `).join('')}
    </div>
    <input type="hidden" name="p${i+1}" id="p${i+1}" />
  `;
  form.appendChild(div);
});

window.seleccionarOpcion = function (pregunta, valor, btn) {
  document.getElementById(`p${pregunta}`).value = valor;
  // desactivar selección previa
  const botones = btn.parentElement.querySelectorAll("button");
  botones.forEach(b => b.classList.remove("activo"));
  btn.classList.add("activo");
};

window.cerrarPopupOrientacion = function () {
  document.getElementById("popup-orientacion").style.display = "none";
  document.getElementById("contenido-orientacion").style.display = "block";
};

window.mostrarPopupCaras = function () {
  document.getElementById("popupCaras").style.display = "flex";
};

window.cerrarPopupCaras = function () {
  document.getElementById("popupCaras").style.display = "none";
};

window.exportarOrientacion = function () {
  const datos = {};
  let incompletas = false;

  preguntas.forEach((_, i) => {
    const valor = document.getElementById(`p${i + 1}`).value;
    if (valor) {
      datos[`p${i + 1}`] = valor;
    } else {
      incompletas = true;
    }
  });

  if (incompletas) {
    alert("Por favor responde todas las preguntas antes de exportar.");
    return;
  }

  const registros = JSON.parse(localStorage.getItem("encuestados") || "[]");

  let encuestado = null;
  for (let i = registros.length - 1; i >= 0; i--) {
    if (!registros[i].orientacion) {
      registros[i].orientacion = datos;
      encuestado = registros[i];
      break;
    }
  }

  if (!encuestado) {
    alert("No se encontró un encuestado para asociar este cuestionario.");
    return;
  }

  localStorage.setItem("encuestados", JSON.stringify(registros));
  alert("Cuestionario guardado correctamente. Generando CSV...");

  // Generar y descargar CSV
  const fila = {
    id: encuestado.id || "",
    nombre: encuestado.nombre || "",
    fecha: encuestado.fecha || "",
    sexo: encuestado.sexo || "",
    procedencia: encuestado.procedencia || "",
    ...datos
  };

  const encabezados = Object.keys(fila);
  const valores = Object.values(fila).map(v => `"${v}"`);
  const csvContent = [encabezados.join(","), valores.join(",")].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fila.id || "orientacion"}.csv`;
  link.click();
};

