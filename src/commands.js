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
  ["createsticker", { kind: "textSticker" }],
]);

export function parseCommand(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed.startsWith("/")) return null;
  const [rawCommand, ...args] = trimmed.split(/\s+/);
  return { command: rawCommand.slice(1).toLowerCase(), args, raw: trimmed };
}
