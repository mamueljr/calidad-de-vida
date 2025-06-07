// autodeterminacion.js

const preguntas = [
  {
    texto: "1. Utilizo el transporte público (autobús, taxi) por mí mismo/a (sin supervisión).",
    valores: [4, 3, 2, 1]
  },
  {
    texto: "2. Decido quién entra a mis espacios de intimidad (mi habitación, mi baño, etc.).",
    valores: [4, 3, 2, 1]
  },
  {
    texto: "3. Participo en las decisiones que se toman en mi casa.",
    valores: [4, 3, 2, 1]
  },
  {
    texto: "4. Elijo la ropa que me compro.",
    valores: [4, 3, 2, 1]
  },
  {
    texto: "5. Otra persona decide la ropa que me pongo cada día.",
    valores: [1, 2, 3, 4]
  },
  {
    texto: "6. Otra persona elige las actividades que hago en mi tiempo libre.",
    valores: [1, 2, 3, 4]
  },
  {
    texto: "7. Valoro las posibles consecuencias antes de tomar una decisión.",
    valores: [4, 3, 2, 1]
  },
  {
    texto: "8. Hago planes para llevar a cabo los proyectos que me interesan.",
    valores: [4, 3, 2, 1]
  },
  {
    texto: "9. Expreso mis preferencias cuando me permiten elegir.",
    valores: [4, 3, 2, 1]
  }
];

const opcionesTexto = ["Nunca", "Algunas veces", "Frecuentemente", "Siempre"];
const form = document.getElementById("form-autodeterminacion");

preguntas.forEach((pregunta, i) => {
  const div = document.createElement("div");
  div.className = "pregunta";
  div.innerHTML = `
    <p>${pregunta.texto}</p>
    <div class="opciones-items">
      ${opcionesTexto.map((txt, idx) => `
        <button type="button" class="btn-item" data-pregunta="p${i+1}" data-valor="${pregunta.valores[idx]}">${txt}</button>
      `).join("")}
    </div>
    <input type="hidden" name="p${i+1}" id="p${i+1}" />
  `;
  form.appendChild(div);
});

// Manejo de seleccion visual y logica
form.addEventListener("click", e => {
  if (e.target.classList.contains("btn-item")) {
    const pregunta = e.target.dataset.pregunta;
    const valor = e.target.dataset.valor;

    document.getElementById(pregunta).value = valor;

    const grupo = e.target.parentElement.querySelectorAll(".btn-item");
    grupo.forEach(btn => btn.classList.remove("selected"));
    e.target.classList.add("selected");
  }
});

// Guardado en localStorage
window.guardarAutodeterminacion = function () {
  const respuestas = {};
  let incompletas = false;

  preguntas.forEach((_, i) => {
    const valor = document.getElementById(`p${i + 1}`).value;
    if (!valor) incompletas = true;
    respuestas[`p${i + 1}`] = valor;
  });

  if (incompletas) {
    alert("Por favor responde todas las preguntas.");
    return;
  }

  const registros = JSON.parse(localStorage.getItem("encuestados") || "[]");
  let encuestado = null;

  for (let i = registros.length - 1; i >= 0; i--) {
    if (!registros[i].evaluacion) registros[i].evaluacion = {};
    if (!registros[i].evaluacion.autodeterminacion) {
      registros[i].evaluacion.autodeterminacion = respuestas;
      encuestado = registros[i];
      break;
    }
  }

  localStorage.setItem("encuestados", JSON.stringify(registros));
  alert("Respuestas guardadas correctamente. Se descargará una copia CSV.");

  // Generar CSV
  if (encuestado) {
    const fila = {
      id: encuestado.id || "",
      nombre: encuestado.nombre || "",
      fecha: encuestado.fecha || "",
      ...respuestas
    };

    const encabezados = Object.keys(fila);
    const valores = Object.values(fila).map(v => `"${v}"`);
    const csvContent = [encabezados.join(","), valores.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `autodeterminacion_${fila.id || "respaldo"}.csv`;
    link.click();
  }
};
