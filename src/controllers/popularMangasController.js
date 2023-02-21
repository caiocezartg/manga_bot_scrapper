import { api } from "../lib/axios.js";

export async function popularMangasController() {
  let arrayTenPopularMangas = [];

  try {
    const [{ data: firstPopularMangas }, { data: secondPopularMangas }] =
      await Promise.all([
        api.get("home/most_read?page=1"),
        api.get("home/most_read?page=2"),
      ]);

    firstPopularMangas.most_read.forEach((manga) => {
      arrayTenPopularMangas.push({
        manga_id: manga.id_serie,
        manga_name: manga.serie_name,
        manga_link: `https://mangalivre.net${manga.link}`,
      });
    });

    secondPopularMangas.most_read.forEach((manga) => {
      arrayTenPopularMangas.push({
        manga_id: manga.id_serie,
        manga_name: manga.serie_name,
        manga_link: `https://mangalivre.net${manga.link}`,
      });
    });

    return arrayTenPopularMangas;
  } catch (error) {
    return error;
  }
}
