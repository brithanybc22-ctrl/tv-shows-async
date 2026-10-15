import { getShowData, getEpisodeList } from "./services/tvmaze.js";

const $header = document.querySelector("header");
const $episodes = document.querySelector(".episodes");
const $searchInput = document.querySelector("#search-input");
const $searchBtn = document.querySelector("#search-btn");
const $catalogButtons = document.querySelectorAll(".catalog-btn");

// Función principal para cargar y renderizar la serie por su nombre
const loadShowByName = async (query) => {
  try {
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
    const results = await response.json();

    if (results.length === 0) {
      $header.setHTMLUnsafe(`<p style="color: #ff6b6b;">No se encontró ninguna serie con ese nombre.</p>`);
      $episodes.setHTMLUnsafe("");
      return;
    }

    const showId = results[0].show.id;
    const show = await getShowData(showId);
    const seasons = await getEpisodeList(showId);

    $header.setHTMLUnsafe(`
      <img class="poster" src="${show.image}" alt="${show.name}">
      <div>
        <h1>${show.name}</h1>
        <p>Valoración global de la serie</p>
      </div>
    `);

    const createEpisodeHTML = (episode) => {
      return `<div class="episode rating-${episode.rating}" title="Episodio ${episode.number} (Nota: ${episode.rating})">${episode.number}</div>`;
    };

    const createSeasonHTML = (data, number) => {
      const episodesHTML = data.map(episode => createEpisodeHTML(episode)).join("");
      return `
        <article class="season">
          <div class="season-header">T${number}</div>
          ${episodesHTML}
        </article>
      `;
    };

    const list = Object.values(seasons).map((season, index) => createSeasonHTML(season, index + 1));
    $episodes.setHTMLUnsafe(list.join(""));

  } catch (error) {
    console.error("Error al buscar la serie:", error);
  }
};

// Cargar por defecto "Stranger Things" al iniciar la página
await loadShowByName("Stranger Things");

// Evento del botón de búsqueda manual
$searchBtn.addEventListener("click", () => {
  const query = $searchInput.value.trim();
  if (query) loadShowByName(query);
});

// Evento al presionar Enter en el input de búsqueda
$searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = $searchInput.value.trim();
    if (query) loadShowByName(query);
  }
});

// Eventos para los botones del catálogo rápido
$catalogButtons.forEach(button => {
  button.addEventListener("click", () => {
    const showName = button.getAttribute("data-show");
    $searchInput.value = showName; // Rellena el input opcionalmente
    loadShowByName(showName);
  });
});