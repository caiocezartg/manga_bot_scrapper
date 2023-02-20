import { getChaptersController } from "../controllers/getChaptersController.js";
import { mangaController } from "../controllers/mangaController.js";
import { bot } from "../lib/bot.js";
import { transformScore } from "../utils/transformScore.js";

let chaptersPage = 1;

export async function mangaCommand(message, name) {
  const chatId = message.chat.id;
  const messageId = message.message_id;
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

  bot.on("callback_query", async (query) => {
    const action = query.data;

    if (action === "first_page") {
      chaptersPage = 1;
      bot.sendMessage(chatId, "Selecione um capitulo", {
        reply_to_message_id: messageId,
        reply_markup: JSON.stringify({
          inline_keyboard: await inlineKeyboardChapters(
            manga.id_serie,
            chaptersPage
          ),
        }),
      });
    }

    if (action === "next_page") {
      chaptersPage++;
      changePageChapters(manga.id_serie, query);
    }

    if (action === "previous_page" && chaptersPage > 1) {
      chaptersPage--;
      changePageChapters(manga.id_serie, query);
    }
  });
}

async function inlineKeyboardChapters(id_serie, page) {
  const idReleaseManga = id_serie;
  let arrayChaptersManga = [];

  arrayChaptersManga = await getChaptersController(idReleaseManga, page);

  const inlineKeyboardChapters = arrayChaptersManga.map((chapter) => {
    return [
      {
        text: `#${chapter.number} - ${chapter.chapter_name || "Sem nome"} | ${
          chapter.date
        }`,
        callback_data: "chapter.id_release",
      },
    ];
  });

  inlineKeyboardChapters.push([
    { text: "Voltar página", callback_data: "previous_page" },
    { text: "Avançar página", callback_data: "next_page" },
  ]);

  return inlineKeyboardChapters;
}

async function changePageChapters(id_serie, query) {
  bot.editMessageReplyMarkup(
    {
      inline_keyboard: await inlineKeyboardChapters(id_serie, chaptersPage),
    },
    {
      chat_id: query.from.id,
      message_id: query.message.message_id,
    }
  );
}
