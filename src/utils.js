import fs from "node:fs/promises";
import path from "node:path";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function ensureDir(dir) {
  await fs.mkdir(dir, {
    recursive: true,
  });
}

export async function cleanupDir(dir, logger) {
  try {
    await ensureDir(dir);

    const entries = await fs.readdir(dir);

    await Promise.all(
      entries.map((entry) =>
        fs.rm(path.join(dir, entry), {
          recursive: true,
          force: true,
        }),
      ),
    );

    logger.info(
      {
        count: entries.length,
      },
      "temporary files cleaned",
    );
  } catch (error) {
    logger.warn(
      {
        err: error,
      },
      "temporary cleanup failed",
    );
  }
}

export function safeFilename(filename, fallback = "media") {
  const cleaned = String(filename || fallback)
    .replace(/[^a-z0-9._-]/gi, "_")
    .slice(0, 100);

  return cleaned || fallback;
}

export function formatRemaining(seconds) {
  return Math.max(1, Math.ceil(seconds));
}

export function maskedUrl(raw) {
  try {
    const url = new URL(raw);

    for (const key of url.searchParams.keys()) {
      url.searchParams.set(key, "[redacted]");
    }

    return url.toString();
  } catch {
    return "[invalid-url]";
  }
}

export function isUrlForCommand(command, raw) {
  try {
    if (typeof raw !== "string" || !raw.trim()) {
      return false;
    }

    const url = new URL(raw.trim());

    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }

    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (command === "tiktok") {
      return host === "tiktok.com" || host.endsWith(".tiktok.com");
    }

    if (command === "ytmp3" || command === "ytmp4") {
      return (
        host === "youtube.com" ||
        host.endsWith(".youtube.com") ||
        host === "youtu.be"
      );
    }

    return false;
  } catch {
    return false;
  }
}

export const MENU = `╭━━━〔 ✦ Y O R O Z U ✦ 〕━━━╮
┃  MEDIA • STICKER • UTILITY
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

╭─〔 📥 DOWNLOAD MEDIA 〕
│ 🎵 /tiktok <url>
│ 🎧 /ytmp3 <url>
│ 🎬 /ytmp4 <url>
╰────────────────────────

╭─〔 🎨 STICKER 〕
│ 🖼️ /sticker
│ 🖼️ /s  •  /stiker
│ ✍️ /createsticker <teks>
╰────────────────────────

╭─〔 ⚙️ SYSTEM 〕
│ ▫️ /menu
│ ▫️ /help
│ ▫️ /ping
╰────────────────────────

Ketik */help* untuk panduan lengkap.
— *YOROZU BOT* —`;

export const HELP = `╭━━━〔 ✦ PANDUAN YOROZU ✦ 〕━━━╮
┃  Pilih command sesuai kebutuhanmu
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭─〔 📥 DOWNLOAD MEDIA 〕
│ 🎵 */tiktok <url>*
│    Unduh video atau foto TikTok.
│
│ 🎧 */ytmp3 <url>*
│    Unduh audio dari YouTube.
│
│ 🎬 */ytmp4 <url>*
│    Unduh video dari YouTube.
╰────────────────────────────

╭─〔 🎨 BUAT STICKER 〕
│ 🖼️ */sticker*  •  */s*  •  */stiker*
│    Reply atau kirim gambar/GIF/video.
│    Video maksimal 10 detik.
│
│ ✍️ */createsticker <teks>*
│    Buat sticker teks bergaya meme.
╰────────────────────────────

╭─〔 ⚙️ SYSTEM 〕
│ ▫️ */menu*  — Lihat semua command.
│ ▫️ */ping*  — Cek status dan latency.
│ ▫️ */help*  — Buka panduan ini.
╰────────────────────────────

💡 Gunakan link publik agar media dapat diproses.
— *YOROZU BOT* —`;

export const commands = new Map([
  ["menu", { kind: "system" }],
  ["help", { kind: "system" }],
  ["ping", { kind: "system" }],

  ["tiktok", { kind: "download" }],
  ["ytmp3", { kind: "download" }],
  ["ytmp4", { kind: "download" }],

  ["sticker", { kind: "sticker" }],
  ["s", { kind: "sticker" }],
  ["stiker", { kind: "sticker" }],
]);

export function parseCommand(text) {
  const trimmed = String(text || "").trim();

  if (!trimmed.startsWith("/")) {
    return null;
  }

  const [rawCommand, ...args] = trimmed.split(/\s+/);

  return {
    command: rawCommand.slice(1).toLowerCase(),

    args,

    raw: trimmed,
  };
}
