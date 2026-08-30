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
  🇮🇩 Bahasa Indonesia · 🇬🇧 English
</p>

---

# 🇮🇩 Bahasa Indonesia

YOROZU adalah bot WhatsApp berbasis **Node.js + Baileys** untuk mengunduh media TikTok/YouTube, membuat sticker, dan menjalankan command utility sederhana.

## ✨ Fitur

* 🎵 Download audio YouTube → MP3
* 🎬 Download video YouTube → MP4
* 🎥 Download video TikTok
* 🖼️ Download foto TikTok
* 🖼️ Support TikTok photo carousel
* 🖼️ Membuat sticker dari gambar
* 🎞️ Membuat sticker dari GIF/video pendek
* 📝 Membuat text/meme sticker
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

Untuk `/sticker`, kamu dapat mengirim gambar/GIF/video bersama command atau reply media tersebut.

Batas default:

* Video/GIF: **10 detik**
* Input sticker: **10 MB**
* Text sticker: **120 karakter**

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

# 🛠️ Requirements

Sebelum menjalankan YOROZU, pastikan komputer sudah memiliki:

* **Node.js 20 atau lebih baru**
* **pnpm**
* **FFmpeg**
* **yt-dlp**
* **Visual Studio Code** *(direkomendasikan untuk development)*
* Akun WhatsApp untuk pairing

> 💡 YOROZU dapat dijalankan langsung melalui **Visual Studio Code**. VS Code hanya digunakan sebagai code editor dan terminal; bot tetap berjalan menggunakan Node.js.

### Cek Requirement

Buka terminal VS Code dan jalankan:

```bash
node --version
pnpm --version
yt-dlp --version
ffmpeg -version
```

Jika semua command menampilkan versi, environment sudah siap.

---

# 💻 Menjalankan YOROZU di VS Code

YOROZU dapat dijalankan langsung dari **Visual Studio Code**.

## 1. Buka Repository

Buka folder repository YOROZU menggunakan VS Code:

```text
File → Open Folder
```

Kemudian pilih folder project.

Struktur project kurang lebih:

```text
yorozu/
├── src/
├── .env.example
├── package.json
├── auth/
└── temp/
```

---

## 2. Buka Terminal VS Code

Gunakan:

```text
Terminal → New Terminal
```

Atau shortcut:

