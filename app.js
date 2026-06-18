const API_URL = "https://api.argentinadatos.com/v1/presidentes";

const loader         = document.getElementById("loader");
const errorMsg       = document.getElementById("error-msg");
const cardsContainer = document.getElementById("cards-container");

function valor(v) {
  return v ? v : "Dato no disponible";
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return "Dato no disponible";
  const [anio, mes, dia] = fechaISO.split("-");
  const meses = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"
  ];
  return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${anio}`;
}

async function obtenerPresidentes() {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) {
    throw new Error(`Error HTTP: ${respuesta.status}`);
  }
  return await respuesta.json();
}

function crearCard(presidente) {
  const col = document.createElement("div");
  col.className = "col";

  const imagenURL = presidente.imagen || "https://via.placeholder.com/300x300?text=Sin+imagen";

  col.innerHTML = `
    <div class="card pres-card h-100">
      <div class="card-front">
        <div class="pres-img-wrap">
          <img
            src="${imagenURL}"
            alt="Foto de ${valor(presidente.nombre)}"
            class="pres-img"
            onerror="this.src='https://via.placeholder.com/300x300?text=Sin+imagen'"
          />
        </div>
        <div class="card-body text-center">
          <h5 class="card-title pres-nombre">${valor(presidente.nombre)}</h5>
          <p class="hint-text">Hacé clic para más info</p>
        </div>
      </div>
      <div class="card-back">
        <div class="card-body">
          <h5 class="card-title pres-nombre-back">${valor(presidente.nombre)}</h5>
          <ul class="datos-lista">
            <li><span class="dato-label">Inicio mandato:</span> ${formatearFecha(presidente.inicio)}</li>
            <li><span class="dato-label">Fin mandato:</span> ${formatearFecha(presidente.fin)}</li>
            <li><span class="dato-label">Vicepresidente:</span> ${valor(presidente.vicepresidente)}</li>
            <li><span class="dato-label">Partido:</span> ${valor(presidente.partido)}</li>
            <li><span class="dato-label">Período:</span> ${valor(presidente.periodoPresidencial)}</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  const card = col.querySelector(".pres-card");
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

  return col;
}

function renderizarPresidentes(presidentes) {
  cardsContainer.innerHTML = "";
  presidentes.forEach(p => {
    cardsContainer.appendChild(crearCard(p));
  });
}

function animarEntrada() {
  document.querySelectorAll(".col").forEach((col, i) => {
    col.style.opacity = "0";
    col.style.transform = "translateY(24px)";
    col.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`;
    col.getBoundingClientRect();
    col.style.opacity = "1";
    col.style.transform = "translateY(0)";
  });
}

async function init() {
  try {
    const presidentes = await obtenerPresidentes();
    renderizarPresidentes(presidentes);
    animarEntrada();
    loader.classList.add("d-none");
    cardsContainer.classList.remove("d-none");
  } catch (error) {
    console.error("Error al obtener los presidentes:", error);
    loader.classList.add("d-none");
    errorMsg.classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", init);

