import { getChaptersController } from "../controllers/getChaptersController.js";
import { searchMangaController } from "../controllers/searchMangaController.js";
import { bot } from "../lib/bot.js";
import { transformScore } from "../utils/transformScore.js";

let chaptersPage = 1;
let indexMangaSelected = 0;

export async function searchMangaCommand(message, name) {
  const chatId = message.chat.id;
  const messageId = message.message_id;
  const mangas = await searchMangaController(name);

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

  bot.removeListener("callback_query");

  bot.on("callback_query", async (query) => {
    const action = query.data;
    const arrayPossibleActions = ["first_page", "next_page", "previous_page"];

    console.log(action);

    if (!arrayPossibleActions.includes(action)) {
      indexMangaSelected = query.data;

      bot.sendPhoto(chatId, mangas[query.data].poster);
      bot.sendMessage(
        chatId,
        `<b>Nome:</b> ${mangas[indexMangaSelected].name} \n` +
          `<b>Autor:</b> ${mangas[indexMangaSelected].author} \n` +
          `<b>Categorias:</b> ${mangas[indexMangaSelected].categories} \n` +
          `<b>Descrição:</b> ${mangas[indexMangaSelected].description} \n` +
          `<b>Artista:</b> ${mangas[indexMangaSelected].artist} \n` +
          `<b>Número de Capítulos:</b> ${mangas[indexMangaSelected].chapters_count} \n` +
          `<b>Nota:</b> ${transformScore(
            mangas[indexMangaSelected].score
          )} \n` +
          `<b>Link para o website:</b> ${mangas[indexMangaSelected].link}`,
        {
          parse_mode: "HTML",
          reply_markup: JSON.stringify({
            inline_keyboard: [
              [{ text: "📖 Leia os capítulos", callback_data: "first_page" }],
            ],
          }),
        }
      );
    }

    if (action === arrayPossibleActions[0]) {
      chaptersPage = 1;
      bot.sendMessage(chatId, "Selecione um capitulo", {
        reply_to_message_id: messageId,
        reply_markup: JSON.stringify({
          inline_keyboard: await inlineKeyboardChapters(
            mangas[indexMangaSelected].id_serie,
            chaptersPage
          ),
        }),
      });
    }

    if (action === arrayPossibleActions[1]) {
      chaptersPage++;
      changePageChapters(mangas[indexMangaSelected].id_serie, query);
    }

    if (action === arrayPossibleActions[2] && chaptersPage > 1) {
      chaptersPage--;
      changePageChapters(mangas[indexMangaSelected].id_serie, query);
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
        callback_data: chapter.id_release,
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
