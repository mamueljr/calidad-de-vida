import { guardarRespuestas, cargarDatosGuardados } from './datos.js';

cargarDatosGuardados();

const preguntas = [
  {
    texto: "Tengo ganas de llorar",
    valores: { "Nunca": 4, "Algunas veces": 3, "Frecuentemente": 2, "Siempre": 1 }
  },
  {
    texto: "Me siento sin ganas de nada",
    valores: { "Nunca": 4, "Algunas veces": 3, "Frecuentemente": 2, "Siempre": 1 }
  },
  {
    texto: "Me encuentro demasiado inquieto/a o nervioso/a",
    valores: { "Nunca": 4, "Algunas veces": 3, "Frecuentemente": 2, "Siempre": 1 }
  },
  {
    texto: "Tengo problemas de comportamiento",
    valores: { "Nunca": 4, "Algunas veces": 3, "Frecuentemente": 2, "Siempre": 1 }
  },
  {
    texto: "Me siento seguro/a de mí mismo/a",
    valores: { "Nunca": 1, "Algunas veces": 2, "Frecuentemente": 3, "Siempre": 4 }
  },
  {
    texto: "Me siento bien cuando pienso en lo que puedo hacer en el futuro",
    valores: { "Nunca": 1, "Algunas veces": 2, "Frecuentemente": 3, "Siempre": 4 }
  },
  {
    texto: "Me siento orgulloso/a de mí mismo/a",
    valores: { "Nunca": 1, "Algunas veces": 2, "Frecuentemente": 3, "Siempre": 4 }
  },
  {
    texto: "Me gustaría cambiar mi modo de vida",
    valores: { "Nunca": 4, "Algunas veces": 3, "Frecuentemente": 2, "Siempre": 1 }
  },
  {
    texto: "Disfruto con las cosas que hago",
    valores: { "Nunca": 1, "Algunas veces": 2, "Frecuentemente": 3, "Siempre": 4 }
  }
];

const opciones = ["Nunca", "Algunas veces", "Frecuentemente", "Siempre"];
const form = document.getElementById("form-bienestar");

preguntas.forEach((pregunta, index) => {
  const div = document.createElement("div");
  div.classList.add("pregunta");

  const p = document.createElement("p");
  p.textContent = `${index + 19}. ${pregunta.texto}`;
  div.appendChild(p);

  const opcionesDiv = document.createElement("div");
  opcionesDiv.classList.add("opciones");

  opciones.forEach((opcion) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = opcion;
    btn.dataset.valor = pregunta.valores[opcion];
    btn.addEventListener("click", () => {
      [...opcionesDiv.children].forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");
    });
    opcionesDiv.appendChild(btn);
  });

  div.appendChild(opcionesDiv);
  form.appendChild(div);
});

window.guardarBienestar = function () {
  const respuestas = [];

  document.querySelectorAll(".opciones").forEach((grupo, i) => {
    const seleccionado = grupo.querySelector("button.activo");
    if (!seleccionado) {
      alert(`Falta responder la pregunta ${i + 19}`);
      return;
    }
    respuestas.push(seleccionado.dataset.valor);
  });

  guardarRespuestas("bienestar", respuestas);
  alert("✅ Respuestas de bienestar guardadas correctamente.");
};
