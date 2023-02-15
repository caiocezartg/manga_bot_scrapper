import { logCommand } from "./commands/logCommand.js";
import { tenPopularMangasCommand } from "./commands/tenPopularMangasCommand.js";
import { bot } from "./lib/bot.js";

bot.on("message", (msg) => logCommand(msg));

bot.onText(/\/popular/, async (msg) => await tenPopularMangasCommand(msg));
