# Product Requirements Document: "Mitra Undangan" MVP (Revisi Final)

## 1. Ikhtisar

* **Nama Produk:** Mitra Undangan (Placeholder)
* **Problem Statement:** Wedding Organizer (WO) profesional tidak memiliki platform *white-label* modern untuk mengelola undangan digital klien mereka. [cite_start]Solusi B2C yang ada (seperti katsudoto.id) hanya menawarkan program rujukan yang lemah [cite: 13, 14, 15][cite_start], bukan dasbor manajemen terpusat[cite: 18].
* [cite_start]**Tujuan MVP:** Meluncurkan platform "WO-First" yang fungsional [cite: 43] [cite_start]untuk mengamankan **1 WO (Wedding Organizer)** sebagai klien[cite: 51], memvalidasi alur kerja inti B2B (manajemen acara & tamu), dan mendapatkan "feedback positif".
* [cite_start]**Target Peluncuran:** 1-2 Minggu[cite: 50, 58].

## 2. Target Pengguna

### Profil Pengguna Utama (B2B)
* **Siapa:** Wedding Organizer (WO) modern atau agensi event kecil.
* **Problem:** Mereka mengelola banyak klien pernikahan sekaligus. [cite_start]Mereka ingin memberikan layanan undangan digital kepada klien mereka, tetapi ingin melakukannya di bawah *brand* mereka sendiri, bukan sebagai agen penjual *brand* lain[cite: 19, 20].
* [cite_start]**Solusi Saat Ini:** Menggunakan platform B2C dan berpura-pura menjadi klien, atau menggunakan program "Mitra" yang buruk[cite: 13, 18], atau tidak menawarkannya sama sekali.
* [cite_start]**Mengapa Mereka Akan Pindah:** "Mitra Undangan" memberi mereka dasbor terpusat untuk *semua* klien [cite: 45, 47][cite_start], kontrol *brand* (di masa depan) [cite: 48][cite_start], dan UI/UX yang profesional dan superior[cite: 49].

### Persona Pengguna Sekunder (B2C/Tamu)
* **Siapa:** Pasangan (klien WO) dan Tamu Undangan.
* **Peran di MVP:** Mereka adalah *konsumen* dari hasil akhir, tetapi **bukan pengguna aktif** platform. [cite_start]Mereka tidak memiliki login[cite: 52, 53, 57].
* **Kebutuhan:**
    * **Pasangan:** Mendapatkan halaman undangan yang indah dan fungsional.
    * **Tamu:** Menerima undangan, melihat detail acara, melakukan RSVP, dan mendapatkan QR code.

## 3. Perjalanan Pengguna (User Journey) - DIPERBARUI

### Alur Cerita Inti MVP
1.  [cite_start]**Admin (Anda):** Anda membuatkan akun untuk **"WO Pertama"** secara manual di dasbor Supabase[cite: 86].
2.  [cite_start]**WO (Pengguna B2B):** Login ke dasbor platform[cite: 66].
3.  [cite_start]**WO:** Membuat "Acara" baru (misal: "Pernikahan A & B")[cite: 57, 68].
4.  [cite_start]**WO:** Masuk ke acara tersebut dan mulai menambahkan "Tamu" (CRUD Tamu), lengkap dengan nama dan info kontak[cite: 57, 68].
5.  [cite_start]**Sistem:** Secara otomatis menghasilkan QR code unik untuk setiap tamu[cite: 57, 76].
6.  **WO:** Mengklik tombol **"Ekspor Tamu (CSV)"**.
7.  **WO:** Menyerahkan file CSV (yang berisi nama tamu, link undangan unik, dan QR) kepada **kliennya (pasangan)**.
8.  **Klien (Pasangan):** (Di luar platform kita) Menggunakan file CSV tersebut untuk membagikan link undangan ke kerabat mereka melalui WhatsApp, email, dll.
9.  [cite_start]**Tamu (B2C):** Menerima link [cite: 70, 71][cite_start], membukanya, dan mengisi form RSVP[cite: 57, 75].
10. [cite_start]**WO:** Memantau di dasbornya bahwa status tamu telah berubah (misal: dari 'pending' menjadi 'confirmed_rsvp')[cite: 82].
11. [cite_start]**Hari-H (Check-in):** Staf WO membuka halaman check-in, memindai QR tamu, dan status tamu berubah menjadi 'checked_in'[cite: 57, 77, 82].

## 4. Fitur MVP - DIPERBARUI

[cite_start]Fitur-fitur ini diprioritaskan menggunakan metode MoSCoW, diambil langsung dari riset Anda[cite: 55, 56].

