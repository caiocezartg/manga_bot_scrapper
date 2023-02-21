import { popularMangasController } from "../controllers/popularMangasController.js";
import { bot } from "../lib/bot.js";

export async function popularMangasCommand(message) {
  const arrayPopularMangas = await popularMangasController();
  let botMessageOfArrayPopularMangas =
    "🌟 <b>Top 10 Mangás Mais Lidos</b> 🌟 \n\n\n";

  if (arrayPopularMangas.error) {
    bot.sendMessage(
      message.chat.id,
      "Não foi possível obter o top 10 mangás mais lidos, tente novamente mais tarde."
    );
  }

  arrayPopularMangas.forEach((manga, index) => {
    botMessageOfArrayPopularMangas += `<b>#${index + 1}</b> ${
      manga.manga_name
    }: ${manga.manga_link} \n`;
  });

  bot.sendMessage(message.chat.id, botMessageOfArrayPopularMangas, {
    parse_mode: "HTML",
  });
}
