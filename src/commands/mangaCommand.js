import { mangaController } from "../controllers/mangaController.js";
import { bot } from "../lib/bot.js";
import { transformScore } from "../utils/transformScore.js";

export async function mangaCommand(message, name) {
  const chatId = message.chat.id;
  let manga = await mangaController(name);

  if (manga.error) {
    return bot.sendMessage(chatId, manga.error);
  }

  const options = {
    reply_to_message_id: message.message_id,
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "📖 Leia os capítulos", callback_data: manga.id_serie }],
      ],
    }),
  };

  bot.sendPhoto(chatId, manga.poster);

  bot.sendMessage(
    chatId,
    `<b>Nome:</b> ${manga.name} \n` +
      `<b>Autor:</b> ${manga.author} \n` +
      `<b>Artista:</b> ${manga.artist} \n` +
      `<b>Categorias:</b> ${manga.categories} \n` +
      `<b>Descrição:</b> ${manga.description} \n` +
      `<b>Número de Capítulos:</b> ${manga.chapters_count} \n` +
      `<b>Nota:</b> ${transformScore(manga.score)} \n` +
      `<b>Link do mangá:</b> ${manga.link} \n`,
    options
  );

  bot.on("callback_query", (callbackQuery) => {
    console.log(callbackQuery);
  });
}