### ✅ Core Features (Must Have)
| Kategori | Fitur | Deskripsi (Nilai Pengguna) | Prioritas |
| :--- | :--- | :--- | :--- |
| B2B | Pendaftaran Akun WO | WO dapat mendaftar dan login ke akun mereka yang aman. (Inti dari model B2B) [cite_start][cite: 57] | Kritis |
| B2B | Dasbor WO: CRUD Acara | [cite_start]WO dapat Membuat, Melihat, Mengedit, dan Menghapus acara (klien) mereka. [cite: 57] | Kritis |
| B2B | Dasbor WO: CRUD Tamu | [cite_start]WO dapat mengelola daftar tamu *untuk acara tertentu*. [cite: 57] | Kritis |
| **B2B** | **Dasbor WO: Ekspor Tamu (CSV)** | **WO dapat mengekspor daftar tamu dan link undangan unik mereka ke file CSV. Ini memungkinkan WO untuk menyerahkan "master list" yang rapi kepada klien (pasangan) untuk didistribusikan.** | **Kritis** |
| B2C | Halaman Undangan Publik | [cite_start]Halaman statis (Next.js) yang menampilkan detail acara (Nama, Tanggal, Lokasi). [cite: 57] | Kritis |
| B2C | Fitur RSVP | [cite_start]Formulir sederhana bagi tamu untuk mengonfirmasi kehadiran mereka, yang memperbarui data di dasbor WO. [cite: 57] | Kritis |
| B2C | Generator QR Code Unik | [cite_start]Setiap tamu mendapatkan QR unik untuk proses check-in yang aman. [cite: 57] | Kritis |
| Tamu | Aplikasi Check-in | [cite_start]Halaman internal sederhana untuk memindai QR tamu dan mengubah status mereka menjadi "checked_in". [cite: 57] | Kritis |

### ⏳ Fitur Masa Depan (Tidak ada di MVP)
[cite_start]Sesuai riset Anda, fitur-fitur ini **sengaja dipotong** untuk mempercepat peluncuran 1-2 minggu[cite: 52]:
* [cite_start]**Login untuk Pasangan (B2C):** Dipotong[cite: 57]. [cite_start]Semua manajemen dilakukan oleh WO[cite: 53].
* [cite_start]**Pengaturan Domain Kustom:** Terlalu kompleks untuk MVP[cite: 57]. Akan menggunakan subdomain platform dulu.
* [cite_start]**Galeri Foto, Peta, Countdown:** Fitur standar, tapi tidak esensial untuk memvalidasi alur inti RSVP -> Check-in[cite: 57].
* [cite_start]**Wedding Planner (Budget, To-Do):** Fitur tambahan yang menambah kompleksitas[cite: 57].

## 5. Metrik Sukses

### Metrik Utama (30 Hari Pertama)
1.  [cite_start]**Akuisisi (Kuantitatif):** 1 WO telah berhasil di-onboard dan aktif menggunakan platform[cite: 51].
2.  **Kualitatif:** Mendapat "Feedback positif" dari 1 WO tersebut mengenai kemudahan penggunaan dasbor dan keandalan alur RSVP.
3.  **Aktivasi (Kuantitatif):** WO tersebut telah membuat setidaknya 1 acara nyata dengan >20 tamu di dalamnya.

## 6. Arahan UI/UX

* **Design Vibe:** "Modern", bersih, profesional, dan cepat.
* **Inspirasi:** "Mostly menggunakan Shadcn". [cite_start]Ini menyiratkan pendekatan *utility-first* dengan Tailwind CSS[cite: 179], fokus pada fungsionalitas dan aksesibilitas komponen.
* [cite_start]**Diferensiator:** UI/UX yang superior adalah keunggulan kompetitif utama[cite: 49].

## 7. Pertimbangan Teknis

Arahan teknis ini diambil langsung dari riset Anda.
* [cite_start]**Platform:** Aplikasi Web (Next.js App Router) [cite: 1, 62][cite_start], di-hosting di Vercel[cite: 84].
* [cite_start]**Database & Auth:** Supabase (PostgreSQL)[cite: 1, 62].
* [cite_start]**Arsitektur:** Arsitektur Multi-Tenant B2B ("WO-First") [cite: 47, 51] [cite_start]dengan isolasi data menggunakan RLS Hirarkis [cite: 98, 138] [cite_start]dan Next.js Server Actions[cite: 105, 106].
* [cite_start]**UI Library:** Shadcn/ui [cite: 68, 181] [cite_start]dan Tailwind CSS[cite: 179].
* [cite_start]**QR Code:** `react-qr-code` (untuk generate) [cite: 183] [cite_start]dan `react-qr-scanner` (untuk memindai)[cite: 186].
* **State Management:** Dihindari. [cite_start]Mengandalkan Server Components dan URL State[cite: 190, 191].

## 8. Kendala & Persyaratan

* **Anggaran:** $0 untuk peluncuran. [cite_start]Memaksimalkan *Free Tier* Vercel dan Supabase[cite: 193, 216].
* [cite_start]**Timeline:** 1-2 Minggu (Sangat Ketat)[cite: 50, 58].
* **Tim:** Solo-developer (dengan bantuan AI).
* [cite_start]**Risiko Teknis:** Kesalahan konfigurasi RLS (Row Level Security)[cite: 235]. [cite_start]Harus diuji secara ketat untuk memastikan WO A tidak bisa melihat data WO B[cite: 81].