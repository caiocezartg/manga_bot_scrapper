import { api } from "../lib/axios.js";
import { parseManga } from "../utils/parseManga.js";

export class getTopMangasController {
  constructor(pageTopMangas) {
    this.pageTopMangas = pageTopMangas;
  }

  async execute() {
    return (async () => {
      try {
        let response = await api(
          "series/index/numero-de-leituras/todos/desde-o-comeco?page=" +
            this.pageTopMangas
        );

        return {
          mangas: parseManga(response.data),
        };
      } catch (error) {
        console.error(error.message);
      }
    })();
  }
}
