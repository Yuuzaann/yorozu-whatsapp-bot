# 🌙 YOROZU WhatsApp Bot

> **Simple. Fast. Useful.**
>
> YOROZU is a Node.js WhatsApp bot built with **Baileys** for media downloading, sticker creation, and lightweight utility commands.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Baileys-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Baileys">
  <img src="https://img.shields.io/badge/pnpm-supported-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License">
</p>

<p align="center">
  <b>🇮🇩 Bahasa Indonesia</b> ·
  <a href="#-english">🇬🇧 English</a>
</p>

---

## 🇮🇩 Bahasa Indonesia

**YOROZU** adalah bot WhatsApp berbasis **Node.js + Baileys** yang dirancang untuk kebutuhan media dan utility sederhana.

Bot ini mendukung downloader TikTok/YouTube, pembuatan sticker, pengecekan status bot, serta berbagai mekanisme proteksi untuk mengurangi request berlebihan.

### ✨ Fitur

* 🎵 Download audio YouTube → MP3
* 🎬 Download video YouTube → MP4
* 🎥 Download video TikTok
* 🖼️ Download foto TikTok
* 🖼️ Support TikTok photo carousel
* 🖼️ Buat sticker dari gambar
* 🎞️ Buat sticker dari GIF/video pendek
* 📝 Buat text/meme sticker
* 📡 `/ping` untuk status & latency
* 🛡️ Per-command cooldown
* 🚦 Global cooldown
* 🔒 Duplicate request protection
* ⚙️ Concurrent job limit
* 🔄 Automatic WhatsApp reconnect
* 🧹 Automatic temporary-file cleanup

---

## 📋 Commands

### 📥 Downloader

| Command         | Description                |
| --------------- | -------------------------- |
| `/tiktok <url>` | Download video/foto TikTok |
| `/ytmp3 <url>`  | Download audio YouTube     |
| `/ytmp4 <url>`  | Download video YouTube     |

### 🎨 Sticker

| Command                 | Description         |
| ----------------------- | ------------------- |
| `/sticker`              | Create sticker      |
| `/s`                    | Shortcut sticker    |
| `/stiker`               | Shortcut sticker    |
| `/createsticker <text>` | Create text sticker |

Untuk `/sticker`, kamu dapat:

* Mengirim media bersama command
* Reply gambar/GIF/video lalu gunakan command
* Video/GIF maksimal **10 detik** secara default
* Input sticker maksimal **10 MB** secara default

Contoh:

```text
/createsticker Waduh, ketahuan!
```

### ⚙️ System

| Command | Description                     |
| ------- | ------------------------------- |
| `/menu` | Menampilkan daftar command      |
| `/help` | Menampilkan panduan penggunaan  |
| `/ping` | Mengecek status dan latency bot |

---

## 🛠️ Requirements

Pastikan environment sudah memiliki:

* **Node.js 20+**
* **pnpm**
* **FFmpeg**
* **yt-dlp**
* Akun WhatsApp untuk pairing

Cek dependency:

```bash
node --version
pnpm --version
yt-dlp --version
ffmpeg -version
```

---

## 📦 Installation

Clone repository kemudian install dependency:

```bash
pnpm install
```

Jika bot berada di folder `yorozu`:

```bash
cd yorozu
pnpm install
```

---

## ⚙️ Configuration

Buat file `.env` dari template:

```bash
cd yorozu
cp .env.example .env
```

### Environment Variables

| Variable                  |  Default | Description                     |
| ------------------------- | -------: | ------------------------------- |
| `BOT_NAME`                | `YOROZU` | Nama device WhatsApp            |
| `MAX_CONCURRENT_JOBS`     |      `2` | Maksimal proses berat bersamaan |
| `REQUEST_TIMEOUT`         |  `30000` | Timeout downloader (ms)         |
| `STICKER_MAX_DURATION`    |     `10` | Maksimal durasi sticker (detik) |
| `STICKER_MAX_SIZE_MB`     |     `10` | Maksimal ukuran input sticker   |
| `TEXT_STICKER_MAX_LENGTH` |    `120` | Maksimal karakter text sticker  |
| `GLOBAL_COOLDOWN`         |      `3` | Global cooldown user (detik)    |
| `TEMP_DIR`                | `./temp` | Directory file sementara        |
| `AUTH_DIR`                | `./auth` | Directory session WhatsApp      |
| `DOWNLOADER_MAX_SIZE_MB`  |     `50` | Maksimal ukuran media download  |
| `LOG_LEVEL`               |   `info` | Level Pino logger               |

> Semua variable bersifat opsional. Jika tidak diatur, nilai default akan digunakan.

