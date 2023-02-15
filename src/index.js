import { getTopMangasController } from "./controllers/getTopMangasController.js";
import { bot } from "./lib/bot.js";

bot.onText(/\/sendpic/, (msg) => {
  bot.sendPhoto(msg.chat.id, "https://source.unsplash.com/random/300x200");
});

bot.on("message", (msg) => {
  const chatInfo = {
    user: {
      id: msg.from.id,
      name: `${msg.from.first_name} ${msg.from.last_name}`,
      username: msg.from.username,
    },
    chat: {
      id: msg.chat.id,
      message: msg.text,
      date: new Date(),
    },
  };

  console.log(chatInfo);
});

bot.onText(/\/popular (.+)/, async (msg, match) => {
  const topMangas = new getTopMangasController(match[1]);
  const listMangas = await topMangas.execute();

  let botMessage = "";

  listMangas.mangas.forEach((manga) => {
    botMessage += `${manga.name}: https://mangalivre.net${manga.link} \n`;
  });

  bot.sendMessage(msg.chat.id, botMessage);
});