```text
Ctrl + `
```

Pastikan terminal berada di folder repository.

Cek:

```bash
node --version
```

---

## 3. Install Dependencies

Dari root repository:

```bash
pnpm install
```

Jika package bot berada di folder `yorozu`:

```bash
cd yorozu
pnpm install
```

---

## 4. Buat File Environment

Salin `.env.example` menjadi `.env`.

Linux/macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Kemudian sesuaikan konfigurasi jika diperlukan.

---

# ⚙️ Configuration

Semua konfigurasi bersifat opsional. Jika tidak diisi, nilai default akan digunakan.

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

Contoh `.env`:

```env
BOT_NAME=YOROZU
MAX_CONCURRENT_JOBS=2
REQUEST_TIMEOUT=30000
STICKER_MAX_DURATION=10
STICKER_MAX_SIZE_MB=10
TEXT_STICKER_MAX_LENGTH=120
GLOBAL_COOLDOWN=3
TEMP_DIR=./temp
AUTH_DIR=./auth
DOWNLOADER_MAX_SIZE_MB=50
LOG_LEVEL=info
```

> ⚠️ Jangan upload `.env` ke repository GitHub.

---

# ▶️ Running the Bot

Setelah dependencies terinstall, jalankan bot melalui terminal VS Code.

### Production

Dari root repository:

```bash
pnpm --filter yorozu run start
```

Atau jika berada di folder bot:

```bash
cd yorozu
pnpm start
```

### Development

Untuk development dengan automatic restart:

```bash
pnpm --filter yorozu run dev
```

---

# 📱 WhatsApp Pairing

Setelah bot dijalankan:

1. Tunggu QR code muncul di terminal VS Code.
2. Buka **WhatsApp** di HP.
3. Masuk ke **Perangkat tertaut**.
4. Pilih **Tautkan perangkat**.
5. Scan QR code yang muncul di terminal.
6. Tunggu sampai bot berhasil terhubung.

Session WhatsApp akan disimpan di:

```text
auth/
```

Pada restart berikutnya, session tersebut akan digunakan kembali sehingga biasanya tidak perlu scan QR lagi.

> ⚠️ Jangan menghapus folder `auth/` jika masih ingin menggunakan session WhatsApp yang sudah terhubung.

---

# ⏱️ Default Cooldown

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

Hal ini membantu mengurangi spam request dan beban CPU/memory yang berlebihan.

---

# 📁 Project Structure

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

# 🔐 Security & Privacy

Jangan commit file atau folder berikut:

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

# 📥 Downloader Limitations

Downloader ditujukan untuk media publik yang memang boleh kamu akses dan unduh.

Download dapat gagal apabila:

* Media bersifat private
* Media telah dihapus
* Content membutuhkan login
* Content dibatasi usia
* Content dibatasi wilayah
* URL tidak valid atau expired
* Platform mengubah sistemnya
* Ukuran file melebihi limit

Jika `yt-dlp` gagal menangani link TikTok publik tertentu, YOROZU dapat mencoba fallback melalui TikWM.

> Fallback bergantung pada layanan pihak ketiga dan tidak menjamin semua URL dapat diproses.

File hasil download hanya disimpan sementara dan akan dihapus setelah proses selesai.

---

# 🧹 Temporary Files

YOROZU melakukan cleanup file sementara:

* Saat startup
* Setelah download selesai
* Setelah media berhasil dikirim
* Setelah proses sticker selesai

Hal ini mencegah folder `temp/` terus membesar.

---

# 🩺 Troubleshooting

## QR Code Tidak Muncul

Pastikan bot sedang berjalan dan periksa terminal VS Code.

Jika ingin pairing ulang:

```bash
rm -rf auth
pnpm --filter yorozu run start
```

> Untuk Windows PowerShell:

```powershell
Remove-Item -Recurse -Force auth
pnpm --filter yorozu run start
```

Perintah tersebut akan menghapus session WhatsApp yang tersimpan.

---

## Session WhatsApp Rusak

Stop bot terlebih dahulu, kemudian hapus:

```text
auth/
```

Setelah itu jalankan kembali bot dan scan QR baru.

---

## Downloader Gagal

Periksa dependency:

```bash
yt-dlp --version
ffmpeg -version
```

Kemudian coba URL publik lainnya.

---

## File Terlalu Besar

Ubah konfigurasi di `.env`:

```env
DOWNLOADER_MAX_SIZE_MB=100
```

> Gunakan nilai yang wajar karena file besar membutuhkan bandwidth, storage, CPU, dan memory lebih banyak.

---

# 🧪 Local Validation

Periksa syntax semua file JavaScript:

```bash
for file in src/*.js; do node --check "$file"; done
```

Windows PowerShell:

```powershell
Get-ChildItem src\*.js | ForEach-Object { node --check $_.FullName }
```

Periksa formatting Git:

```bash
git diff --check
```

---

# 🖥️ Development with VS Code

VS Code direkomendasikan untuk mengembangkan YOROZU karena menyediakan:

* Integrated Terminal
* JavaScript/Node.js IntelliSense
* Debugger
* Git integration
* Extension ecosystem
* File explorer
* Syntax highlighting
* Error diagnostics

Workflow development sederhana:

```text
Open Project
     ↓
Install Dependencies
     ↓
Configure .env
     ↓
Run Bot
     ↓
Scan WhatsApp QR
     ↓
Edit Source Code
     ↓
Restart / Dev Mode
     ↓
Test Command
```

> **Catatan:** VS Code bukan requirement runtime. Yang menjalankan bot adalah **Node.js**. Kamu tetap dapat menjalankan YOROZU dari terminal biasa tanpa VS Code.

---

# ⚖️ Usage & Disclaimer

YOROZU dibuat untuk tujuan pembelajaran dan penggunaan pribadi.

Gunakan bot hanya untuk konten yang kamu miliki atau memang memiliki izin untuk mengunduhnya.

Developer tidak bertanggung jawab atas penyalahgunaan bot atau pelanggaran Terms of Service platform pihak ketiga.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 🇬🇧 English

YOROZU is a **Node.js + Baileys** WhatsApp bot for media downloading, sticker creation, and lightweight utility commands.

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

---

# 🛠️ Requirements

Before running YOROZU, make sure you have:

* **Node.js 20+**
* **pnpm**
* **FFmpeg**
* **yt-dlp**
* **Visual Studio Code** *(recommended for development)*
* A WhatsApp account for pairing

Check your environment:

```bash
node --version
pnpm --version
yt-dlp --version
ffmpeg -version
```

> 💡 YOROZU can be run directly from **Visual Studio Code**. VS Code is used as the editor and terminal; the bot itself runs on Node.js.

---

# 💻 Running YOROZU in VS Code

## 1. Open the Repository

Open the YOROZU repository in Visual Studio Code:

```text
File → Open Folder
```

Select the project directory.

## 2. Open the VS Code Terminal

Use:

```text
Terminal → New Terminal
```

or:

```text
Ctrl + `
```

## 3. Install Dependencies

From the repository root:

```bash
pnpm install
```

If the bot is inside the `yorozu` directory:

```bash
cd yorozu
pnpm install
```

## 4. Configure Environment

Linux/macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edit `.env` if you need to change the default configuration.

## 5. Start the Bot

Production:

```bash
pnpm --filter yorozu run start
```

Or:

```bash
cd yorozu
pnpm start
```

Development:

```bash
pnpm --filter yorozu run dev
```

---

# 📱 WhatsApp Pairing

1. Start the bot from the VS Code terminal.
2. Wait for the QR code.
3. Open **WhatsApp → Linked devices**.
4. Select **Link a device**.
5. Scan the QR code.
6. The session will be stored in `auth/`.

The saved session will normally be reused after restarting the bot.

---

# 🔐 Security

Never commit:

```text
.env
auth/
temp/
```

The `auth/` directory contains the WhatsApp session and should be treated as sensitive data.

---

# 📥 Downloader Limitations

Only use public media that you are authorized to access and download.

Downloads may fail for:

* Private content
* Deleted media
* Login-required content
* Age-restricted content
* Region-restricted content
* Invalid or expired URLs
* Platform changes
* Files exceeding the configured limit

YOROZU may use a TikWM fallback for certain public TikTok URLs when `yt-dlp` fails.

Third-party fallback availability is not guaranteed.

---

# 🧪 Local Validation

Linux/macOS:

```bash
for file in src/*.js; do node --check "$file"; done
```

Windows PowerShell:

```powershell
Get-ChildItem src\*.js | ForEach-Object { node --check $_.FullName }
```

Check Git formatting:

```bash
git diff --check
```

---

# 🖥️ VS Code Development

VS Code provides:

* Integrated terminal
* Node.js/JavaScript IntelliSense
* Debugging
* Git integration
* Syntax highlighting
* Error diagnostics
* File explorer

Development workflow:

```text
Open Project
     ↓
Install Dependencies
     ↓
Configure .env
     ↓
Run Bot
     ↓
Scan WhatsApp QR
     ↓
Edit Source Code
     ↓
Test Commands
```

> **Note:** VS Code is not the runtime. **Node.js** runs the bot. YOROZU can also be started from a normal system terminal.

---

# ⚖️ Disclaimer

YOROZU is intended for educational and personal use.

Only download content that you own or have permission to download.

The developer is not responsible for misuse of the bot or violations of third-party platform Terms of Service.

---

# 📄 License

MIT
