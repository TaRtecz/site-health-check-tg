import { Telegraf } from "telegraf";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

export async function sendUpMessage(site) {
  await bot.telegram.sendMessage(
    TELEGRAM_CHAT_ID,
    `✅ Сайт снова доступен: ${site.name} (${site.url})`,
    { disable_notification: true }
  );
}

export async function sendDownMessage(site) {
  await bot.telegram.sendMessage(
    TELEGRAM_CHAT_ID,
    `❌ Сайт недоступен: ${site.name} (${site.url})`,
    { disable_notification: true }
  );
} 