import { api } from "../lib/axios.js";
import puppeteer from "puppeteer";

export async function mangaController(name) {
  let manga = {};

  try {
    const response = await api.post(
      "https://mangalivre.net/lib/search/series.json",
      new URLSearchParams({
        search: name,
      })
    );

    const mangaDetails = response.data.series[0];

    if (!mangaDetails) {
      return {
        error: "Não foi possível encontrar o(s) mangá(s)",
      };
    }

    manga.id_serie = mangaDetails.id_serie;
    manga.name = mangaDetails.name;
    manga.score = mangaDetails.score;
    manga.author = mangaDetails.author;
    manga.artist = mangaDetails.artist;
    manga.categories = mangaDetails.categories.map((category) => category.name);
    manga.poster = mangaDetails.cover;
    manga.link = `https://mangalivre.net${mangaDetails.link}`;
    manga.description = await scrap(mangaDetails.id_serie, "description");
    manga.chapters_count = await scrap(mangaDetails.id_serie, "count");
  } catch (error) {
    return {
      error: "Não foi possível executar este comando.",
    };
  }
  return manga;
}

async function scrap(manga_id, info) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://mangalivre.net/manga/null/" + manga_id);

  const manga_description = await page.$eval(
    "#series-data > div.series-info.touchcarousel > span.series-desc > span",
    (element) => element.textContent
  );

  const manga_chapters_count = await page.$eval(
    "#chapter-list > div.container-box.default.color-brown > h2 > span",
    (element) => element.textContent
  );
  await browser.close();

  if (info === "description") {
    return manga_description;
  }

  if (info === "count") {
    return manga_chapters_count;
  }
}
