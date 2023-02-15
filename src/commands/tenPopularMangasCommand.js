import { tenPopularMangasController } from "../controllers/tenPopularMangasController.js";
import { bot } from "../lib/bot.js";

export async function tenPopularMangasCommand(message) {
  const popularMangasController = new tenPopularMangasController();
  const arrayTenPopularMangas = await popularMangasController.execute();
  let botMessageOfArrayPopularMangas =
    "🌟 <b>Top 10 Mangás Mais Lidos</b> 🌟 \n\n\n";

  if (!arrayTenPopularMangas) {
    bot.sendMessage(
      message.chat.id,
      "Não foi possível obter o top 10 mangás mais lidos, tente novamente mais tarde."
    );
  }

  arrayTenPopularMangas.forEach((manga, index) => {
    botMessageOfArrayPopularMangas += `<b>#${index + 1}</b> ${
      manga.manga_name
    }: ${manga.manga_link} \n`;
  });

  bot.sendMessage(message.chat.id, botMessageOfArrayPopularMangas, {
    parse_mode: "HTML",
  });
}
