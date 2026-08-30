import { formatRemaining } from "./utils.js";

export class RateLimiter {
  constructor({ commandCooldowns, globalCooldown, maxConcurrentJobs, logger }) {
    this.commandCooldowns = commandCooldowns;
    this.globalCooldown = globalCooldown;
    this.maxConcurrentJobs = maxConcurrentJobs;
    this.logger = logger;
    this.commandLastUsed = new Map();
    this.globalLastUsed = new Map();
    this.activeJobs = 0;
    this.inFlight = new Set();
  }

  check(key, command, fingerprint) {
    const now = Date.now();
    const commandWait = (this.commandCooldowns[command] || 0) * 1000 - (now - (this.commandLastUsed.get(`${key}:${command}`) || 0));
    if (commandWait > 0) return { ok: false, seconds: formatRemaining(commandWait / 1000), reason: "command" };
    if (this.inFlight.has(fingerprint)) return { ok: false, duplicate: true, reason: "duplicate" };
    if (["tiktok", "ytmp3", "ytmp4", "sticker", "s", "stiker"].includes(command) && this.activeJobs >= this.maxConcurrentJobs) {
      return { ok: false, full: true, reason: "capacity" };
    }
    if (["tiktok", "ytmp3", "ytmp4", "sticker", "s", "stiker"].includes(command)) {
      const globalWait = this.globalCooldown * 1000 - (now - (this.globalLastUsed.get(key) || 0));
      if (globalWait > 0) return { ok: false, seconds: formatRemaining(globalWait / 1000), reason: "global" };
    }
    return { ok: true };
  }

  reserve(key, command, fingerprint) {
    const now = Date.now();
    this.commandLastUsed.set(`${key}:${command}`, now);
    if (["tiktok", "ytmp3", "ytmp4", "sticker", "s", "stiker"].includes(command)) this.globalLastUsed.set(key, now);
    this.inFlight.add(fingerprint);
    this.activeJobs += 1;
    this.logger.info({ key, command, activeJobs: this.activeJobs }, "processing start");
    return () => {
      this.inFlight.delete(fingerprint);
      this.activeJobs = Math.max(0, this.activeJobs - 1);
      this.logger.info({ key, command, activeJobs: this.activeJobs }, "processing slot released");
    };
  }
}