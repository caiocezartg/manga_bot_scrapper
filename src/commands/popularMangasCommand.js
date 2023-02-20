import { popularMangasController } from "../controllers/popularMangasController.js";
import { bot } from "../lib/bot.js";

export async function popularMangasCommand(message) {
  const popularMangas = new popularMangasController();
  const arrayTenPopularMangas = await popularMangas.execute();
  let botMessageOfArrayPopularMangas =
    "🌟 <b>Top 10 Mangás Mais Lidos</b> 🌟 \n\n\n";

  if (arrayTenPopularMangas.error) {
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
