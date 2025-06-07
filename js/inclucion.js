import { guardarRespuestas, finalizarEncuestado, cargarDatosGuardados } from './datos.js';

cargarDatosGuardados();

const preguntas = [
  {
    texto: "Participo en conversaciones con otras personas sobre temas interesantes",
    valores: { "Nunca": 1, "Algunas veces": 2, "Frecuentemente": 3, "Siempre": 4 }
  },
  {
    texto: "Acudo sin problemas a lugares de mi comunidad (e.g., bares, tiendas, piscinas, etc.)",
    valores: { "Nunca": 1, "Algunas veces": 2, "Frecuentemente": 3, "Siempre": 4 }
  },
  {
    texto: "Tengo amigos/as que no tienen ninguna discapacidad",
    valores: { "Nunca": 1, "Algunas veces": 2, "Frecuentemente": 3, "Siempre": 4 }
  },
  {
    texto: "Me siento excluido en mi grupo de trabajo, de ocio o de amigos/as",
    valores: { "Nunca": 4, "Algunas veces": 3, "Frecuentemente": 2, "Siempre": 1 }
  },
  {
    texto: "Me resulta difícil realizar actividades con personas sin discapacidad",
    valores: { "Nunca": 4, "Algunas veces": 3, "Frecuentemente": 2, "Siempre": 1 }
  },
  {
    texto: "Recibo los apoyos que necesito para hacer bien mi trabajo",
    valores: { "Nunca": 1, "Algunas veces": 2, "Frecuentemente": 3, "Siempre": 4 }
  },
  {
    texto: "Hay pocas personas dispuestas a ayudarme cuando lo necesito",
    valores: { "Nunca": 4, "Algunas veces": 3, "Frecuentemente": 2, "Siempre": 1 }
  },
  {
    texto: "Cuando hago las cosas bien, me lo dicen",
    valores: { "Nunca": 1, "Algunas veces": 2, "Frecuentemente": 3, "Siempre": 4 }
  },
  {
    texto: "Las personas que me rodean tienen una imagen negativa de mí",
    valores: { "Nunca": 4, "Algunas veces": 3, "Frecuentemente": 2, "Siempre": 1 }
  }
];

const opciones = ["Nunca", "Algunas veces", "Frecuentemente", "Siempre"];
const form = document.getElementById("form-inclusion");

preguntas.forEach((pregunta, index) => {
  const div = document.createElement("div");
  div.classList.add("pregunta");

  const p = document.createElement("p");
  p.textContent = `${index + 28}. ${pregunta.texto}`;
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

window.guardarInclusion = function () {
  const respuestas = [];

  document.querySelectorAll(".opciones").forEach((grupo, i) => {
    const seleccionado = grupo.querySelector("button.activo");
    if (!seleccionado) {
      alert(`Falta responder la pregunta ${i + 28}`);
      return;
    }
    respuestas.push(seleccionado.dataset.valor);
  });

  guardarRespuestas("inclusion", respuestas);
  alert("✅ Respuestas de inclusión guardadas correctamente.");
};

window.finalizarEncuesta = function () {
  if (confirm("¿Deseas finalizar esta encuesta? Se guardará como completa.")) {
    finalizarEncuestado();
    window.location.href = "../index.html";
  }
};
