# 🌙 YOROZU WhatsApp Bot

> **Simple. Fast. Useful.**

YOROZU adalah bot WhatsApp berbasis **Node.js + Baileys** untuk mengunduh media TikTok/YouTube, membuat sticker, dan menjalankan command utility sederhana.

> README ini tersedia dalam Bahasa Indonesia dan English.

---

# 🇮🇩 Bahasa Indonesia

## ✨ Fitur

* 🎵 Download audio YouTube → MP3
* 🎬 Download video YouTube → MP4
* 🎥 Download video TikTok
* 🖼️ Download foto TikTok
* 🖼️ Support TikTok photo carousel
* 🖼️ Membuat sticker dari gambar
* 🎞️ Membuat sticker dari GIF/video pendek
* 📝 Membuat text/meme sticker
* 📡 `/ping` untuk mengecek status dan latency bot
* 🛡️ Per-command cooldown
* 🚦 Global cooldown
* 🔒 Duplicate request protection
* ⚙️ Concurrent job limit
* 🔄 Automatic WhatsApp reconnect
* 🧹 Automatic temporary-file cleanup

---

## 📋 Daftar Command

### 📥 Downloader

| Command         | Deskripsi                  |
| --------------- | -------------------------- |
| `/tiktok <url>` | Download video/foto TikTok |
| `/ytmp3 <url>`  | Download audio YouTube     |
| `/ytmp4 <url>`  | Download video YouTube     |

#### `/tiktok`

Mendukung:

* Video TikTok publik
* Foto TikTok
* Photo carousel

Contoh:

```text
/tiktok https://www.tiktok.com/@user/video/123456789
```

#### `/ytmp3`

Mengunduh audio dari YouTube dalam format MP3.

```text
/ytmp3 https://www.youtube.com/watch?v=xxxxxxxxxxx
```

#### `/ytmp4`

Mengunduh video dari YouTube dalam format MP4.

```text
/ytmp4 https://youtu.be/xxxxxxxxxxx
```

---

### 🎨 Sticker

| Command                 | Deskripsi            |
| ----------------------- | -------------------- |
| `/sticker`              | Membuat sticker      |
| `/s`                    | Shortcut sticker     |
| `/stiker`               | Shortcut sticker     |
| `/createsticker <text>` | Membuat text sticker |

Untuk `/sticker`, kamu dapat:

* Mengirim gambar bersama command
* Mengirim GIF bersama command
* Mengirim video pendek bersama command
* Reply gambar/GIF/video lalu gunakan `/sticker`

### Default Limit

| Type       |    Limit |
| ---------- | -------: |
| Video/GIF  | 10 detik |
| Input file |    10 MB |

Contoh:

```text
/createsticker Waduh, ketahuan!
```

---

### ⚙️ System

| Command | Deskripsi                       |
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

### Check Requirements

Buka terminal di VS Code dan jalankan:

```bash
node --version
pnpm --version
yt-dlp --version
ffmpeg -version
```

Jika semua command menampilkan versi, environment sudah siap.

---

# 💻 Menjalankan YOROZU di VS Code

YOROZU dapat dikembangkan dan dijalankan langsung menggunakan **Visual Studio Code**.

## 1. Buka Repository

Buka folder project menggunakan:

```text
File → Open Folder
```

Kemudian pilih folder repository YOROZU.

---

## 2. Buka Terminal VS Code

Gunakan:

```text
Terminal → New Terminal
```

atau shortcut:

```text
Ctrl + `
```

Pastikan terminal berada di folder repository.

---

## 3. Install Dependencies

Dari root repository:

```bash
pnpm install
```

Atau jika bot berada di dalam folder `yorozu`:

```bash
cd yorozu
pnpm install
```

---

## 4. Buat File `.env`

Buat file bernama:

```text
.env
```

Kemudian isi dengan konfigurasi berikut:

```env
BOT_NAME=YOROZU

MAX_CONCURRENT_JOBS=2

REQUEST_TIMEOUT=30000

