import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import axios from "axios";
import { config } from "./config.js";
import { ensureDir, maskedUrl } from "./utils.js";

const PLATFORM_HOSTS = {
  tiktok: [
    "tiktok.com",
    "www.tiktok.com",
    "vm.tiktok.com",
    "vt.tiktok.com",
    "m.tiktok.com",
  ],

  youtube: [
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "music.youtube.com",
    "youtu.be",
  ],
};

function normalizeUrl(raw) {
  if (typeof raw !== "string") {
    throw new Error("URL tidak valid");
  }

  const value = raw.trim();

  if (!value) {
    throw new Error("URL kosong");
  }

  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Format URL tidak valid");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("URL harus menggunakan HTTP atau HTTPS");
  }

  return url.toString();
}

function detectPlatform(sourceUrl) {
  const url = new URL(sourceUrl);
  const hostname = url.hostname.toLowerCase();

  for (const [platform, hosts] of Object.entries(PLATFORM_HOSTS)) {
    if (
      hosts.includes(hostname) ||
      hosts.some((host) => hostname.endsWith(`.${host}`))
    ) {
      return platform;
    }
  }

  return null;
}

function validateCommandPlatform(command, platform) {
  if (command === "tiktok") {
    return platform === "tiktok";
  }

  if (command === "ytmp3" || command === "ytmp4") {
    return platform === "youtube";
  }

  return false;
}