---

## ▶️ Running

### Production

Dari root repository:

```bash
pnpm --filter yorozu run start
```

Atau:

```bash
cd yorozu
pnpm start
```

### Development

```bash
pnpm --filter yorozu run dev
```

---

## 📱 WhatsApp Pairing

1. Jalankan bot.
2. Tunggu QR code muncul di terminal/workflow.
3. Buka **WhatsApp → Perangkat tertaut**.
4. Pilih **Tautkan perangkat**.
5. Scan QR code.
6. Session akan disimpan di folder `auth/`.

Pada restart berikutnya, bot akan menggunakan session yang sudah tersimpan sehingga biasanya tidak perlu scan QR lagi.

> ⚠️ Jangan menghapus folder `auth/` kecuali memang ingin melakukan pairing ulang.

---

## ⏱️ Default Cooldown

| Command          | Cooldown |
| ---------------- | -------: |
| `/tiktok`        |      15s |
| `/ytmp3`         |      20s |
| `/ytmp4`         |      20s |
| `/sticker`       |      10s |
| `/s`             |      10s |
| `/stiker`        |      10s |
| `/createsticker` |       5s |
| `/menu`          |       3s |
| `/help`          |       3s |
| `/ping`          |       3s |

Downloader dan sticker juga dibatasi oleh:

```text
MAX_CONCURRENT_JOBS
GLOBAL_COOLDOWN
```

Hal ini membantu mencegah spam request dan beban proses yang berlebihan.

---

## 📁 Project Structure

```text
yorozu/
├── src/
│   ├── index.js
│   ├── handler.js
│   ├── commands.js
│   ├── downloader.js
│   ├── sticker.js
│   ├── limiter.js
│   ├── config.js
│   └── utils.js
│
├── .env.example
├── auth/
├── temp/
└── package.json
```

### Core Modules

| File            | Responsibility                      |
| --------------- | ----------------------------------- |
| `index.js`      | WhatsApp connection & lifecycle     |
| `handler.js`    | Message parsing & command execution |
| `commands.js`   | Command definitions, menu & help    |
| `downloader.js` | yt-dlp & TikTok fallback            |
| `sticker.js`    | Sticker processing                  |
| `limiter.js`    | Cooldown & request limits           |
| `config.js`     | Environment configuration           |
| `utils.js`      | Shared helper functions             |

---

## 🔐 Security & Privacy

Jangan commit file atau directory berikut:

```text
.env
auth/
temp/
```

Tambahkan ke `.gitignore`:

```gitignore
.env
auth/
temp/
```

Folder `auth/` berisi session WhatsApp dan harus dianggap sebagai data sensitif.

---

## 📥 Downloader Limitations

Downloader hanya ditujukan untuk **media publik yang memang boleh kamu akses dan unduh**.

Beberapa kondisi dapat menyebabkan download gagal:

* Media private
* Video/foto telah dihapus
* Content yang membutuhkan login
* Age-restricted content
* Region-restricted content
* Platform melakukan perubahan sistem
* URL sudah expired atau tidak valid
* Ukuran file melebihi limit

### TikTok Fallback

Jika `yt-dlp` gagal menangani link TikTok publik tertentu, YOROZU dapat mencoba fallback melalui **TikWM**.

> Fallback bergantung pada ketersediaan layanan pihak ketiga dan tidak menjamin semua URL dapat diproses.

File hasil download hanya digunakan sementara dan akan dihapus setelah proses selesai.

---

## 🧹 Temporary Files

YOROZU melakukan cleanup:

* Saat bot startup
* Setelah proses download selesai
* Setelah media berhasil dikirim
* Setelah proses sticker selesai

Tujuannya untuk mencegah folder `temp/` terus membesar.

---

## 🩺 Troubleshooting

### QR Code Tidak Muncul

Pastikan bot sedang berjalan dan periksa log terminal.

Jika ingin pairing ulang:

```bash
rm -rf yorozu/auth
pnpm --filter yorozu run start
```

> Perintah ini menghapus session WhatsApp yang tersimpan.

### Session WhatsApp Rusak

Stop bot terlebih dahulu:

```bash
rm -rf yorozu/auth
pnpm --filter yorozu run start
```

Kemudian scan QR baru.

### Downloader Gagal

Periksa:

```bash
yt-dlp --version
ffmpeg -version
```

Kemudian coba URL publik lainnya.

### File Terlalu Besar

Edit `.env`:

```env
DOWNLOADER_MAX_SIZE_MB=100
```

> Gunakan limit yang wajar karena file besar membutuhkan bandwidth, storage, CPU, dan memory lebih banyak.

### Dashboard/API Tidak Berhubungan

