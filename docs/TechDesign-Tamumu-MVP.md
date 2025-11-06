# Technical Design Document: "Mitra Undangan" MVP

## 1. Ikhtisar

Dokumen ini adalah panduan teknis untuk Anda (sebagai *Technical Director*) guna mengarahkan AI (sebagai *Engineer*) dalam membangun MVP "Mitra Undangan". Tujuannya adalah meluncurkan platform B2B yang aman, fungsional, dan *multi-tenant* dalam 1-2 minggu, sesuai dengan PRD.

## 2. Pendekatan & Stack Teknologi

* **Pendekatan:** **AI-Driven Development**. Anda akan memberikan AI arahan arsitektural, skema, dan logika yang spesifik dari dokumen ini. AI akan menulis 80-90% kode *boilerplate* dan *backend*, sementara Anda akan fokus pada integrasi, pengujian, dan penyesuaian UI.
* **Stack Teknologi Inti (Sesuai Riset):**
    * **Framework:** Next.js 14+ (App Router).
    * **Backend & DB:** Supabase (Auth, PostgreSQL DB, RLS).
    * **Hosting:** Vercel.
    * **UI:** Shadcn/ui & Tailwind CSS.
    * **Alat Bantu AI:** Cursor, Claude, atau Copilot (sesuai preferensi Anda).

## 3. Arsitektur: Hibrida "Defense-in-Depth" (Wajib)

Ini adalah bagian paling kritis. Kita akan menggunakan arsitektur hibrida yang direkomendasikan dalam riset Anda.

* **Jaring Pengaman (RLS):** Supabase RLS (Row Level Security) akan diaktifkan di *setiap* tabel. [cite_start]Kebijakan RLS akan dibuat **sederhana**: hanya mengizinkan operasi `SELECT` (baca) oleh pemilik data[cite: 107, 108].
* **Penegak Logika (Server Actions):** **Semua** operasi *tulis* (`INSERT`, `UPDATE`, `DELETE`) **dilarang** di level RLS untuk pengguna biasa. Sebagai gantinya, semua mutasi data ini **wajib** melalui **Next.js Server Actions**. Di dalam Server Action, kita akan menggunakan *service\_role key* Supabase (yang melewati RLS) untuk menjalankan logika bisnis dengan aman di sisi server.

> **Mengapa?** Ini jauh lebih mudah di-debug daripada RLS yang kompleks, lebih aman karena logika ada di server, dan sangat cepat[cite: 113, 114, 115, 116].

**Prompt untuk AI (Arsitektur):**

"Inisialisasi proyek Next.js App Router baru dengan Supabase. Kita akan menerapkan arsitektur 'Defense-in-Depth' hibrida.

    Aktifkan RLS di Supabase untuk semua tabel.

    Buat kebijakan RLS yang hanya mengizinkan operasi 'SELECT' (baca) oleh pengguna yang terautentikasi dan memiliki data tersebut.

    Blokir semua operasi 'INSERT', 'UPDATE', dan 'DELETE' di level RLS untuk pengguna biasa.

    Kita akan menangani semua mutasi data (penulisan) secara eksklusif menggunakan Next.js Server Actions yang berjalan di server dengan 'service_role key' Supabase."


## 4. Skema Database (Supabase)

Berikan ini langsung ke AI untuk membuat tabel di Supabase. Ini didasarkan pada riset Anda untuk arsitektur B2B[cite: 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137].

