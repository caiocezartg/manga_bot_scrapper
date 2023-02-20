import { getChaptersController } from "../controllers/getChaptersController.js";
import { mangaController } from "../controllers/mangaController.js";
import { bot } from "../lib/bot.js";
import { transformScore } from "../utils/transformScore.js";

export async function mangaCommand(message, name) {
  let chatId = message.chat.id;
  let messageId = message.message_id;
  const manga = await mangaController(name);

  if (manga.error) {
    return bot.sendMessage(chatId, manga.error);
  }

  const options = {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "📖 Leia os capítulos", callback_data: "first_page" }],
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

  bot.removeListener("callback_query");

  bot.on("callback_query", async (callbackQuery) => {
    const action = callbackQuery.data;
    let setupInlineKeyboard = {};

    if (action === "first_page") {
      chaptersPage = 1;
    }

    if (action === "next_page") {
      chaptersPage++;
    }

    if (action === "previous_page") {
      chaptersPage === 1 ? chaptersPage : chaptersPage--;
    }

    setupInlineKeyboard = await inlineKeyboardChapters(
      manga.id_serie,
      messageId,
      chaptersPage
    );

    bot.sendMessage(chatId, "Selecione um capitulo", setupInlineKeyboard);
  });
}

let chaptersPage = 1;

async function inlineKeyboardChapters(id_serie, message_id, page) {
  let idReleaseManga = id_serie;
  let arrayChaptersManga = [];

  arrayChaptersManga = await getChaptersController(idReleaseManga, page);

  let buttonsChaptersManga = arrayChaptersManga.map((chapter) => {
    return [
      {
        text: `#${chapter.number} - ${chapter.chapter_name}`,
        callback_data: "1",
      },
    ];
  });

  buttonsChaptersManga.push([
    { text: "Página anterior", callback_data: "previous_page" },
    { text: "Próxima página", callback_data: "next_page" },
  ]);

  let optionsChapters = {
    reply_markup: JSON.stringify({
      inline_keyboard: buttonsChaptersManga,
    }),
  };

  return optionsChapters;
}
