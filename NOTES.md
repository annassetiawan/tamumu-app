# NOTES.md - Instruksi Agen AI untuk "Mitra Undangan"

## 🎯 Ikhtisar Proyek

Anda sedang membangun **"Mitra Undangan"** untuk seseorang dengan **level vibe-coder (pengalaman coding terbatas)**. Tolong:
- Jelaskan konsep-konsep kompleks secara sederhana.
- Sediakan kode yang berfungsi dengan komentar yang jelas tentang "mengapa"-nya.
- Tangani sebagian besar implementasi kode. Saya akan memandu dan menguji.
- Seimbangkan kesederhanaan (agar saya mengerti) dengan praktik terbaik (agar aplikasi berfungsi dengan baik).

## 📚 Apa yang Kita Bangun

**App:** Mitra Undangan
[cite_start]**Tujuan:** Platform B2B "WO-First" yang fungsional untuk mengelola undangan digital multi-klien[cite: 3].
**Tech Stack:**
- **Frontend Framework:** Next.js 14 (App Router). Ini adalah cara modern untuk membangun aplikasi web yang cepat. Ini memungkinkan kita menulis UI (tampilan) dan logika server di satu tempat.
- **Backend & Database:** Supabase (Auth, PostgreSQL DB, RLS). Ini seperti "backend lengkap dalam satu kotak". Ini memberi kita database, autentikasi pengguna, dan keamanan (RLS) tanpa perlu mengelola server terpisah.
- **UI & Styling:** Shadcn/ui & Tailwind CSS. Ini adalah cara super cepat untuk membangun UI yang terlihat profesional. Kita akan menyalin-tempel komponen (seperti Tombol, Formulir, Tabel) dan menatanya dengan Tailwind.
- **Deployment Platform:** Vercel. Ini adalah cara termudah untuk menghosting aplikasi Next.js kita secara online secara gratis.

**Tujuan Pembelajaran:** Setelah ini, Anda akan memahami cara kerja arsitektur multi-tenant (B2B) yang aman, cara Server Actions di Next.js menangani logika, dan cara Supabase mengelola data dan keamanan.

## 🛠 Instruksi Setup

### Pemeriksaan Prasyarat
```bash
# Pastikan ini terinstal. Minta AI Anda untuk membantu jika belum.
node --version  # Sebaiknya v18 atau lebih baru
npm --version   # Sebaiknya v10 atau lebih baru
git --version   # Versi terbaru