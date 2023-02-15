export function parseManga(html) {
  let mangas = [];
  html = html.replace(/(\r\n|\n|\r)/gm, "");

  let listManga = html.match(
    new RegExp('<li> *<a href="/manga/.*?</div> *</a> *</li>', "gm")
  );

  for (let li of listManga) {
    let manga = {};

    manga.name = li.match(/(?<=series-title......).*?(?=<\/h1>)/gm)[0].trim();
    manga.author = li
      .match(/(?<=<span class="series-author">).*?(?=<\/span>)/gm)[0]
      .trim()
      .replace(/\<i.*<\/i>/gm, "")
      .replace(/(\ \ )*/gm, "")
      .replace(/&/, " & ");
    manga.description = li
      .match(/(?<=<span class="series-desc">).*?(?=<\/span>)/gm)[0]
      .trim()
      .replace(/<(\/|)(br|a|b|span)(\/|)>/gm, "")
      .replace(/&nbsp;/gm, " ");
    manga.link = li.match(/(?<=\<a href=\").*?(?=" )/gm)[0].trim();
    manga.id = manga.link.replace(/.*\//gm, "");
    manga.chapters_count = li
      .match(/(?<=number of chapters">).*?(?=<\/span>)/gm)[0]
      .trim();
    manga.image = li
      .match(/(?<=background-image: url\(\').*?(?=\')/gm)[0]
      .trim();
    manga.score = li.match(/(?<=class="nota">)....(?=<\/span>)/gm)[0].trim();

    let categories = li.match(
      /(?<="touch-carousel-item.*<span class="nota">).*?(?=<\/span>)/gm
    );
    if (categories) {
      manga.categories = categories.map((genre) => {
        return genre;
      });
    }
    mangas.push(manga);
  }
  return mangas;
}
