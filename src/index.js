import { logCommand } from "./commands/logCommand.js";
import { mangaCommand } from "./commands/mangaCommand.js";
import { popularMangasCommand } from "./commands/popularMangasCommand.js";
import { bot } from "./lib/bot.js";

bot.on("message", (msg) => logCommand(msg));

bot.onText(/\/popular/, async (msg) => await popularMangasCommand(msg));

bot.onText(
  /\/manga (.+)/,
  async (msg, match) => await mangaCommand(msg, match[1])
);
