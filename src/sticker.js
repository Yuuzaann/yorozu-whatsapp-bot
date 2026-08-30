import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import axios from "axios";
import { config } from "./config.js";
import { ensureDir } from "./utils.js";

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", ...args]);
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(stderr || `ffmpeg exited with ${code}`)));
  });
}

function probeDuration(inputPath) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", inputPath]);
    let output = "";
    let error = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { error += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      const duration = Number.parseFloat(output.trim());
      if (code !== 0 || !Number.isFinite(duration)) reject(new Error(error || "unable to read media duration"));
      else resolve(duration);
    });
  });
}

export async function createSticker(inputPath, mimeType = "", logger) {
  const stat = await fs.stat(inputPath);
  if (stat.size > config.stickerMaxSizeBytes) throw new Error("media exceeds sticker size limit");
  await ensureDir(config.tempDir);
  const outputPath = path.join(config.tempDir, `sticker-${Date.now()}-${Math.random().toString(16).slice(2)}.webp`);
  const isVideo = mimeType.startsWith("video/") || mimeType === "image/gif";
  if (isVideo && (await probeDuration(inputPath)) > config.stickerMaxDuration) {
    throw new Error(`video exceeds ${config.stickerMaxDuration}s sticker duration limit`);
  }
  const args = isVideo
    ? ["-i", inputPath, "-t", String(config.stickerMaxDuration), "-vf", "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=black@0", "-an", "-loop", "0", "-vsync", "0", "-c:v", "libwebp", "-q:v", "60", outputPath]
    : ["-i", inputPath, "-vf", "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=black@0", "-frames:v", "1", "-c:v", "libwebp", outputPath];
  await runFfmpeg(args);
  logger.info({ outputPath }, "sticker created");
  return outputPath;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(text, maxChars) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    if (word.length > maxChars) {
      if (current) lines.push(current);
      for (let index = 0; index < word.length; index += maxChars) {
        lines.push(word.slice(index, index + maxChars));
      }
      current = "";
      continue;
    }

    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 6);
}

const emojiPattern = /\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?)*(?:\uFE0F)?/gu;
const emojiCache = new Map();

async function emojiDataUrl(emoji) {
  if (emojiCache.has(emoji)) return emojiCache.get(emoji);
  const codepoints = [...emoji]
    .filter((character) => character !== "\uFE0F")
    .map((character) => character.codePointAt(0).toString(16))
    .join("-");
  const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codepoints}.svg`;
  try {
    const response = await axios.get(url, { timeout: 10_000, responseType: "text" });
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(response.data).toString("base64")}`;
    emojiCache.set(emoji, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}

async function renderLine(line, y, fontSize) {
  const tokens = [];
  let lastIndex = 0;
  for (const match of line.matchAll(emojiPattern)) {
    if (match.index > lastIndex) tokens.push({ type: "text", value: line.slice(lastIndex, match.index) });
    tokens.push({ type: "emoji", value: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) tokens.push({ type: "text", value: line.slice(lastIndex) });

  const emojiAssets = await Promise.all(tokens.map((token) => (
    token.type === "emoji" ? emojiDataUrl(token.value) : null
  )));
  const widthUnits = tokens.reduce((total, token, index) => (
    total + (token.type === "emoji" && emojiAssets[index] ? 1.1 : token.value.length * 0.58)
  ), 0);
  let x = 256 - (widthUnits * fontSize) / 2;
  const nodes = [];

  tokens.forEach((token, index) => {
    if (token.type === "emoji" && emojiAssets[index]) {
      const width = fontSize * 1.1;
      nodes.push(`<image x="${x.toFixed(1)}" y="${(y - fontSize * 0.82).toFixed(1)}" width="${width.toFixed(1)}" height="${width.toFixed(1)}" href="${emojiAssets[index]}"/>`);
      x += width;
    } else if (token.value) {
      nodes.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${escapeXml(token.value)}</text>`);
      x += token.value.length * fontSize * 0.58;
    }
  });
  return nodes.join("");
}

export async function createTextSticker(text, logger) {
  const value = String(text || "").trim();
  if (!value) throw new Error("Tulis kata-kata setelah command /createsticker.");
  if (value.length > config.textStickerMaxLength) {
    throw new Error(`Teks terlalu panjang. Maksimal ${config.textStickerMaxLength} karakter.`);
  }

  await ensureDir(config.tempDir);
  const id = `text-sticker-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const svgPath = path.join(config.tempDir, `${id}.svg`);
  const outputPath = path.join(config.tempDir, `${id}.webp`);
  const maxChars = value.length <= 18 ? 10 : value.length <= 42 ? 14 : 18;
  const lines = wrapText(value, maxChars);
  const longestLine = Math.max(...lines.map((line) => line.length), 1);
  const baseFontSize = lines.length >= 5 ? 48 : lines.length >= 4 ? 56 : lines.length >= 3 ? 68 : 82;
  /*
   * Arial rata-rata sekitar 0.58em per karakter. Sisakan margin supaya
   * kata panjang tidak terpotong saat WhatsApp merender sticker.
   */
  const widthLimitedFontSize = Math.floor(460 / (longestLine * 0.58));
  const fontSize = Math.max(28, Math.min(baseFontSize, widthLimitedFontSize));
  const lineHeight = fontSize * 1.12;
  const startY = 256 - ((lines.length - 1) * lineHeight) / 2;
  const textNodes = (await Promise.all(lines.map((line, index) => renderLine(line, startY + index * lineHeight, fontSize)))).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#fff"/><g fill="#000" font-family="Arial,DejaVu Sans,sans-serif" font-size="${fontSize}" font-weight="400">${textNodes}</g></svg>`;

  try {
    await fs.writeFile(svgPath, svg, "utf8");
    await runFfmpeg([
      "-i", svgPath,
      "-frames:v", "1",
      "-c:v", "libwebp",
      "-lossless", "0",
      "-q:v", "80",
      outputPath,
    ]);
    const stat = await fs.stat(outputPath);
    if (!stat.size) throw new Error("Sticker teks kosong.");
    logger.info({ outputPath, characters: value.length }, "text sticker created");
    return outputPath;
  } catch (error) {
    await fs.rm(outputPath, { force: true });
    throw error;
  } finally {
    await fs.rm(svgPath, { force: true });
  }
}