import { downloadMediaMessage, getContentType } from "@whiskeysockets/baileys";
import { commands, HELP, MENU, parseCommand } from "./commands.js";
import { commandCooldowns, config } from "./config.js";
import { createSticker, createTextSticker } from "./sticker.js";
import { downloadMedia } from "./downloader.js";
import { isUrlForCommand, sleep } from "./utils.js";

const PLAIN_MESSAGE = "Gunakan /menu untuk melihat tools yang tersedia\ndan /help untuk melihat panduan.";
const INVALID = "❌ Command not valid.\n\nGunakan /menu untuk melihat command yang tersedia.";
const mediaTypes = new Set(["imageMessage", "videoMessage", "documentMessage", "audioMessage"]);

function getText(message) {
  const content = message.message || {};
  const type = getContentType(content);
  if (type === "conversation") return content.conversation;
  if (type === "extendedTextMessage") return content.extendedTextMessage.text;
  if (type && content[type]?.caption) return content[type].caption;
  return "";
}

function quotedMessage(message) {
  const context = message.message?.extendedTextMessage?.contextInfo;
  if (!context?.quotedMessage) return null;
  return { key: { remoteJid: message.key.remoteJid, id: context.stanzaId, participant: context.participant }, message: context.quotedMessage };
}

function mediaMessage(message) {
  if (mediaTypes.has(getContentType(message.message || {}))) return message;
  return quotedMessage(message);
}

async function send(sock, jid, text) { await sock.sendMessage(jid, { text }); }

async function startTyping(sock, jid) {
  try {
    await sock.sendPresenceUpdate("composing", jid);
    await sleep(650 + Math.floor(Math.random() * 550));
  } catch {
    // Pembaruan status mengetik bersifat opsional; command tetap harus berjalan jika gagal.
  }
}

async function stopTyping(sock, jid) {
  try {
    await sock.sendPresenceUpdate("paused", jid);
  } catch {
    // Kegagalan memperbarui status tidak boleh mengubah command yang berhasil menjadi error.
  }
}

async function startDownloadCountdown(sock, jid) {
  const status = await sock.sendMessage(jid, { text: "📥 Mengunduh media...\n\n⏳ Selesai dalam 10 detik..." });
  let remaining = 10;
  const timer = setInterval(() => {
    remaining -= 1;
    const text = remaining > 0
      ? `📥 Mengunduh media...\n\n⏳ Selesai dalam ${remaining} detik...`
      : "📥 Mengunduh media...\n\n⏳ Masih mengunduh, mohon tunggu...";
    void sock.sendMessage(jid, { text, edit: status.key }).catch(() => {});
  }, 1000);
  return {
    finish: async (text) => {
      clearInterval(timer);
      await sock.sendMessage(jid, { text, edit: status.key }).catch(() => {});
    },
  };
}

export function createMessageHandler({ sock, limiter, logger }) {
  return async (message) => {
    if (!message.message || message.key.fromMe) return;
    const started = Date.now();
    const text = getText(message);
    const parsed = parseCommand(text);
    const jid = message.key.remoteJid;
    const sender = message.key.participant || jid;
    const rateKey = `${jid}:${sender}`;
    if (!parsed) {
      if (text.trim()) await send(sock, jid, PLAIN_MESSAGE);
      return;
    }
    const registered = commands.get(parsed.command);
    if (!registered) { await send(sock, jid, INVALID); return; }
    if (registered.kind === "download" && (!parsed.args[0] || !isUrlForCommand(parsed.command, parsed.args[0]))) {
      await send(sock, jid, `❌ URL tidak valid.\n\nContoh:\n/${parsed.command} https://...`);
      return;
    }
    const fingerprint = `${rateKey}:${parsed.command}:${parsed.args.join(" ").toLowerCase()}`;
    const check = limiter.check(rateKey, parsed.command, fingerprint);
    if (!check.ok) {
      if (check.duplicate) return send(sock, jid, "⏳ Request tersebut masih sedang diproses.");
      if (check.full) return send(sock, jid, "⏳ Server sedang memproses beberapa request.\n\nSilakan coba lagi beberapa saat.");
      return send(sock, jid, `⏳ Tunggu beberapa detik sebelum menggunakan command ini lagi.\n\nCoba lagi dalam ${check.seconds} detik.`);
    }
    const release = limiter.reserve(rateKey, parsed.command, fingerprint);
    logger.info({ command: parsed.command, sender }, "command received");
    try {
      if (parsed.command === "menu") return await send(sock, jid, MENU);
      if (parsed.command === "help") return await send(sock, jid, HELP);
      if (parsed.command === "ping") return await send(sock, jid, `🏓 Pong!\n\n⚡ Bot: Online\n⏱️ Latency: ${Date.now() - started}ms`);
      if (registered.kind === "download") return await handleDownload(sock, jid, parsed, logger);
      if (registered.kind === "textSticker") return await handleTextSticker(sock, jid, parsed, logger);
      return await handleSticker(sock, message, jid, logger);
    } catch (error) {
      logger.error({ err: error, command: parsed.command }, "command failed");
      await send(sock, jid, "❌ Gagal memproses permintaan.\n\nPastikan media/link valid dan coba lagi nanti.");
    } finally {
      release();
    }
  };
}

