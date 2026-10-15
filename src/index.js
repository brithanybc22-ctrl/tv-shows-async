import { getShowData, getEpisodeList } from "./services/tvmaze.js";

const ID = "2993"; // ID de la serie de ejemplo

const $header = document.querySelector("header");
const $episodes = document.querySelector(".episodes");

const show = await getShowData(ID);
const seasons = await getEpisodeList(ID);

$header.setHTMLUnsafe(`
  <img class="poster" src="${show.image}" alt="${show.name}">
  <div>
    <h1>${show.name}</h1>
    <p>Valoración global de la serie</p>
  </div>
`);

const createEpisodeHTML = (episode) => {
  return `<div class="episode rating-${episode.rating}" title="Episodio ${episode.number}">${episode.number}</div>`;
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