**Prompt untuk AI (Skema DB):**
```sql
-- 1. Tabel untuk Organisasi (Tenant Induk / WO)
--
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL
);

-- 2. Tabel Profil untuk menghubungkan Pengguna ke Organisasi (Tenant)
--
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  role TEXT NOT NULL DEFAULT 'member' -- misal: 'owner', 'member'
);

-- 3. Tabel Acara (Sub-Tenant / Pernikahan)
--
CREATE TABLE weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) NOT NULL, -- Kunci Multi-tenancy
  name TEXT NOT NULL, -- Misal: "Pernikahan A & B"
  wedding_date TIMESTAMPTZ,
  slug TEXT UNIQUE NOT NULL -- Untuk URL publik (misal: /invite/pernikahan-a-b)
  -- Tambahkan kolom lain sesuai kebutuhan (lokasi, dll)
);

-- 4. Tabel Tamu (Data Inti)
--
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES weddings(id) NOT NULL ON DELETE CASCADE, -- Kunci isolasi data
  name TEXT NOT NULL,
  contact TEXT, -- (Nomor WA/Email)
  status TEXT NOT NULL DEFAULT 'pending', -- enum: 'pending', 'confirmed_rsvp', 'checked_in'
  qr_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid() -- Payload untuk QR code
);

-- 5. Fungsi Helper untuk menghubungkan profil saat pendaftaran WO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Buat Organisasi baru untuk user ini
  INSERT INTO public.organizations (name, owner_id)
  VALUES (NEW.email || '''s Organization', NEW.id);

  -- Buat Profil yang menautkan user ke organisasi baru
  INSERT INTO public.profiles (id, organization_id, role)
  VALUES (NEW.id, (SELECT id FROM public.organizations WHERE owner_id = NEW.id), 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger untuk menjalankan fungsi di atas setelah user mendaftar
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

5. Alur Fitur & Implementasi Teknis (Arahan untuk AI)

Fitur 1: Autentikasi & Pendaftaran WO (B2B)

    UI: Buat halaman /register dan /login menggunakan komponen Card dan Form dari Shadcn/ui.

    Logika: Gunakan Supabase Auth (Email/Password).

    Saat pendaftaran, Supabase trigger (handle_new_user) akan otomatis membuat organization dan profile untuk WO baru tersebut.

    Saat login, WO akan diarahkan ke /dashboard.

Middleware: Buat middleware.ts untuk memproteksi semua rute di bawah /dashboard hanya untuk pengguna yang terautentikasi.

Fitur 2: Dasbor WO: CRUD Acara (Weddings)

    UI: Halaman /dashboard (atau /dashboard/events).

    Prompt AI: "Buat halaman dasbor menggunakan Shadcn/ui. Halaman ini harus:

    Menampilkan daftar 'weddings' milik organisasi WO yang sedang login (gunakan RLS SELECT yang aman).

    Memiliki <Dialog> (modal) untuk 'Membuat Acara Baru'.

    Form di dalam dialog harus memiliki field: name, wedding_date, dan slug.

    Saat disubmit, panggil Server Action createWedding(formData)."

Server Action (/actions/wedding-actions.ts):
TypeScript

    'use server';
    // ... import Supabase service_role client ...

    export async function createWedding(formData: FormData) {
      // 1. Dapatkan user & organisasi-nya dari Supabase Auth
      // 2. Validasi data (gunakan Zod)
      // 3. Masukkan data ke tabel 'weddings' menggunakan service_role client [cite: 107]
      //   
      //    const { data, error } = await supabaseServiceRole
      //      .from('weddings')
      //      .insert({
      //        name: formData.get('name'),
      //        slug: formData.get('slug'),
      //        organization_id: userOrg.id // INI KUNCI KEAMANANNYA
      //      });
      // 4. Lakukan revalidatePath('/dashboard')
    }

Fitur 3: Dasbor WO: CRUD Tamu (Guests)

    UI: Halaman dinamis /dashboard/events/[slug].

    Prompt AI: "Buat halaman detail acara di [slug]. Halaman ini harus memiliki Data Table dari Shadcn/ui untuk menampilkan daftar 'guests' yang terkait dengan 'wedding' ini. Tabel ini harus mendukung:

    Membuat Tamu Baru (via <Dialog>).

Mengedit Tamu.

Menghapus Tamu.

Menampilkan QR Code unik untuk setiap tamu (gunakan react-qr-code).

        Tombol 'Ekspor Tamu (CSV)'."

    Server Actions (/actions/guest-actions.ts): Buat Server Actions untuk createGuest, updateGuest, deleteGuest. Pastikan setiap action melakukan validasi keamanan (misal: "Apakah WO yang sedang login ini benar-benar pemilik acara tempat tamu ini akan ditambahkan?").

    Fitur CSV: Buat Server Action exportGuests(weddingId) yang mengambil data tamu, mengubahnya menjadi string CSV (gunakan library seperti papaparse), dan mengembalikannya agar bisa diunduh oleh browser.

Fitur 4: Halaman Undangan Publik (B2C) & RSVP

    UI: Halaman publik app/invite/[slug]/page.tsx.

Logika (Fetch Data): Halaman ini adalah Server Component. Ia akan mengambil data wedding berdasarkan slug dari URL.

Prompt AI (RSVP Form): "Di halaman [slug], tambahkan 'RSVP Form' sederhana menggunakan komponen Form Shadcn/ui. Form ini harus memiliki field (misal: nama, konfirmasi kehadiran). Saat disubmit, form ini harus memanggil Server Action submitRsvp(formData, guestId)."

Catatan: Karena B2C tidak login, halaman undangan publik harus memiliki ID tamu di URL-nya (misal: /invite/[slug]?guest_id=...) agar Server Action tahu tamu mana yang sedang RSVP.

Server Action (/actions/rsvp-actions.ts):
TypeScript

    'use server';
    // ...

    export async function submitRsvp(formData: FormData, guestId: string) {
      // 1. Validasi data
      // 2. Update tabel 'guests' 
      //    const { error } = await supabaseServiceRole
      //      .from('guests')
      //      .update({
      //        status: 'confirmed_rsvp', //
      //        name: formData.get('name') // Perbarui nama jika perlu
      //      })
      //      .match({ id: guestId });
      // 3. Kembalikan status sukses/gagal ke form
    }

Fitur 5: Aplikasi Check-in (Internal WO)

    UI: Halaman terproteksi /dashboard/events/[slug]/check-in.

Prompt AI: "Buat halaman check-in di [slug]/check-in. Halaman ini harus:

    Meminta izin kamera.

    Menampilkan viewfinder pemindai QR (gunakan react-qr-scanner atau html5-qrcode-reader).

Ketika QR dipindai, dapatkan qr_token dari datanya.

Panggil Server Action checkInGuest(qrToken, weddingId)."

Server Action (/actions/checkin-actions.ts):
TypeScript

    'use server';
    // ...

    export async function checkInGuest(qrToken: string, weddingId: string) {
      // 1. Cari tamu berdasarkan qr_token DAN wedding_id (keamanan ganda)
      // 2. Jika ketemu, update statusnya:
      //    const { error } = await supabaseServiceRole
      //      .from('guests')
      //      .update({ status: 'checked_in' }) //
      //      .match({ qr_token: qrToken, wedding_id: weddingId });
      // 3. Kembalikan data tamu (sukses) atau pesan error (gagal)
    }

6. Deployment & Biaya

    Hosting App: Vercel (Hobby Tier).

    Biaya: $0.

Setup: Hubungkan repositori GitHub Anda ke Vercel.

Env Variables: Tambahkan variabel lingkungan Supabase (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, dan SUPABASE_SERVICE_ROLE_KEY) ke pengaturan proyek Vercel.

Database & Auth: Supabase (Free Tier).

    Biaya: $0.

Batasan: Ukuran DB 500MB, 50k MAU , dan proyek akan di-pause setelah 1 minggu tidak aktif.

Pemicu Biaya Pertama: Segera setelah Anda mendapatkan 1 WO berbayar, upgrade Supabase ke Pro Plan ($25/bulan). Ini wajib untuk mendapatkan backup harian dan menonaktifkan auto-pause.

7. Metrik Sukses Teknis (MVP)

    [ ] Alur pendaftaran WO, pembuatan acara, dan penambahan tamu berjalan lancar.

    [ ] Data WO A 100% terisolasi dari data WO B (telah diuji secara manual dengan membuat 2 akun WO).

[ ] Alur Guest (menerima link -> RSVP -> dapat QR -> check-in) berfungsi end-to-end tanpa error.

[ ] Aplikasi berhasil di-deploy di Vercel dan terhubung ke Supabase.

[ ] Biaya operasional tetap $0 untuk peluncuran.


---

Dokumen ini adalah cetak biru Anda.

Apakah Anda siap untuk melanjutkan ke **Bagian IV**, di mana kita akan membuat file `NOTES.md` dan file konfigurasi awal untuk proyek Anda?