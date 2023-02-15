import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
dotenv.config();

const token = process.env.BOT_TELEGRAM_TOKEN;
export const bot = new TelegramBot(token, { polling: true });
