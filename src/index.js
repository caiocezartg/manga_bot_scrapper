import { logCommand } from "./commands/logCommand.js";
import { searchMangaCommand } from "./commands/searchMangaCommand.js";
import { popularMangasCommand } from "./commands/popularMangasCommand.js";
import { bot } from "./lib/bot.js";

bot.on("message", (msg) => logCommand(msg));

bot.onText(/\/popular/, async (msg) => await popularMangasCommand(msg));

bot.onText(
  /\/manga (.+)/,
  async (msg, match) => await searchMangaCommand(msg, match[1])
);
