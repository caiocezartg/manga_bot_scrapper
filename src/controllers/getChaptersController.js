import { api } from "../lib/axios.js";

export async function getChaptersController(manga_id, page) {
  let chapters = [];

  try {
    const response = await api.get(
      `https://mangalivre.net/series/chapters_list.json?page=${page}&id_serie=${manga_id}`
    );

    let chaptersResponse = response.data.chapters;

    if (chaptersResponse) {
      chaptersResponse.map((chapter) => {
        chapters.push({
          chapter_name: chapter.chapter_name,
          number: chapter.number,
          date: chapter.date,
          id_release:
            chapter.releases[Object.keys(chapter.releases)[0]].id_release,
        });
      });
    }

    return chapters;
  } catch (error) {
    console.log(error);
  }
}
