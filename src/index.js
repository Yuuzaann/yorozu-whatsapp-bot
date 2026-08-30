import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import { config, commandCooldowns } from "./config.js";
import { createMessageHandler } from "./handler.js";
import { RateLimiter } from "./limiter.js";
import { cleanupDir } from "./utils.js";

const logger = pino({ level: process.env.LOG_LEVEL || "info" });
const limiter = new RateLimiter({ commandCooldowns, globalCooldown: config.globalCooldown, maxConcurrentJobs: config.maxConcurrentJobs, logger });
let stopping = false;

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(config.authDir);
  const sock = makeWASocket({ auth: state, logger: logger.child({ module: "baileys" }), printQRInTerminal: false, browser: [config.botName, "Chrome", "1.0.0"] });
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === "open") logger.info("WhatsApp connection open");
    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      const loggedOut = code === DisconnectReason.loggedOut || code === DisconnectReason.badSession;
      logger.warn({ code, loggedOut }, "WhatsApp connection closed");
      if (!loggedOut && !stopping) void connect();
    }
  });
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const message of messages) await createMessageHandler({ sock, limiter, logger })(message).catch((error) => logger.error({ err: error }, "message handler failed"));
  });
}

await cleanupDir(config.tempDir, logger);
await connect();
process.on("SIGINT", () => { stopping = true; process.exit(0); });
process.on("SIGTERM", () => { stopping = true; process.exit(0); });