STICKER_MAX_DURATION=10

STICKER_MAX_SIZE_MB=10

GLOBAL_COOLDOWN=3

TEMP_DIR=./temp

AUTH_DIR=./auth

DOWNLOADER_API_URL=

DOWNLOADER_API_KEY=

DOWNLOADER_MAX_SIZE_MB=50
```

### Configuration

| Variable                 |  Default | Deskripsi                                      |
| ------------------------ | -------: | ---------------------------------------------- |
| `BOT_NAME`               | `YOROZU` | Nama device WhatsApp                           |
| `MAX_CONCURRENT_JOBS`    |      `2` | Maksimal proses berat yang berjalan bersamaan  |
| `REQUEST_TIMEOUT`        |  `30000` | Timeout downloader dalam milidetik             |
| `STICKER_MAX_DURATION`   |     `10` | Maksimal durasi video/GIF sticker dalam detik  |
| `STICKER_MAX_SIZE_MB`    |     `10` | Maksimal ukuran input sticker                  |
| `GLOBAL_COOLDOWN`        |      `3` | Jeda global request berat per user dalam detik |
| `TEMP_DIR`               | `./temp` | Folder file sementara                          |
| `AUTH_DIR`               | `./auth` | Folder session WhatsApp                        |
| `DOWNLOADER_API_URL`     |   kosong | URL API downloader                             |
| `DOWNLOADER_API_KEY`     |   kosong | API key downloader                             |
| `DOWNLOADER_MAX_SIZE_MB` |     `50` | Maksimal ukuran media hasil download           |

---

# ▶️ Menjalankan Bot

### Production

Dari root repository:

```bash
pnpm --filter yorozu run start
```

Atau dari folder bot:

```bash
cd yorozu
pnpm start
```

### Development

Untuk menjalankan bot dalam mode development:

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
6. Tunggu sampai koneksi berhasil.

Setelah pairing berhasil, session WhatsApp akan disimpan secara otomatis di:

```text
auth/
```

Pada restart berikutnya, bot akan menggunakan session yang tersimpan sehingga biasanya tidak perlu scan QR kembali.

> **Catatan:** Folder `auth/` akan dibuat otomatis setelah bot melakukan pairing. Tidak perlu membuatnya secara manual.

---

# 📁 Struktur Project

Saat repository pertama kali dijalankan, folder `auth/` dan `temp/` belum tentu tersedia.

### Sebelum Bot Dijalankan

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
├── .env
└── package.json
```