async function detectMimeType(filePath, command) {
  const header = await readFileHeader(filePath);

  if (header.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return "image/jpeg";
  }

  if (header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }

  if (header.subarray(0, 4).toString("ascii") === "GIF8") {
    return "image/gif";
  }

  if (
    header.subarray(0, 4).toString("ascii") === "RIFF" &&
    header.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  if (header.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = header.subarray(8, 12).toString("ascii").toLowerCase();
    if (["avif", "avis"].includes(brand)) return "image/avif";
    return "video/mp4";
  }

  if (header.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) {
    return "video/webm";
  }

  if (
    header.subarray(0, 3).toString("ascii") === "ID3" ||
    (header[0] === 0xff && (header[1] & 0xe0) === 0xe0)
  ) {
    return "audio/mpeg";
  }

  return mimeTypeFromExtension(filePath, command);
}

async function readFileHeader(filePath) {
  const handle = await fs.open(filePath, "r");
  const header = Buffer.alloc(32);

  try {
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    return header.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

function mimeTypeFromExtension(filePath, command) {
  const extension = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".ogg": "audio/ogg",
    ".wav": "audio/wav",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".mkv": "video/x-matroska",
    ".mp4": "video/mp4",
  };

  return mimeTypes[extension] || (command === "ytmp3" ? "audio/mpeg" : "video/mp4");
}

export async function downloadMedia(command, sourceUrl, logger) {
  const url = normalizeUrl(sourceUrl);
  const platform = detectPlatform(url);

  if (!platform) {
    throw new Error(
      "Platform tidak didukung. Gunakan TikTok atau YouTube.",
    );
  }

  if (!validateCommandPlatform(command, platform)) {
    throw new Error(`URL ${platform} tidak cocok dengan command /${command}.`);
  }

  logger.info(
    {
      command,
      platform,
      url: maskedUrl(url),
    },
    "starting media download",
  );

  await ensureDir(config.tempDir);

  try {
    return await downloadWithYtDlp(command, url, platform, logger);
  } catch (error) {
    /*
     * Link pendek TikTok dapat dialihkan ke halaman regional sebelum yt-dlp
     * sempat membaca posting aslinya. TikWM menangani link pendek dan posting foto publik.
     */
    if (platform === "tiktok") {
      logger.warn({ err: error, url: maskedUrl(url) }, "yt-dlp TikTok failed, trying fallback");
      return downloadWithTikwm(url, logger);
    }

    throw error;
  }
}

async function downloadWithYtDlp(command, sourceUrl, platform, logger) {
  const jobId = [
    platform,
    Date.now(),
    Math.random().toString(36).slice(2, 8),
  ].join("-");

  const allowMultipleMedia = platform === "tiktok";
  const outputName = allowMultipleMedia
    ? `${jobId}-%(autonumber)03d.%(ext)s`
    : `${jobId}.%(ext)s`;
  const outputTemplate = path.join(config.tempDir, outputName);

  const maxSizeMB = Math.max(
    1,
    Math.floor(config.downloaderMaxSizeBytes / 1024 / 1024),
  );

  const args = [
    ...(allowMultipleMedia ? [] : ["--no-playlist"]),
    "--no-warnings",
    "--no-progress",

    "--restrict-filenames",

    "--socket-timeout",
    String(Math.max(10, Math.ceil(config.requestTimeout / 1000))),

    "--retries",
    "3",

    "--fragment-retries",
    "3",

    "--extractor-retries",
    "3",

    "--file-access-retries",
    "3",

    "--max-filesize",
    `${maxSizeMB}M`,

    "--no-part",

    "--user-agent",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36",

    "--referer",
    "https://www.tiktok.com/",

    "--geo-bypass",

    "-o",
    outputTemplate,
  ];

  /* Format audio YouTube. */
  if (command === "ytmp3") {
    args.push(
      "-f",
      "ba/best",

      "-x",

      "--audio-format",
      "mp3",

      "--audio-quality",
      "128K",
    );
  } else if (platform === "youtube") {
    /*
     * Video:
     * bv* = video terbaik, ba = audio terbaik,
     * b = cadangan untuk stream gabungan.
     */
    args.push(
      "-f",
      "bv*+ba/b",

      "--merge-output-format",
      "mp4",
    );
  } else {
    args.push("-f", "best");
  }

  args.push(
    /* Cetak hanya path file setelah proses selesai. */
    "--print",
    "after_move:filepath",

    sourceUrl,
  );

  logger.info(
    {
      command,
      platform,
      url: maskedUrl(sourceUrl),
      engine: "yt-dlp",
    },
    "yt-dlp request",
  );

  let stdout;

  try {
    stdout = await runYtDlp(args, config.requestTimeout);
  } catch (error) {
    throw normalizeYtDlpError(error);
  }

  const filePaths = await findDownloadedFiles(stdout, jobId);

  if (!filePaths.length) {
    throw new Error(
      "yt-dlp selesai tetapi file hasil download tidak ditemukan.",
    );
  }

  try {
    const files = [];

    for (const filePath of filePaths) {
      const stat = await fs.stat(filePath);

      if (stat.size <= 0) {
        throw new Error("File hasil download kosong.");
      }

      if (stat.size > config.downloaderMaxSizeBytes) {
        throw new Error(`Ukuran media terlalu besar. Maksimal ${maxSizeMB} MB.`);
      }

      files.push({
        filePath,
        mimeType: await detectMimeType(filePath, command),
        filename: path.basename(filePath),
        size: stat.size,
      });
    }

    logger.info(
      {
        command,
        platform,
        files: files.length,
        size: files.reduce((total, file) => total + file.size, 0),
      },
      "media download completed",
    );

    return {
      ...files[0],
      files,
    };
  } catch (error) {
    await Promise.all(filePaths.map((filePath) => fs.rm(filePath, { force: true })));
    throw error;
  }
}

async function downloadWithTikwm(sourceUrl, logger) {
  const jobId = ["tiktok", Date.now(), Math.random().toString(36).slice(2, 8)].join("-");
  const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(sourceUrl)}`;
  const response = await axios.get(apiUrl, {
    timeout: config.requestTimeout,
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0",
    },
  });

  const data = response.data?.data;
  if (response.data?.code !== 0 || !data) {
    throw new Error("Link TikTok tidak tersedia, private, atau sudah kedaluwarsa.");
  }

  const imageUrls = normalizeImageUrls(data.images);
  const videoUrl = data.hdplay || data.play || data.wmplay;
  const sourcePath = new URL(sourceUrl).pathname.toLowerCase();
  const isPhotoPost = /\/photo(?:\/|$)/.test(sourcePath);
  const isImage = Boolean(imageUrls.length && (isPhotoPost || !videoUrl));
  const mediaUrl = isImage ? imageUrls[0] : videoUrl || imageUrls[0];
  if (!mediaUrl) {
    throw new Error("Media TikTok tidak memiliki file yang dapat diunduh.");
  }

  logger.info(
    { engine: "tikwm", url: maskedUrl(sourceUrl), isImage, isPhotoPost },
    "TikTok fallback request",
  );
  const mediaUrls = isImage ? imageUrls : [mediaUrl];
  const files = await downloadRemoteFiles(mediaUrls, {
    jobId,
    referer: "https://www.tiktok.com/",
    logger,
  });

  return {
    ...files[0],
    files,
  };
}

async function downloadRemoteFiles(mediaUrls, { jobId, referer, logger }) {
  const files = [];
  const maxSizeMB = Math.floor(config.downloaderMaxSizeBytes / 1024 / 1024);

  try {
    for (const [index, mediaUrl] of mediaUrls.entries()) {
      const response = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        timeout: config.requestTimeout,
        headers: { "user-agent": "Mozilla/5.0", referer },
        maxContentLength: config.downloaderMaxSizeBytes,
        maxBodyLength: config.downloaderMaxSizeBytes,
      });

      const buffer = Buffer.from(response.data);
      if (!buffer.length) throw new Error("File media hasil download kosong.");
      if (buffer.length > config.downloaderMaxSizeBytes) {
        throw new Error(`Ukuran media terlalu besar. Maksimal ${maxSizeMB} MB.`);
      }

      const temporaryPath = path.join(config.tempDir, `${jobId}-${index}.part`);
      await fs.writeFile(temporaryPath, buffer);

      try {
        const detectedMimeType = await detectMimeType(temporaryPath, "tiktok");
        const responseMimeType = String(response.headers["content-type"] || "")
          .split(";")[0]
          .trim()
          .toLowerCase();
        const mimeType =
          detectedMimeType === "video/mp4" && /^(image|video|audio)\//.test(responseMimeType)
            ? responseMimeType
            : detectedMimeType;
        const extension = extensionForMimeType(mimeType);
        const filePath = path.join(config.tempDir, `${jobId}-${index}.${extension}`);

        await fs.rename(temporaryPath, filePath);
        files.push({
          filePath,
          mimeType,
          filename: path.basename(filePath),
          size: buffer.length,
        });
      } catch (error) {
        await fs.rm(temporaryPath, { force: true });
        throw error;
      }
    }
  } catch (error) {
    await Promise.all(files.map(({ filePath }) => fs.rm(filePath, { force: true })));
    throw error;
  }

  logger.info(
    {
      files: files.length,
      size: files.reduce((total, file) => total + file.size, 0),
    },
    "remote media download completed",
  );

  return files;
}

function normalizeImageUrls(images) {
  if (Array.isArray(images)) return images.filter((value) => typeof value === "string" && value.trim());
  if (typeof images !== "string" || !images.trim()) return [];

  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed)
      ? parsed.filter((value) => typeof value === "string" && value.trim())
      : [];
  } catch {
    return images.startsWith("http") ? [images] : [];
  }
}

function extensionForMimeType(mimeType) {
  return {
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  }[mimeType] || "jpg";
}

async function findDownloadedFiles(stdout, jobId) {
  /* Utamakan path file yang dicetak oleh yt-dlp. */
  const lines = String(stdout || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const printedFiles = [];
  for (const candidate of lines) {
    if (await fileExists(candidate) && !printedFiles.includes(candidate)) {
      printedFiles.push(candidate);
    }
  }

  if (printedFiles.length) return printedFiles;

  /* Jika path tidak ditemukan, cari file berdasarkan jobId. */
  let entries = [];

  try {
    entries = await fs.readdir(config.tempDir, {
      withFileTypes: true,
    });
  } catch {
    return [];
  }

  return entries
    .filter((entry) => entry.isFile() && entry.name.startsWith(jobId))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((entry) => path.join(config.tempDir, entry.name));
}

function runYtDlp(args, timeout) {
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    let finished = false;

    const child = spawn("yt-dlp", args, {
      stdio: ["ignore", "pipe", "pipe"],

      /* Menyembunyikan jendela proses di Windows. */
      windowsHide: true,
    });

    const timer = setTimeout(() => {
      if (finished) return;

      finished = true;

      try {
        child.kill("SIGKILL");
      } catch {}

      reject(
        new Error(
          `Download timeout setelah ${Math.ceil(timeout / 1000)} detik.`,
        ),
      );
    }, timeout);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      if (finished) return;

      finished = true;
      clearTimeout(timer);

      if (error.code === "ENOENT") {
        reject(
          new Error(
            "yt-dlp tidak ditemukan. Pastikan yt-dlp sudah terinstall dan masuk PATH.",
          ),
        );
        return;
      }

      reject(error);
    });

    child.on("close", (code) => {
      if (finished) return;

      finished = true;
      clearTimeout(timer);

      if (code === 0) {
        resolve(stdout);
        return;
      }

      const output = [stderr.trim(), stdout.trim()].filter(Boolean).join("\n");

      reject(new Error(output || `yt-dlp berhenti dengan exit code ${code}`));
    });
  });
}

function normalizeYtDlpError(error) {
  const message = String(error?.message || error || "");

  if (message.includes("yt-dlp tidak ditemukan")) {
    return new Error("yt-dlp belum terinstall atau tidak masuk PATH server.");
  }

  if (/ffmpeg.*not found/i.test(message) || /ffmpeg.*missing/i.test(message)) {
    return new Error("FFmpeg belum terinstall atau tidak masuk PATH server.");
  }

  if (/unsupported url/i.test(message)) {
    return new Error("URL tidak didukung oleh yt-dlp.");
  }

  if (
    /private/i.test(message) ||
    /login/i.test(message) ||
    /sign in/i.test(message)
  ) {
    return new Error("Media bersifat private atau membutuhkan login.");
  }

  if (
    /video unavailable/i.test(message) ||
    /content.*unavailable/i.test(message)
  ) {
    return new Error("Media tidak tersedia atau sudah dihapus.");
  }

  if (/age.?restricted/i.test(message)) {
    return new Error("Media memiliki pembatasan usia.");
  }

  if (/429|too many requests/i.test(message)) {
    return new Error(
      "Server platform sedang membatasi request. Coba lagi nanti.",
    );
  }

  if (/403|forbidden/i.test(message)) {
    return new Error("Akses media ditolak oleh platform.");
  }

  if (/timeout/i.test(message)) {
    return new Error("Download terlalu lama dan dihentikan.");
  }

  return new Error(message.slice(0, 500) || "Download gagal.");
}

async function fileExists(filePath) {
  if (!filePath) return false;

  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
