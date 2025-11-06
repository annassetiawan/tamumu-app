# Mitra Undangan - Platform Undangan Digital B2B

Platform undangan digital "WO-First" (Wedding Organizer First) yang memungkinkan Wedding Organizer mengelola undangan digital untuk semua klien mereka dalam satu dashboard terpusat.

## 🎯 Fitur Utama

- ✅ **Multi-Tenant B2B**: Setiap WO memiliki organisasi sendiri dengan data terisolasi
- ✅ **CRUD Acara**: Kelola banyak acara pernikahan
- ✅ **Manajemen Tamu**: Tambah, edit, hapus tamu untuk setiap acara
- ✅ **QR Code Otomatis**: Setiap tamu mendapat QR code unik
- ✅ **RSVP Publik**: Halaman undangan publik dengan form RSVP
- ✅ **Check-in QR**: Aplikasi scanner QR untuk check-in di hari-H
- ✅ **Ekspor CSV**: Ekspor daftar tamu dengan link undangan
- ✅ **Keamanan Defense-in-Depth**: RLS + Server Actions untuk keamanan maksimal

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **UI**: Shadcn/ui, Tailwind CSS
- **Deployment**: Vercel
- **QR Code**: react-qr-code, html5-qrcode

## 📋 Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- Node.js 18+ dan npm 10+
- Akun Supabase (gratis): https://supabase.com
- Akun Vercel (gratis, opsional untuk deployment): https://vercel.com

## 🚀 Setup Instruksi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

#### a. Buat Proyek Supabase Baru

1. Buka https://app.supabase.com
2. Klik "New Project"
3. Isi nama proyek, database password, dan pilih region
4. Tunggu proyek selesai dibuat (~2 menit)

#### b. Jalankan Database Schema

1. Di Supabase Dashboard, buka **SQL Editor**
2. Klik "New Query"
3. Copy seluruh isi file `supabase-schema.sql`
4. Paste dan klik "Run"
5. Pastikan tidak ada error

#### c. Dapatkan API Keys

1. Di Supabase Dashboard, buka **Project Settings** > **API**
2. Copy 3 nilai ini:
   - **Project URL** (contoh: https://xxxxx.supabase.co)
   - **anon public** key
   - **service_role** key (⚠️ Rahasia! Jangan share!)

### 3. Setup Environment Variables

```bash
# Copy file example
cp .env.local.example .env.local
```

Edit `.env.local` dan isi dengan nilai dari Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000 di browser Anda.

## 📱 Cara Menggunakan

### Untuk Wedding Organizer (WO)

1. **Daftar Akun** - Buka `/register` dan buat akun
2. **Buat Acara** - Klik "Buat Acara Baru" di dashboard
3. **Kelola Tamu** - Tambah tamu, sistem otomatis generate QR code
4. **Ekspor CSV** - Download daftar tamu dengan link undangan
5. **Check-in** - Gunakan QR scanner di hari-H

### Untuk Tamu (B2C)

1. Terima link undangan dari pengantin
2. Buka link dan lihat detail acara
3. Isi form RSVP
4. Tunjukkan QR code untuk check-in

## 🏗 Arsitektur

### Defense-in-Depth Security

- RLS Layer: SELECT allowed, mutations blocked
- Server Actions: All INSERT/UPDATE/DELETE via service_role key
- Manual security checks in every action

### Multi-Tenancy

```
Organization (WO)
  └─ Wedding (Event)
       └─ Guest (Tamu)
```

## 🚢 Deployment ke Vercel

1. Push code ke GitHub
2. Import repository di Vercel
3. Tambahkan environment variables
4. Deploy!

Lihat dokumentasi lengkap di dalam file untuk detail.

## 📝 Environment Variables

| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes |

## 🐛 Troubleshooting

- **"Invalid API key"**: Restart dev server setelah edit `.env.local`
- **"relation does not exist"**: Jalankan `supabase-schema.sql` di Supabase
- **QR Scanner tidak muncul**: Izinkan akses kamera di browser

## 📄 License

MIT License - bebas digunakan untuk proyek komersial maupun personal.

---

**Dibuat dengan ❤️ untuk Wedding Organizer modern**
