import { api } from "../lib/axios.js";
import puppeteer from "puppeteer";

export async function searchMangaController(name) {
  let mangas = [];

  try {
    const response = await api.post(
      "https://mangalivre.net/lib/search/series.json",
      new URLSearchParams({
        search: name,
      })
    );

    const arrayMangas = response.data.series;

    if (!arrayMangas) {
      return {
        error: "Não foi possível encontrar o(s) mangá(s)",
      };
    }

    mangas = await Promise.all(
      arrayMangas.map(async (manga) => {
        return {
          id_serie: manga.id_serie,
          name: manga.name,
          score: manga.score,
          author: manga.author,
          artist: manga.artist,
          categories: manga.categories.map((category) => category.name),
          poster: manga.cover,
          link: `https://mangalivre.net${manga.link}`,
          description: await scrap(manga.id_serie, "description"),
          chapters_count: await scrap(manga.id_serie, "count"),
        };
      })
    );
  } catch (error) {
    return {
      error: "Não foi possível executar este comando.",
    };
  }

  return mangas;
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