async function handleTextSticker(sock, jid, parsed, logger) {
  const text = parsed.args.join(" ").trim();
  if (!text) return send(sock, jid, "❌ Teks belum diisi.\n\nContoh:\n/createsticker Lah gua mah ganteng");
  await startTyping(sock, jid);
  let outputPath;
  try {
    outputPath = await createTextSticker(text, logger);
    await sock.sendMessage(jid, { sticker: { url: outputPath } });
  } finally {
    if (outputPath) {
      const fs = await import("node:fs/promises");
      await fs.rm(outputPath, { force: true });
    }
    await stopTyping(sock, jid);
  }
}

async function handleDownload(sock, jid, parsed, logger) {
  const [url] = parsed.args;
  if (!url || !isUrlForCommand(parsed.command, url)) return send(sock, jid, `❌ URL tidak valid.\n\nContoh:\n/${parsed.command} https://...`);
  await startTyping(sock, jid);
  const countdown = await startDownloadCountdown(sock, jid);
  let media;
  try {
    media = await downloadMedia(parsed.command, url, logger);
    await countdown.finish("✅ Media berhasil diunduh.\n\n📤 Mengirim media...");
    const files = media.files || [media];
    for (const [index, file] of files.entries()) {
      const payload = file.mimeType.startsWith("audio/")
        ? { audio: { url: file.filePath }, mimetype: "audio/mpeg" }
        : file.mimeType.startsWith("image/")
          ? { image: { url: file.filePath }, mimetype: file.mimeType }
          : { video: { url: file.filePath }, mimetype: file.mimeType || "video/mp4" };
      await sock.sendMessage(jid, {
        ...payload,
        ...(index === 0 ? { caption: "✅ Download berhasil.\nPowered by YOROZU" } : {}),
      });
    }
  } catch (error) {
    await countdown.finish("❌ Gagal mengunduh media.");
    throw error;
  } finally {
    if (media) {
      const files = media.files || [media];
      await import("node:fs/promises").then(({ rm }) => Promise.all(
        files.filter((file) => file?.filePath).map((file) => rm(file.filePath, { force: true })),
      ));
    }
    await stopTyping(sock, jid);
  }
}

async function handleSticker(sock, message, jid, logger) {
  const source = mediaMessage(message);
  if (!source) return send(sock, jid, "❌ Kirim atau reply gambar, GIF, atau video pendek lalu gunakan /sticker.");
  const type = getContentType(source.message || {});
  const mimeType = source.message?.[type]?.mimetype || "";
  if (!mimeType.startsWith("image/") && !mimeType.startsWith("video/")) return send(sock, jid, "❌ Media harus berupa gambar, GIF, atau video pendek.");
  await startTyping(sock, jid);
  let inputPath;
  let outputPath;
  try {
    const fs = await import("node:fs/promises");
    inputPath = `${config.tempDir}/input-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const data = await downloadMediaMessage(source, "buffer", {});
    await fs.mkdir(config.tempDir, { recursive: true });
    await fs.writeFile(inputPath, data);
    outputPath = await createSticker(inputPath, mimeType, logger);
    await sock.sendMessage(jid, { sticker: { url: outputPath } });
  } finally {
    const fs = await import("node:fs/promises");
    await Promise.all([inputPath, outputPath].filter(Boolean).map((file) => fs.rm(file, { force: true })));
    await stopTyping(sock, jid);
  }
}