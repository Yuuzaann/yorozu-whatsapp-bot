import "dotenv/config";

const number = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
};

export const config = {
  botName: process.env.BOT_NAME || "YOROZU",
  maxConcurrentJobs: Math.max(1, number("MAX_CONCURRENT_JOBS", 2)),
  requestTimeout: number("REQUEST_TIMEOUT", 30_000),
  stickerMaxDuration: number("STICKER_MAX_DURATION", 10),
  stickerMaxSizeBytes: number("STICKER_MAX_SIZE_MB", 10) * 1024 * 1024,
  textStickerMaxLength: Math.max(1, number("TEXT_STICKER_MAX_LENGTH", 120)),
  globalCooldown: number("GLOBAL_COOLDOWN", 3),
  tempDir: process.env.TEMP_DIR || "./temp",
  authDir: process.env.AUTH_DIR || "./auth",
  downloaderApiUrl: process.env.DOWNLOADER_API_URL || "",
  downloaderApiKey: process.env.DOWNLOADER_API_KEY || "",
  downloaderMaxSizeBytes: number("DOWNLOADER_MAX_SIZE_MB", 50) * 1024 * 1024,
};

export const commandCooldowns = {
  tiktok: 15, ytmp3: 20, ytmp4: 20,
  sticker: 10, s: 10, stiker: 10, createsticker: 5, menu: 3, help: 3, ping: 3,
};

export const heavyCommands = new Set(["tiktok", "ytmp3", "ytmp4", "sticker", "s", "stiker", "createsticker"]);