YOROZU WhatsApp Bot merupakan proses terpisah dari dashboard/API.

Jalankan bot menggunakan:

```bash
pnpm --filter yorozu run start
```

---

## 🧪 Local Validation

Validasi syntax seluruh file JavaScript:

```bash
for file in yorozu/src/*.js; do node --check "$file"; done
```

Periksa whitespace/error formatting:

```bash
git diff --check
```

---

## ☁️ Replit

Jika dijalankan di Replit:

* Node.js dikonfigurasi melalui `.replit`
* `yt-dlp` dikonfigurasi melalui `.replit`
* Pastikan FFmpeg tersedia
* Gunakan workflow **YOROZU WhatsApp Bot**
* Jangan menghapus `auth/` jika tidak ingin pairing ulang

---

## ⚖️ Usage & Disclaimer

YOROZU dibuat untuk tujuan pembelajaran dan penggunaan pribadi.

Gunakan bot hanya untuk konten yang **kamu miliki atau memang memiliki izin untuk mengunduhnya**.

Developer tidak bertanggung jawab atas penyalahgunaan bot atau pelanggaran terhadap Terms of Service platform pihak ketiga.

---

## 📄 License

This project is licensed under the **MIT License**.

---

# 🇬🇧 English

YOROZU is a **Node.js + Baileys** WhatsApp bot designed for media downloading, sticker creation, and lightweight utility commands.

## ✨ Features

* 🎵 YouTube audio downloader → MP3
* 🎬 YouTube video downloader → MP4
* 🎥 TikTok video downloader
* 🖼️ TikTok photo downloader
* 🖼️ TikTok photo carousel support
* 🖼️ Image sticker creation
* 🎞️ GIF/video sticker creation
* 📝 Text/meme sticker creation
* 📡 Bot status & latency with `/ping`
* 🛡️ Per-command cooldowns
* 🚦 Global cooldown
* 🔒 Duplicate request protection
* ⚙️ Concurrent job limits
* 🔄 Automatic reconnect
* 🧹 Automatic temporary-file cleanup

## 📋 Commands

### Downloader

```text
/tiktok <url>
/ytmp3 <url>
/ytmp4 <url>
```

### Stickers

```text
/sticker
/s
/stiker
/createsticker <text>
```

### System

```text
/menu
/help
/ping
```

## 🛠️ Requirements

* Node.js 20+
* pnpm
* FFmpeg
* yt-dlp
* WhatsApp account for pairing

Check your environment:

```bash
node --version
pnpm --version
yt-dlp --version
ffmpeg -version
```

## 📦 Installation

```bash
pnpm install
```

Or:

```bash
cd yorozu
pnpm install
```

## ⚙️ Configuration

Create `.env` from `.env.example`:

```bash
cd yorozu
cp .env.example .env
```

All configuration variables are optional and have built-in defaults.

See the **Configuration** table in the Indonesian section above for the complete list.

## ▶️ Running

Production:

```bash
pnpm --filter yorozu run start
```

Development:

```bash
pnpm --filter yorozu run dev
```

Or:

```bash
cd yorozu
pnpm start
```

## 📱 WhatsApp Pairing

1. Start the bot.
2. Wait for the QR code.
3. Open **WhatsApp → Linked devices**.
4. Select **Link a device**.
5. Scan the QR code.
6. The session will be stored in `auth/`.

The saved session will normally be reused after restarting the bot.

## 📥 Downloader Limitations

Only use public media that you are authorized to access and download.

Downloads may fail for:

* Private content
* Deleted media
* Login-required content
* Age-restricted content
* Region-restricted content
* Invalid or expired URLs
* Platform changes
* Files exceeding the configured size limit

For some TikTok URLs, YOROZU may attempt a TikWM fallback when `yt-dlp` fails.

Third-party fallback availability is not guaranteed.

## 🔐 Security

Never commit:

```text
.env
auth/
temp/
```

The `auth/` directory contains the WhatsApp session and should be treated as sensitive data.

## 🧪 Local Validation

```bash
for file in yorozu/src/*.js; do node --check "$file"; done
```

```bash
git diff --check
```

## ☁️ Replit

When running on Replit:

* Node.js is configured through `.replit`
* `yt-dlp` is configured through `.replit`
* Make sure FFmpeg is available
* Use the **YOROZU WhatsApp Bot** workflow
* Keep `auth/` if you want to reuse the existing session

## ⚖️ Disclaimer

YOROZU is intended for educational and personal use.

Only download content that you own or have permission to download.

The developer is not responsible for misuse of the bot or violations of third-party platform Terms of Service.

## 📄 License

MIT
