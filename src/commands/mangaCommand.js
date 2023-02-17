import { mangaController } from "../controllers/mangaController.js";
import { bot } from "../lib/bot.js";
import { transformScore } from "../utils/transformScore.js";

export async function mangaCommand(message, name) {
  const chatId = message.chat.id;
  const mangas = await mangaController(name);

  if (mangas.error) {
    return bot.sendMessage(chatId, mangas.error);
  }

  const options = {
    reply_to_message_id: message.message_id,
    reply_markup: JSON.stringify({
      inline_keyboard: mangas.map((manga, index) => [
        {
          text: manga.name,
          callback_data: index,
        },
      ]),
    }),
  };

  bot.sendMessage(chatId, "Selecione um mangá", options);

  bot.on("callback_query", (callbackQuery) => {
    const index = Number(callbackQuery.data);

    bot.sendPhoto(chatId, mangas[index].poster);
    bot.sendMessage(
      chatId,
      `<b>Nome:</b> ${mangas[index].name} \n` +
        `<b>Autor:</b> ${mangas[index].author} \n` +
        `<b>Categorias:</b> ${mangas[index].categories} \n` +
        `<b>Descrição:</b> ${mangas[index].description} \n` +
        `<b>Artista:</b> ${mangas[index].artist} \n` +
        `<b>Número de Capítulos:</b> ${mangas[index].chapters_count} \n` +
        `<b>Nota:</b> ${transformScore(mangas[index].score)} \n` +
        `<b>Link para o website:</b> ${mangas[index].link}`,
      { parse_mode: "HTML" }
    );
  });
}