### Setelah Bot Dijalankan

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
├── auth/              # Dibuat otomatis
├── temp/              # Dibuat otomatis
├── .env
└── package.json
```

### `auth/`

Folder `auth/` digunakan untuk menyimpan session WhatsApp.

Folder ini akan dibuat otomatis ketika proses pairing dilakukan.

### `temp/`

Folder `temp/` digunakan untuk menyimpan file sementara selama proses:

* Download TikTok
* Download YouTube
* Processing media
* Pembuatan sticker
* Konversi media menggunakan FFmpeg

Folder `temp/` juga akan dibuat otomatis ketika bot membutuhkan temporary directory.

File sementara akan dibersihkan secara otomatis setelah proses selesai.

> 💡 **Kamu tidak perlu membuat folder `auth/` dan `temp/` secara manual.**

---

# ⏱️ Default Cooldown

| Command          | Cooldown |
| ---------------- | -------: |
| `/tiktok`        | 15 detik |
| `/ytmp3`         | 20 detik |
| `/ytmp4`         | 20 detik |
| `/sticker`       | 10 detik |
| `/s`             | 10 detik |
| `/stiker`        | 10 detik |
| `/createsticker` |  5 detik |
| `/menu`          |  3 detik |
| `/help`          |  3 detik |
| `/ping`          |  3 detik |

Selain cooldown per command, command downloader dan sticker juga dibatasi oleh:

```text
MAX_CONCURRENT_JOBS
GLOBAL_COOLDOWN
```

Proteksi ini membantu mengurangi spam request dan penggunaan resource secara berlebihan.

---

# 🧩 Core Modules

| File            | Responsibility                      |
| --------------- | ----------------------------------- |
| `index.js`      | WhatsApp connection & bot lifecycle |
| `handler.js`    | Message parsing & command execution |
| `commands.js`   | Command definitions, menu & help    |
| `downloader.js` | Downloader & API integration        |
| `sticker.js`    | Sticker processing                  |
| `limiter.js`    | Cooldown & request limits           |
| `config.js`     | Environment configuration           |
| `utils.js`      | Shared utility functions            |

---

# 📥 Downloader Limitations

Downloader ditujukan untuk media publik yang memang boleh kamu akses dan unduh.

Download dapat gagal apabila:

* Media bersifat private
* Media telah dihapus
* Content membutuhkan login
* Content dibatasi usia
* Content dibatasi wilayah
* URL tidak valid
* URL sudah expired
* Platform mengubah sistemnya
* Ukuran file melebihi limit
* Downloader API sedang tidak tersedia

### TikTok Fallback

Untuk URL TikTok publik tertentu, YOROZU dapat menggunakan fallback downloader yang tersedia pada konfigurasi.

Fallback bergantung pada ketersediaan layanan pihak ketiga dan tidak menjamin semua URL dapat diproses.

File hasil download hanya disimpan sementara dan akan dihapus setelah proses selesai.

---

# 🧹 Temporary File Cleanup

YOROZU melakukan cleanup file sementara:

* Saat startup
* Setelah proses download selesai
* Setelah media berhasil dikirim
* Setelah proses sticker selesai

Hal ini membantu mencegah folder `temp/` terus bertambah besar.

---

# 🩺 Troubleshooting

## QR Code Tidak Muncul

Pastikan bot sedang berjalan dan periksa terminal VS Code.

```bash
pnpm --filter yorozu run start
```

Jika ingin melakukan pairing ulang, hapus folder `auth/`.

### Linux/macOS

```bash
rm -rf auth
```

### Windows PowerShell

```powershell
Remove-Item -Recurse -Force auth
```

Kemudian jalankan kembali bot:

```bash
pnpm --filter yorozu run start
```

Scan QR baru ketika muncul.

---

## WhatsApp Session Rusak

Jika session mengalami masalah:

1. Stop bot.
2. Hapus folder `auth/`.
3. Jalankan bot kembali.
4. Scan QR baru.

```text
auth/
```

---

## Downloader Gagal

Periksa dependency:

```bash
yt-dlp --version
ffmpeg -version
```

Jika menggunakan downloader API, periksa konfigurasi:

```env
DOWNLOADER_API_URL=
DOWNLOADER_API_KEY=
```

Kemudian coba URL publik lainnya.

---

## File Terlalu Besar

Default:

```env
DOWNLOADER_MAX_SIZE_MB=50
```

Jika diperlukan, limit dapat dinaikkan:

```env
DOWNLOADER_MAX_SIZE_MB=100
```

> ⚠️ File yang lebih besar membutuhkan bandwidth, storage, CPU, dan memory lebih banyak.

---

## `pnpm` Tidak Dikenali

Periksa:

```bash
pnpm --version
```

Pastikan pnpm sudah terinstall dan tersedia pada system `PATH`.

---

## Node.js Version Terlalu Lama

Periksa:

```bash
node --version
```

YOROZU membutuhkan:

```text
Node.js >= 20
```

---

# 🖥️ Development with VS Code

VS Code direkomendasikan untuk development karena menyediakan:

* Integrated Terminal
* JavaScript/Node.js IntelliSense
* Debugging
* Git integration
* Syntax highlighting
* Error diagnostics
* File explorer
* Extension ecosystem

### Development Workflow

```text
Clone Repository
       ↓
Open with VS Code
       ↓
Install Dependencies
       ↓
Create .env
       ↓
Run Bot
       ↓
Scan WhatsApp QR
       ↓
