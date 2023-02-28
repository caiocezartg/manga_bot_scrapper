import { getChapterPagesController } from "../controllers/getChapterPagesController.js";
import { getChaptersController } from "../controllers/getChaptersController.js";
import { searchMangaController } from "../controllers/searchMangaController.js";
import { bot } from "../lib/bot.js";
import { transformScore } from "../utils/transformScore.js";
import PDFDocument from "pdfkit";
import fs from "fs";

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
          callback_data: `get_manga_details ${index}`,
        },
      ]),
    }),
  };

  bot.sendMessage(chatId, "Selecione um mangá", options);

  bot.removeListener("callback_query");

  bot.on("callback_query", async (query) => {
    const action = query.data;

    console.log(query.data);

    if (action.startsWith("get_manga_details")) {
      indexMangaSelected = action.split(" ")[1];

      bot.sendPhoto(chatId, mangas[indexMangaSelected].poster);
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

    if (action === "first_page") {
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

    if (action === "next_page") {
      chaptersPage++;
      changePageChapters(mangas[indexMangaSelected].id_serie, query);
    }

    if (action === "previous_page" && chaptersPage > 1) {
      chaptersPage--;
      changePageChapters(mangas[indexMangaSelected].id_serie, query);
    }

    if (action.startsWith("get_pages")) {
      const chapterIdRelease = query.data.split(" ")[1];
      // let stream = await getChapterPagesController(chapterIdRelease);

      const doc = new PDFDocument();
      doc.text("Este é um PDF simples criado com pdfkit");
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        let pdfData = Buffer.concat(buffers);
        console.log(pdfData);
        bot.sendDocument(chatId, pdfData);
      });

      // arrayChapterPages.forEach((page) => {
      //   let photoUrl = page.image_url;
      //   bot.sendPhoto(chatId, photoUrl, { caption: page.index });
      // });
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
        callback_data: `get_pages ${chapter.id_release}`,
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