Edit Source Code
       ↓
Test Commands
```

> **Note:** VS Code bukan runtime bot. Yang menjalankan YOROZU adalah **Node.js**, sedangkan VS Code digunakan sebagai code editor dan development environment.

YOROZU juga dapat dijalankan melalui terminal biasa tanpa VS Code.

---

# 🧪 Local Validation

### Linux/macOS

```bash
for file in src/*.js; do node --check "$file"; done
```

### Windows PowerShell

```powershell
Get-ChildItem src\*.js | ForEach-Object { node --check $_.FullName }
```

Check Git formatting:

```bash
git diff --check
```

---

# ⚖️ Usage & Disclaimer

YOROZU dibuat untuk tujuan pembelajaran dan penggunaan pribadi.

Gunakan bot hanya untuk media yang:

* Kamu miliki, atau
* Kamu memiliki izin untuk mengakses dan mengunduhnya.

Developer tidak bertanggung jawab atas:

* Penyalahgunaan bot
* Pelanggaran copyright
* Pelanggaran Terms of Service platform pihak ketiga
* Penggunaan bot untuk konten yang tidak memiliki izin

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 🇬🇧 English

YOROZU is a **Node.js + Baileys** WhatsApp bot for media downloading, sticker creation, and lightweight utility commands.

The bot includes cooldowns, rate limiting, duplicate-request protection, concurrent job limits, automatic reconnect, and temporary-file cleanup.

---

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
* 🔄 Automatic WhatsApp reconnect
* 🧹 Automatic temporary-file cleanup

---

# 📋 Command List

## 📥 Downloader

| Command         | Description                 |
| --------------- | --------------------------- |
| `/tiktok <url>` | Download TikTok video/photo |
| `/ytmp3 <url>`  | Download YouTube audio      |
| `/ytmp4 <url>`  | Download YouTube video      |

### `/tiktok`

Supports:

* Public TikTok videos
* TikTok photos
* TikTok photo carousels

Example:

```text
/tiktok https://www.tiktok.com/@user/video/123456789
```

### `/ytmp3`

Downloads YouTube audio in MP3 format.

```text
/ytmp3 https://www.youtube.com/watch?v=xxxxxxxxxxx
```

### `/ytmp4`

Downloads YouTube video in MP4 format.

```text
/ytmp4 https://youtu.be/xxxxxxxxxxx
```

---

## 🎨 Stickers

| Command                 | Description         |
| ----------------------- | ------------------- |
| `/sticker`              | Create sticker      |
| `/s`                    | Sticker shortcut    |
| `/stiker`               | Sticker shortcut    |
| `/createsticker <text>` | Create text sticker |

For `/sticker`, you can:

* Send an image with the command
* Send a GIF with the command
* Send a short video with the command
* Reply to media and use `/sticker`

### Default Limits

| Type       |      Limit |
| ---------- | ---------: |
| Video/GIF  | 10 seconds |
| Input file |      10 MB |

Example:

```text
/createsticker Got caught!
```

---

## ⚙️ System

| Command | Description                |
| ------- | -------------------------- |
| `/menu` | Show command list          |
| `/help` | Show command guide         |
| `/ping` | Check bot status & latency |

---

# 🛠️ Requirements

Before running YOROZU, make sure you have:

* **Node.js 20+**
* **pnpm**
* **FFmpeg**
* **yt-dlp**
* **Visual Studio Code** *(recommended)*
* A WhatsApp account for pairing

Check your environment:

```bash
node --version
pnpm --version
yt-dlp --version
ffmpeg -version
```

---

# 💻 Running YOROZU in VS Code

YOROZU can be developed and run directly using **Visual Studio Code**.

## 1. Open the Repository

Open the project using:

```text
File → Open Folder
```

Select the YOROZU repository.

---

## 2. Open the Terminal

Use:

```text
Terminal → New Terminal
```

or:

```text
Ctrl + `
```

Make sure the terminal is inside the repository directory.

---

## 3. Install Dependencies

From the repository root:

```bash
pnpm install
```

Or:

```bash
cd yorozu
pnpm install
```

---

## 4. Create `.env`

Create a file named:

```text
.env
```

Then add:

```env
BOT_NAME=YOROZU

MAX_CONCURRENT_JOBS=2

REQUEST_TIMEOUT=30000

STICKER_MAX_DURATION=10

STICKER_MAX_SIZE_MB=10

GLOBAL_COOLDOWN=3

TEMP_DIR=./temp

AUTH_DIR=./auth

DOWNLOADER_API_URL=

DOWNLOADER_API_KEY=

DOWNLOADER_MAX_SIZE_MB=50
```

### Configuration

| Variable                 |  Default | Description                         |
| ------------------------ | -------: | ----------------------------------- |
| `BOT_NAME`               | `YOROZU` | WhatsApp device name                |
| `MAX_CONCURRENT_JOBS`    |      `2` | Maximum concurrent heavy processes  |
| `REQUEST_TIMEOUT`        |  `30000` | Downloader timeout in milliseconds  |
| `STICKER_MAX_DURATION`   |     `10` | Maximum video/GIF sticker duration  |
| `STICKER_MAX_SIZE_MB`    |     `10` | Maximum sticker input size          |
| `GLOBAL_COOLDOWN`        |      `3` | Global delay between heavy requests |
| `TEMP_DIR`               | `./temp` | Temporary-file directory            |
| `AUTH_DIR`               | `./auth` | WhatsApp session directory          |
| `DOWNLOADER_API_URL`     |    empty | Downloader API URL                  |
| `DOWNLOADER_API_KEY`     |    empty | Downloader API key                  |
| `DOWNLOADER_MAX_SIZE_MB` |     `50` | Maximum downloaded media size       |

---

# ▶️ Running the Bot

### Production

From the repository root:

```bash
pnpm --filter yorozu run start
```

Or:

```bash
cd yorozu
pnpm start
```

### Development

```bash
pnpm --filter yorozu run dev
```

---

# 📱 WhatsApp Pairing

After starting the bot:

1. Wait for the QR code in the VS Code terminal.
2. Open **WhatsApp** on your phone.
3. Go to **Linked devices**.
4. Select **Link a device**.
5. Scan the QR code.
6. Wait until the connection is established.

After pairing, the WhatsApp session is automatically stored in:

```text
auth/
```

The saved session will normally be reused after restarting the bot.

> **Note:** The `auth/` folder is created automatically after WhatsApp pairing. You do not need to create it manually.

---

# 📁 Project Structure

When the repository is first started, the `auth/` and `temp/` directories may not exist yet.

### Before Running the Bot

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
├── .env
└── package.json
```

### After Running the Bot

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
├── auth/              # Generated automatically
├── temp/              # Generated automatically
├── .env
└── package.json
```

### `auth/`

Stores WhatsApp authentication/session data.

This directory is automatically created during the pairing process.

### `temp/`

Stores temporary files used during:

* TikTok downloads
* YouTube downloads
* Media processing
* Sticker creation
* FFmpeg conversion

The `temp/` directory is also created automatically when required.

Temporary files are automatically cleaned after processing.

> 💡 **You do not need to manually create `auth/` or `temp/`.**

---

# ⏱️ Default Cooldowns

| Command          |   Cooldown |
| ---------------- | ---------: |
| `/tiktok`        | 15 seconds |
| `/ytmp3`         | 20 seconds |
| `/ytmp4`         | 20 seconds |
| `/sticker`       | 10 seconds |
| `/s`             | 10 seconds |
| `/stiker`        | 10 seconds |
| `/createsticker` |  5 seconds |
| `/menu`          |  3 seconds |
| `/help`          |  3 seconds |
| `/ping`          |  3 seconds |

Downloader and sticker commands are also controlled by:

```text
MAX_CONCURRENT_JOBS
GLOBAL_COOLDOWN
```

---

# 🧩 Core Modules

| File            | Responsibility                      |
| --------------- | ----------------------------------- |
| `index.js`      | WhatsApp connection & bot lifecycle |
| `handler.js`    | Message parsing & command execution |
| `commands.js`   | Command definitions, menu & help    |
| `downloader.js` | Downloader & API integration        |
| `sticker.js`    | Sticker processing                  |
| `limiter.js`    | Cooldown & request limits           |
| `config.js`     | Environment configuration           |
| `utils.js`      | Shared utility functions            |

---

# 📥 Downloader Limitations

The downloader is intended for public media that you are authorized to access and download.

Downloads may fail because of:

* Private media
* Deleted content
* Login requirements
* Age restrictions
* Region restrictions
* Invalid URLs
* Expired URLs
* Platform changes
* Files exceeding the configured limit
* Downloader API downtime

### TikTok Fallback

For certain public TikTok URLs, YOROZU may use the configured downloader fallback.

Third-party fallback availability is not guaranteed.

Downloaded files are stored temporarily and deleted after processing.

---

# 🧹 Temporary File Cleanup

YOROZU automatically cleans temporary files:

* At startup
* After downloads
* After media is sent
* After sticker processing

This prevents the `temp/` directory from continuously growing.

---

# 🩺 Troubleshooting

## QR Code Does Not Appear

Make sure the bot is running and check the VS Code terminal.

```bash
pnpm --filter yorozu run start
```

To pair again, delete the `auth/` directory.

### Linux/macOS

```bash
rm -rf auth
```

### Windows PowerShell

```powershell
Remove-Item -Recurse -Force auth
```

Then restart the bot:

```bash
pnpm --filter yorozu run start
```

Scan the new QR code.

---

## WhatsApp Session Is Corrupted

1. Stop the bot.
2. Delete `auth/`.
3. Start the bot again.
4. Scan a new QR code.

---

## Downloader Failure

Check:

```bash
yt-dlp --version
ffmpeg -version
```

If using a downloader API, check:

```env
DOWNLOADER_API_URL=
DOWNLOADER_API_KEY=
```

Then try another public URL.

---

## File Too Large

Default:

```env
DOWNLOADER_MAX_SIZE_MB=50
```

Increase carefully if necessary:

```env
DOWNLOADER_MAX_SIZE_MB=100
```

Larger files require more bandwidth, storage, CPU, and memory.

---

## `pnpm` Is Not Recognized

Check:

```bash
pnpm --version
```

Make sure pnpm is installed and available in the system `PATH`.

---

## Node.js Version Is Too Old

Check:

```bash
node --version
```

YOROZU requires:

```text
Node.js >= 20
```

---

# 🖥️ Development with VS Code

VS Code provides:

* Integrated Terminal
* JavaScript/Node.js IntelliSense
* Debugging
* Git integration
* Syntax highlighting
* Error diagnostics
* File explorer
* Extension ecosystem

### Development Workflow

```text
Clone Repository
       ↓
Open with VS Code
       ↓
Install Dependencies
       ↓
Create .env
       ↓
Run Bot
       ↓
Scan WhatsApp QR
       ↓
Edit Source Code
       ↓
Test Commands
```

> **Note:** VS Code is not the runtime. **Node.js runs YOROZU**, while VS Code provides the development environment and integrated terminal.

YOROZU can also be started from a normal system terminal without VS Code.

---

# 🧪 Local Validation

### Linux/macOS

```bash
for file in src/*.js; do node --check "$file"; done
```

### Windows PowerShell

```powershell
Get-ChildItem src\*.js | ForEach-Object { node --check $_.FullName }
```

Check Git formatting:

```bash
git diff --check
```

---

# ⚖️ Usage & Disclaimer

YOROZU is intended for educational and personal use.

Only download media that you own or have permission to access and download.

The developer is not responsible for:

* Misuse of the bot
* Copyright violations
* Violations of third-party platform Terms of Service
* Unauthorized downloading or distribution of media

---

# 📄 License

This project is licensed under the **MIT License**.
