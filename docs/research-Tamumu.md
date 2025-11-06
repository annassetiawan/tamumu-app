# Rencana Strategis dan Arsitektur Teknis: Platform Undangan Pernikahan B2C/B2B dengan Next.js dan Supabase

Laporan ini menyajikan analisis mendalam dan panduan teknis untuk pengembangan platform undangan pernikahan Anda. Analisis ini berfokus pada validasi pasar, strategi _go-to-market_ B2C/B2B, arsitektur _multi-tenant_ yang dapat diskalakan menggunakan Next.js dan Supabase, serta alur kerja pengembangan yang dibantu AI (AI-assisted development) yang dioptimalkan untuk tahun 2025.

## BAGIAN 1: ANALISIS PASAR DAN POSISI STRATEGIS

### 1.1 Analisis Pesaing Inti: katsudoto.id

Analisis terhadap katsudoto.id menunjukkan pemain pasar B2C yang sangat matang dan telah mapan sejak 2018.<sup>1</sup>

**Kekuatan (Dominasi B2C):**

- **Rangkaian Fitur Komprehensif:** katsudoto.id menawarkan semua fitur yang diharapkan oleh pasangan (B2C), termasuk Undangan Website, Buku Tamu Digital, dan Sistem QR Code.<sup>1</sup> Fitur standar industri seperti Unlimited Edit, Maps, Countdown Timer, Add to Calendar, RSVP, Amplop Digital, dan Wedding Wish juga tersedia.<sup>2</sup>
- **Fitur Tambahan:** Mereka telah berekspansi ke alat perencanaan dasar melalui "Wedding Planner" untuk manajemen Anggaran, To-Do List, dan Rundown acara.<sup>1</sup>
- **Model Harga B2C yang Tervalidasi:** Mereka menggunakan model penetapan harga _tier_ sekali bayar yang jelas, yang sangat menarik bagi pasangan dengan anggaran pernikahan. Paket-paket ini berkisar dari IDR 249.000 (Persiapan) hingga IDR 1.999.000 (Mantu).<sup>3</sup> Paket premium mereka yang menawarkan "Masa Aktif Selamanya" dan "Unlimited Tamu" <sup>3</sup> secara efektif menetapkan ekspektasi pasar untuk layanan kelas atas.

**Kelemahan (Kelemahan B2B Kritis):**

- **Analisis Program "Mitra":** Meskipun katsudoto.id mengiklankan program "Mitra" untuk B2B <sup>5</sup>, analisis mendalam terhadap program ini mengungkap bahwa ini _bukan_ platform B2B/SaaS yang sebenarnya.<sup>6</sup>
- **Program Rujukan Sederhana:** Program "Mitra" mereka adalah skema _referral_ (rujukan) sederhana. Mitra (seperti Wedding Organizer) hanya mendapatkan komisi 15% dari penjualan yang dihasilkan dari _referral code_ unik mereka. Pelanggan mendapat diskon 5%, dan mitra mendapat bagian 15% dari harga setelah diskon.<sup>6</sup>
- **Implikasi Strategis:** Model ini adalah kelemahan strategis yang fundamental. Tidak ada _white-label_, tidak ada domain kustom, dan tidak ada _dashboard_ terpusat bagi WO untuk mengelola klien mereka. WO profesional tidak ingin bertindak sebagai agen penjualan untuk _brand_ lain; mereka ingin mengontrol pengalaman klien dan beroperasi di bawah _brand_ mereka sendiri. katsudoto.id gagal total dalam memenuhi kebutuhan inti B2B ini, menciptakan celah pasar yang signifikan.

### 1.2 Lanskap B2B: wedew.id sebagai Tolok Ukur White-Label

Berbeda dengan katsudoto.id, wedew.id telah membangun dan memvalidasi platform B2B _white-label_ yang sesungguhnya.<sup>7</sup> Analisis fitur mereka memberikan cetak biru yang jelas tentang apa yang diharapkan oleh pasar B2B (WO) dan apa yang harus menjadi target fitur Anda.

- **Validasi Fitur B2B:** Paket "Business" mereka <sup>7</sup> membuktikan bahwa pasar WO yang matang menginginkan fitur SaaS yang canggih, termasuk:
  - **Branding Kustom:** Logo Dashboard, Favicon, dan Skema Warna.
  - **Domain Kustom Penuh:** Kemampuan untuk menggunakan **Your Domain** (Domain Publik) dan **Your Domain** (Domain Dashboard).
  - **Manajemen Klien:** Domain situs web klien di-hosting di bawah (subdomain).yourdomain.com.
  - **Integrasi Lanjutan:** Penawaran **REST API, Webhooks, dan Single Sign On (SSO)** menunjukkan permintaan pasar akan interoperabilitas.
  - **Fitur White-Label Tambahan:** Custom Sender Email dan Custom Email Template.

Kelemahan katsudoto.id di B2B <sup>6</sup> dan kekuatan wedew.id di B2B <sup>7</sup> secara bersamaan **memvalidasi seluruh hipotesis B2B Anda**. Ada permintaan yang jelas untuk platform WO-centric yang belum dipenuhi oleh pemain B2C besar.

### 1.3 Model Harga B2C vs. B2B: Strategi Go-to-Market

Model pendapatan Anda harus mencerminkan dua segmen pengguna yang berbeda ini.

- **Strategi B2C (Pasangan):** Ikuti model yang telah divalidasi oleh katsudoto.id.<sup>3</sup> Gunakan **biaya sekali bayar per acara** dengan tingkatan fitur (misal: Basic, Pro, Premium). Model ini selaras dengan mentalitas penganggaran pernikahan.
- **Strategi B2B (Wedding Organizer):** Ikuti model wedew.id.<sup>7</sup> Gunakan **langganan bulanan/tahunan (SaaS)**. Ini memposisikan platform Anda sebagai alat operasional bisnis (Opex), bukan biaya acara sekali pakai (Capex). Model ini harus didasarkan pada _jumlah acara aktif_ atau _klien_ yang dapat dikelola oleh WO.

Tabel 1 di bawah ini merangkum strategi penetapan harga yang direkomendasikan.

**Tabel 1: Rekomendasi Model Harga B2C vs. B2B**

| **Segmen Pengguna** | **B2C (Pasangan)** | **B2B (Wedding Organizer)** |
| --- | --- | --- |
| **Model** | Biaya Sekali Bayar (Per Acara) | Langganan Berulang (SaaS Bulanan/Tahunan) |
| --- | --- | --- |
| **Logika** | "Bayar untuk acara pernikahan Anda." | "Bayar untuk alat operasional bisnis Anda." |
| --- | --- | --- |
| **Contoh Tier** | **Tier 1 (Basic):** Fitur Undangan Esensial.<br><br>**Tier 2 (Pro):** + Buku Tamu Digital & QR.<br><br>**Tier 3 (Premium):** + Galeri Foto, Masa Aktif >1 Tahun. | **Tier 1 (Starter):** 5 Acara Aktif.<br><br>**Tier 2 (Pro):** 20 Acara Aktif + Domain Kustom.<br><br>**Tier 3 (Enterprise):** Acara Tak Terbatas + Akses API. |
| --- | --- | --- |
| **Pesaing** | katsudoto.id <sup>3</sup> | wedew.id <sup>7</sup> |
| --- | --- | --- |

### 1.4 Rekomendasi USP (Unique Selling Proposition): Platform "WO-First" yang Sebenarnya

Berdasarkan analisis ini, _Unique Selling Proposition_ (USP) Anda harus secara agresif menargetkan kelemahan katsudoto.id dan membangun di atas validasi wedew.id.

Pernyataan USP yang Direkomendasikan:

"Satu-satunya platform undangan white-label yang dirancang untuk Wedding Organizer (WO) modern, memungkinkan Anda mengelola semua klien di bawah brand Anda sendiri dengan dashboard terpusat yang intuitif."

**Diferensiator Kunci:**

- **Arsitektur Multi-Tenant Sejati:** Tidak seperti program rujukan katsudoto.id <sup>6</sup>, platform Anda menyediakan _dashboard_ B2B di mana WO dapat mengelola _banyak_ pernikahan klien secara terpisah dan aman.<sup>8</sup>
- **Branding White-Label Penuh:** Anda akan menawarkan domain kustom, _branding_ dasbor, dan email kustom, meniru fitur-fitur yang divalidasi oleh wedew.id <sup>7</sup> tetapi dengan _stack_ teknologi Next.js/Supabase yang lebih modern dan pengalaman pengguna yang lebih baik.
- **Alur Kerja UI/UX Superior:** Memanfaatkan latar belakang UI/UX Anda, diferensiator utama Anda adalah _dashboard_ yang lebih mudah digunakan, lebih cepat, dan lebih indah daripada pesaing.

## BAGIAN 2: STRATEGI MVP: PELUNCURAN 1-2 MINGGU (10 PASANGAN, 1 WO)

Target "10 pasangan dan 1 WO" harus ditafsirkan ulang. Target "1 WO" jauh lebih penting, karena satu WO tersebut dapat membawa 10 pasangan tersebut sebagai klien mereka.<sup>9</sup> Oleh karena itu, arsitektur _multi-tenant_ B2B adalah inti mutlak dari MVP, bukan hanya fitur B2C.

Untuk mencapai _timeline_ 1-2 minggu, fitur harus dipotong secara kejam.<sup>10</sup> Pemotongan terbesar adalah: **Untuk MVP, Pasangan (B2C) tidak memerlukan login.** WO akan mengelola segalanya untuk mereka. Ini secara drastis mengurangi kompleksitas _onboarding_ dan _auth_ B2C, memungkinkan fokus 100% pada pengalaman WO.

### 2.1 Matriks Prioritas Fitur MVP (Metode MoSCoW)

Metode MoSCoW <sup>12</sup> digunakan untuk mengkategorikan fitur untuk _timeline_ 1-2 minggu yang ketat.

**Tabel 2: Matriks Prioritas Fitur MVP (MoSCoW)**

| **Kategori** | **Fitur** | **Justifikasi** |
| --- | --- | --- |
| **M** | **(B2B) Pendaftaran Akun WO** | Inti dari model bisnis B2B. Menggunakan Supabase Auth standar. |
| --- | --- | --- |
| **M** | **(B2B) Dashboard WO: CRUD Acara** | WO harus dapat Membuat, Membaca, Mengedit Acara (Klien).<sup>8</sup> |
| --- | --- | --- |
| **M** | **(B2B) Dashboard WO: CRUD Tamu** | WO harus dapat mengelola daftar tamu _untuk acara tertentu_. |
| --- | --- | --- |
| **M** | **(B2C) Halaman Undangan Publik** | Halaman statis (SSG/SSR) di Next.js (/invite/\[wedding_id\]) yang mengambil data dari Supabase. |
| --- | --- | --- |
| **M** | **(B2C) Fitur RSVP** | Formulir sederhana yang memanggil _Server Action_ untuk memperbarui tabel guests. |
| --- | --- | --- |
| **M** | **(B2C) Generator QR Code Unik** | Dibuat saat tamu dibuat, ditampilkan di _dashboard_ WO. react-qr-code.<sup>13</sup> |
| --- | --- | --- |
| **M** | **(Guest) Aplikasi Check-in** | Halaman terproteksi sederhana untuk memindai QR <sup>14</sup> dan mengubah status tamu (checked_in). |
| --- | --- | --- |
| **S** | **(B2B) Manajemen Tim WO** | Kemampuan WO mengundang anggota tim lain ke _dashboard_ mereka. |
| --- | --- | --- |
| **S** | **(B2C) Pemilihan Template Dasar** | Minimal 2-3 template untuk menunjukkan kustomisasi. |
| --- | --- | --- |
| **S** | **(B2C) Amplop Digital & Buku Tamu** | Fitur standar yang sangat diharapkan.\[2\] |
| --- | --- | --- |
| **C** | **(B2B) Pengaturan Domain Kustom** | Terlalu kompleks untuk MVP 1 minggu. Gunakan subdomain platform-anda.com pada awalnya. |
| --- | --- | --- |
| **C** | **(B2C) Login untuk Pasangan** | Potong fitur ini. Biarkan WO yang mengelola semua data untuk MVP.\[10\] |
| --- | --- | --- |
| **C** | **(B2C) Galeri Foto, Peta, Countdown** | Fitur standar \[2\] tetapi tidak esensial untuk validasi _loop_ inti (RSVP -> Check-in). |
| --- | --- | --- |
| **W** | **(Admin) Dashboard Admin Internal** | Gunakan Supabase Studio bawaan untuk mengelola WO pada awalnya.\[8, 10\] |
| --- | --- | --- |
| **W** | **(B2B) Integrasi API & SSO** | Fitur B2B tingkat lanjut, divalidasi oleh wedew.id <sup>7</sup> tetapi tidak untuk MVP. |
| --- | --- | --- |
| **W** | **(B2C) Wedding Planner (Budget, To-Do)** | Fitur tambahan katsudoto.id <sup>1</sup> yang menambah kompleksitas tanpa memvalidasi _loop_ inti. |
| --- | --- | --- |

### 2.2 Roadmap Pengembangan MVP (Langkah demi Langkah, 1-2 Minggu)

Roadmap ini agresif dan sangat bergantung pada pemotongan fitur yang diuraikan di atas dan penggunaan alat bantu AI.

**Minggu 1: Fondasi B2B & Fitur Inti**

- **Hari 1-2: Setup Supabase & Arsitektur.**
  - Inisialisasi proyek Supabase dan Next.js (menggunakan create-next-app).<sup>15</sup>
  - Definisikan dan terapkan Skema Database (lihat Bagian 3.3) di Supabase Studio atau sebagai skrip migrasi.
  - Terapkan kebijakan RLS _multi-tenant_ dasar (lihat Bagian 3.4).
- **Hari 3-4: Inti Dashboard WO (B2B).**
  - Implementasikan alur Pendaftaran/Login WO menggunakan Supabase Auth.<sup>16</sup>
  - Buat halaman _dashboard_ WO yang terproteksi (menggunakan _middleware_ atau _Server Components_ di Next.js App Router).
  - Gunakan **Shadcn/ui** <sup>10</sup> secara ekstensif untuk membangun _forms_ dan _tables_ untuk CRUD "Weddings" dan "Guests". Ini akan mempercepat pengembangan UI secara masif.
- **Hari 5: Halaman Undangan Publik (B2C).**
  - Buat rute dinamis Next.js: app/invite/\[wedding_id\]/page.tsx.
  - Gunakan Claude Code + Figma MCP untuk membuat _scaffold_ UI undangan dari desain Figma Anda (lihat Bagian 4.1).
  - Tulis _Server Component_ untuk mengambil data pernikahan (nama, tanggal, lokasi) dari Supabase.
- **Hari 6-7: Fitur RSVP & QR.**
  - Tambahkan formulir RSVP ke halaman undangan, yang memanggil Next.js _Server Action_ untuk memperbarui status tamu di Supabase.
  - Integrasikan react-qr-code <sup>13</sup> di _dashboard_ WO untuk menampilkan QR unik _per_ tamu.
  - Buat halaman Check-in (app/check-in/\[wedding_id\]) dengan react-qr-scanner <sup>14</sup> untuk memindai QR dan memanggil _Server Action_ yang mengubah guests.status menjadi checked_in.

**Minggu 2: Pengujian, Perbaikan, & Peluncuran 1 WO**

- **Hari 8-10: Pengujian End-to-End.**
  - **Pengujian Kritis:** Buat dua akun WO (WO A, WO B). Pastikan WO A _tidak pernah_ bisa melihat atau mengedit data milik WO B. Ini adalah pengujian RLS dan arsitektur _multi-tenant_ Anda.
  - Uji alur tamu penuh: WO membuat tamu -> Tamu mendapat link -> Tamu RSVP -> WO melihat status "confirmed" -> Tamu hadir -> QR dipindai -> Status berubah menjadi "checked_in".
- **Hari 11-12: Deploy & Finalisasi.**
  - Deploy aplikasi Next.js Anda ke Vercel (gratis).<sup>18</sup>
  - Pastikan variabel lingkungan Supabase (service_role, anon_key) diatur dengan benar di Vercel.
  - Buat akun untuk 1 WO target Anda secara manual di Supabase Auth.
- **Hari 13-14: Onboarding 1 WO.**
  - Lakukan _walkthrough_ pribadi dengan WO target Anda.
  - Biarkan mereka memasukkan 1-2 klien nyata pertama mereka (pasangan) ke dalam sistem. Kumpulkan _feedback_ langsung.

## BAGIAN 3: ARSITEKTUR TEKNIS INTI: MULTI-TENANCY NEXT.JS + SUPABASE

### 3.1 Tantangan Multi-Tenant: Isolasi Pasangan (B2C) vs. Wedding Organizer (B2B)

Kebutuhan arsitektur Anda bersifat hierarkis:

- **Anda (Super Admin):** Dapat melihat semua data.
- **Wedding Organizer (Tenant):** Hanya dapat melihat data organisasinya.
- **Pasangan (Sub-Tenant/Klien):** Hanya dapat melihat data acara pernikahan mereka.

Pola implementasi umum di Supabase meliputi RLS-Only <sup>19</sup> atau Schema-per-Tenant.<sup>21</sup> Schema-per-tenant sangat rumit untuk migrasi dan pemeliharaan <sup>22</sup>; **pendekatan ini tidak direkomendasikan untuk MVP Anda.** Pendekatan RLS-Only, meskipun dipromosikan oleh Supabase, memiliki kelemahan signifikan terkait kompleksitas dan performa.<sup>23</sup>

### 3.2 Rekomendasi Arsitektur: RLS Hirarkis dengan API Hibrida ("Defense-in-Depth")

Untuk _stack_ Next.js App Router dan Supabase per 2025, arsitektur yang paling kuat, dapat dipelihara, dan berperforma tinggi adalah **Model Hibrida**.<sup>25</sup>

Arsitektur ini membagi tanggung jawab keamanan antara _database_ (Supabase RLS) dan _server aplikasi_ (Next.js Server Actions).

- **RLS (sebagai _Safety Net_ / Jaring Pengaman):**
  - Anda _tetap_ mengaktifkan RLS pada _setiap_ tabel yang berisi data sensitif.<sup>26</sup>
  - **Namun:** Kebijakan RLS ini dibuat sesederhana mungkin. Kebijakan ini hanya mengizinkan operasi _pembacaan_ (SELECT) oleh pemilik yang sah.
  - Semua operasi _penulisan_ (INSERT, UPDATE, DELETE) **diblokir secara default** di level RLS untuk kunci anon publik.<sup>27</sup>
- **Next.js Server Actions (sebagai _Enforcer_ / Penegak Logika):**
  - Semua mutasi data (membuat tamu, mendaftar WO, mengedit acara) _harus_ melalui Next.js _Server Action_.<sup>25</sup>
  - Di dalam _Server Action_ (yang berjalan _hanya_ di server), Anda membuat Supabase Client menggunakan **service_role key**.<sup>16</sup>
  - _Key_ ini **mengabaikan/melewati semua kebijakan RLS**.<sup>27</sup>
  - Di dalam fungsi TypeScript Anda, Anda secara manual melakukan semua pemeriksaan keamanan dan logika bisnis (misal: "Apakah auth.uid() yang diautentikasi ini adalah pemilik organisasi dari organization_id yang ingin dia edit?").
  - Anda secara manual menerapkan klausa WHERE pada kueri Anda (misal: ...update('guests')...where('id', guest_id).where('organization_id', user.org_id)).

**Mengapa Arsitektur Hibrida ini Terbaik:**

- **Keamanan Berlapis (Defense-in-Depth):** Ini adalah praktik keamanan "Belt and Suspenders".<sup>27</sup> Jika ada _bug_ di _Server Action_ Anda (misal: Anda lupa klausa WHERE), RLS _masih_ akan memblokir _hacker_ yang mencoba menggunakan anon_key dari _client-side_ untuk membaca data.
- **Performa:** Logika bisnis yang kompleks (misal: memeriksa 5 tabel untuk izin <sup>29</sup>) tidak boleh berada di RLS. Menempatkannya di RLS akan menjalankannya pada _setiap_ kueri _database_ dan memperlambat aplikasi Anda secara drastis.<sup>30</sup> Dengan memindahkannya ke _Server Action_, kueri _database_ tetap cepat.
- **Kemudahan Debugging:** Jauh lebih mudah men-debug fungsi TypeScript di Next.js <sup>25</sup> daripada men-debug kebijakan SQL RLS yang rumit, tidak jelas, dan rawan kesalahan.<sup>24</sup>

### 3.3 Panduan Implementasi: Skema Tabel Supabase (Arsitektur B2B)

Berikut adalah skema B2B _multi-tenant_ minimal yang direkomendasikan, diadaptasi dari arsitektur hirarkis standar.<sup>31</sup>

**Tabel 1: organizations (Tenant Induk / WO)**

- id (uuid, primary key, default gen_random_uuid())
- name (text, not null) - Nama WO
- owner_id (uuid, references auth.users(id)) - Pemilik asli WO

**Tabel 2: profiles (Menghubungkan Pengguna ke Tenant)**

- id (uuid, primary key, references auth.users(id)) - Relasi 1:1 dengan auth.users
- organization_id (uuid, references organizations(id)) - Menunjukkan WO tempat pengguna ini bernaung
- role (text, not null, default 'member') - e.g., 'owner', 'member'

**Tabel 3: weddings (Sub-Tenant / Acara)**

- id (uuid, primary key, default gen_random_uuid())
- organization_id (uuid, references organizations(id)) - **Ini adalah kunci multi-tenancy!**
- name (text, not null) - Misal: "Pernikahan A & B"
- wedding_date (timestamp)
- _... (kolom data undangan lainnya: lokasi, cerita, dll)_

**Tabel 4: guests (Data Inti)**

- id (uuid, primary key, default gen_random_uuid())
- wedding_id (uuid, references weddings(id)) - **Ini adalah kunci isolasi data!**
- name (text, not null)
- status (text, enum: 'pending', 'confirmed_rsvp', 'checked_in')
- qr_token (text, unique, not null, default extensions.uuid_generate_v4()) - **Payload untuk QR code**.<sup>14</sup>

### 3.4 Contoh Kebijakan RLS (untuk Pola Hibrida **_Safety Net_**)

Ini adalah kebijakan RLS _sederhana_ yang Anda terapkan. Ingat, ini hanya untuk _reads_ (SELECT) sebagai jaring pengaman.

**Kebijakan di organizations:**

SQL

\-- Aktifkan RLS  
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;  
<br/>\-- (Sederhana) Pemilik dan anggota dapat melihat organisasi mereka  
CREATE POLICY "Anggota dapat melihat organisasi mereka" ON organizations  
FOR SELECT USING (  
EXISTS (  
SELECT 1 FROM profiles  
WHERE profiles.user_id = auth.uid()  
AND profiles.organization_id = organizations.id  
)  
);  

**Kebijakan di weddings:**

SQL

\-- Aktifkan RLS  
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;  
<br/>\-- (Hirarkis) Anggota organisasi dapat melihat pernikahan di dalam org mereka  
CREATE POLICY "Anggota Org dapat melihat pernikahan mereka" ON weddings  
FOR SELECT USING (  
EXISTS (  
SELECT 1 FROM profiles  
WHERE profiles.user_id = auth.uid()  
AND profiles.organization_id = weddings.organization_id  
)  
);  

Kebijakan di guests:

Kebijakan RLS di sini bisa menjadi rumit dan berdampak pada performa (memerlukan join ke weddings lalu ke profiles).29 Untuk pola hibrida, Anda dapat menyederhanakan ini. Karena guests tidak dapat diakses langsung dari klien (hanya melalui dashboard WO), RLS pada weddings sudah memberikan perlindungan yang memadai untuk loop kueri yang aman di server-side.

## BAGIAN 4: ALUR KERJA PENGEMBANGAN: AI, UI, DAN LIBRARY

### 4.1 Panduan Pemilihan Alat AI: Claude vs. Cursor vs. Copilot untuk Alur Kerja UI/UX Anda

Anda memiliki _workflow_ spesifik: developer UI/UX yang paham teknis. Pilihan alat AI Anda harus mencerminkan ini. Jangan pilih satu; gunakan _kombinasi_.<sup>33</sup>

- **GitHub Copilot:**
  - _Kekuatan:_ Terintegrasi di mana saja (termasuk di dalam Cursor/VSCode). Terbaik untuk **pelengkapan kode _inline_**.<sup>34</sup>
  - _Kelemahan:_ Kesadaran _codebase_ terbatas.<sup>35</sup> Tidak bisa "melihat" desain Figma Anda.
- **Cursor:**
  - _Kekuatan:_ Ini adalah **IDE (fork dari VSCode)**, bukan plugin.<sup>36</sup> Memiliki kesadaran _codebase_ penuh yang superior untuk **_refactoring_** (misal: "Ambil komponen ini, pindahkan ke file baru, dan perbarui semua impor").<sup>37</sup>
  - _Kelemahan:_ Harga lebih tinggi (\$20/bulan vs \$10) dan beberapa pengguna melaporkan inkonsistensi model.<sup>34</sup>
- **Claude Code (Claude 3.5+):**
  - _Kekuatan:_ Penalaran arsitektural yang superior dan _context window_ yang masif untuk tugas-tugas kompleks.<sup>35</sup>
  - **_Killer Feature_ untuk Anda:** Integrasi **Figma MCP (Model Context Protocol)**.<sup>39</sup> Ini adalah satu-satunya alat yang dirancang untuk _workflow_ utama Anda: **menerjemahkan desain visual menjadi kode _scaffold_ awal**.<sup>41</sup>

**Alur Kerja yang Direkomendasikan (Wawasan Orde-3):**

- **Langkah 1 (Generasi Awal): Claude Code + Figma MCP.** Aktifkan Figma MCP Server.<sup>42</sup> Di terminal Anda, gunakan _prompt_ (lihat Bagian 6.1) untuk meminta Claude Code membuat _scaffold_ komponen React + Tailwind dari _frame_ Figma yang Anda pilih.
- **Langkah 2 (Pengembangan Fitur): Cursor.** Buka kode yang dihasilkan AI di Cursor. Gunakan fitur _chat_ berbasis _codebase_ Cursor untuk _refactoring_, membersihkan kode, dan menghubungkannya ke _state_ atau _Server Actions_.
- **Langkah 3 (Pelengkapan Kode): Copilot.** Gunakan Copilot (yang juga terintegrasi di dalam Cursor) untuk pelengkapan _inline_ cepat saat Anda menulis logika bisnis.

Tabel 3 di bawah ini merangkum alur kerja ini.

**Tabel 3: Matriks Perbandingan Alat AI untuk Developer UI/UX (Next.js + Supabase)**

| **Alat AI** | **Kekuatan Inti** | **Tugas Terbaik untuk Alur Kerja Anda** |
| --- | --- | --- |
| **Claude Code (dengan Figma MCP)** | Penalaran Arsitektural, Figma-to-Code \[39\] | **Generasi Awal:** "Ambil desain Figma 'GuestList' ini dan ubah menjadi komponen React + Shadcn/ui + Tailwind." <sup>42</sup> |
| --- | --- | --- |
| **Cursor** | Kesadaran Codebase Penuh, Refactoring \[37\] | **Pengembangan & Refactoring:** "Komponen ini terlalu besar. Pisahkan menjadi 3 komponen anak dan perbarui impor." |
| --- | --- | --- |
| **GitHub Copilot** | Pelengkapan Kode Inline Cepat <sup>34</sup> | **Bantuan Pengetikan:** Menulis logika _boilerplate_ (misal: const { data, error } = await supabase...). |
| --- | --- | --- |

### 4.2 Trade-off UI: Mengapa Shadcn/ui Mengalahkan MUI untuk MVP Anda

Sebagai seorang desainer UI/UX dengan desain Figma kustom, pilihan _library_ UI Anda sangat penting.<sup>43</sup>

- **Masalah dengan MUI (Material-UI):** MUI adalah _library_ komponen yang _opiniated_ (berpendapat).<sup>45</sup> Ia ingin Anda membangun aplikasi Material Design. Anda akan menghabiskan 80% waktu Anda _melawan_ _styling_ bawaannya (CSS-in-JS _overrides_) untuk membuatnya terlihat seperti desain kustom Anda.<sup>44</sup> Ini lambat dan membuat frustrasi.
- **Keunggulan Shadcn/ui:**
  - **Ini _Bukan_ Library Komponen:** Ini adalah _koleksi_ komponen yang Anda **salin dan tempel** ke _codebase_ Anda (ke folder components Anda).<sup>46</sup>
  - **Kontrol Penuh:** Karena kode tersebut sekarang menjadi _milik Anda_, Anda dapat mengeditnya sesuka hati. Tidak ada _overriding_.
  - **Tailwind-Native:** Dibangun di atas Tailwind, yang sangat cocok dengan alur kerja AI _prompt-to-code_.<sup>47</sup>
  - **Kecepatan MVP:** Kombinasi Next.js + Supabase + Tailwind + **Shadcn/ui** adalah _stack_ yang direkomendasikan secara konsisten untuk kecepatan pengembangan MVP maksimum.<sup>10</sup>

**Kesimpulan:** **Gunakan Shadcn/ui.** Anda akan _full-code_ _di atas_ fondasi komponen Shadcn yang telah di-_scaffold_, bukan _melawan_ _library_ seperti MUI.

### 4.3 Rekomendasi Library Tambahan

- **Generator QR Code:** react-qr-code.<sup>13</sup>
  - _Alasan:_ Sangat populer (943k+ unduhan mingguan), ringan, dan berfungsi di sisi klien. Cukup berikan _string_ (misal: guests.qr_token) dan itu akan merendernya.
- **Pemindai QR Code (untuk Aplikasi Check-in):** html5-qrcode-reader (atau react-qr-scanner).
  - _Alasan:_ Anda memerlukan halaman untuk staf WO memindai QR tamu. _Library_ ini akan mengakses kamera _browser_ dan mengembalikan _string_ token yang dipindai.<sup>14</sup>
- **Manajemen State (Zustand vs. Jotai vs. Context):**
  - **Rekomendasi:** **Hindari semua _library_ _global state_** untuk MVP 1-2 minggu Anda.<sup>49</sup>
  - _Justifikasi:_ Dengan Next.js App Router, sebagian besar _state_ Anda akan ditangani oleh _Server Components_ (mengambil data langsung dari server) atau _URL State_ (misal: ?tab=guests atau ?search=nama_tamu).<sup>50</sup> Untuk _state_ sisi klien yang kompleks (seperti _form_ multi-langkah), _state_ React bawaan (useContext atau useReducer) sudah lebih dari cukup.<sup>51</sup> Menambahkan Zustand atau Jotai <sup>52</sup> hanya menambah kompleksitas yang tidak perlu pada MVP Anda.

## BAGIAN 5: ANALISIS ANGGARAN DAN SKALABILITAS

### 5.1 Analisis Biaya: Memaksimalkan Free Tier Vercel & Supabase (2025)

- **Vercel (Hobby Tier / Gratis):**
  - _Limit:_ 1 Juta _Edge Requests_, 100GB Bandwidth, 1 Juta _Function Invocations_.<sup>18</sup>
  - _Analisis:_ Batas ini _sangat besar_. Anda tidak akan mencapai batas ini dalam waktu dekat. Anda dapat menjalankan aplikasi produksi ringan di _free tier_ Vercel untuk waktu yang lama.<sup>54</sup>
- **Supabase (Free Tier):**
  - _Limit Kunci:_ **500MB _database size_**, 1GB _file storage_, dan 50.000 Monthly Active Users (MAUs).<sup>55</sup>
  - **Jebakan Kritis #1 (Inaktivitas):** Proyek di _free tier_ akan **di-pause (diberhentikan sementara) setelah 1 minggu tidak aktif**.<sup>56</sup> Ini tidak profesional untuk layanan berbayar.
  - **Jebakan Kritis #2 (Backup):** _Free tier_ **TIDAK memiliki _backup_ harian otomatis**.<sup>57</sup> Jika Anda tidak sengaja menghapus data klien, data itu akan hilang selamanya.

### 5.2 Pemicu Peningkatan: Kapan Anda Akan Mulai Membayar dan Berapa Estimasinya

Anda akan 100% membayar Supabase _jauh_ sebelum Anda membayar Vercel.

**Pemicu Peningkatan Supabase (ke Pro Plan):**

- **Pemicu #1 (Wajib): Klien Berbayar Pertama Anda.**
  - Saat Anda meluncurkan 1 WO berbayar, Anda _harus_ memiliki _backup_. _Free tier_ tidak memilikinya.<sup>57</sup> Anda harus segera _upgrade_ ke **Pro Plan (\$25/bulan)** untuk mendapatkan _backup_ harian.<sup>55</sup>
- **Pemicu #2 (Ukuran Database):**
  - Batas 500MB <sup>55</sup> akan cepat terlampaui jika pasangan mulai mengunggah banyak foto galeri.<sup>58</sup> Pro Plan memberi Anda 8GB, dengan biaya _pay-as-you-go_ setelahnya.<sup>56</sup>
- **Pemicu #3 (Inaktivitas):**
  - Aturan "pause" <sup>56</sup> adalah alasan lain untuk _upgrade_ ke Pro Plan segera setelah Anda memiliki pengguna aktif.

**Pemicu Peningkatan Vercel (ke Pro Plan):**

- **Pemicu #1 (Tim):**
  - Saat Anda mempekerjakan _developer_ lain. **Pro Plan (\$20/pengguna/bulan)** <sup>18</sup> ditagih per kursi _developer_.

**Estimasi Biaya Skala Awal:**

- **Bulan 1-3 (MVP/Pengembangan):** **\$0.** (Anda dapat me-restart proyek Supabase Anda secara manual jika di-pause).
- **Bulan 4+ (Saat Meluncurkan 1 WO Berbayar):** **\$25/bulan** (untuk Supabase Pro Plan). Ini adalah biaya operasional pertama dan terpenting Anda.
- **Skala (Tahun 1+):** \$25 (Supabase Pro) + \$20 (Vercel Pro, untuk Anda) = **\$45/bulan**.

## BAGIAN 6: PANDUAN STRATEGI BANTUAN AI (PROMPT ENGINEERING)

### 6.1 Prompting Guide: Menerjemahkan Desain Figma ke Komponen React (Claude + MCP)

Untuk menerjemahkan desain Figma Anda ke kode, Anda perlu menghubungkan Claude Code ke Figma MCP Server.<sup>42</sup>

- **Prasyarat:**
  - Jalankan Figma Desktop App.
  - Aktifkan "MCP Server" dari panel Dev Mode.<sup>61</sup>
  - Di terminal Anda, hubungkan Claude Code: claude mcp add --transport http figma-desktop <http://1227.0.0.1:3845/mcp>.<sup>59</sup>
  - Pilih _frame_ yang diinginkan di Figma.
- **Prompt yang Buruk:** "Buat undangan pernikahan." (Terlalu umum, tidak ada konteks).
- **Prompt yang Baik (Struktur):**
  - **Tetapkan Persona:** "Kamu adalah seorang engineer frontend senior di Vercel. Kamu ahli dalam Next.js 14 App Router, TypeScript, Tailwind CSS, dan Shadcn/ui."
  - **Tetapkan Konteks (Paling Penting):** "Aku telah memilih sebuah frame di Figma. Gunakan Figma MCP Server (#figma-desktop) dan alat #get_design_context untuk menganalisis node yang dipilih.".<sup>39</sup>
  - **Tetapkan Tugas:** "Buat komponen React baru untuk frame 'Detail Acara' yang dipilih."
  - **Tetapkan Batasan & Kualitas:** "Tulis kode menggunakan TypeScript. Gunakan Server Components secara default. Hanya gunakan 'use client' jika mutlak diperlukan untuk interaktivitas. Gunakan komponen dari Shadcn/ui (seperti &lt;Card&gt;, &lt;Button&gt;) jika sesuai dengan desain. Terapkan semua styling menggunakan Tailwind CSS, bukan CSS biasa. Pastikan output-nya responsif dan menyertakan data placeholder yang sesuai.".<sup>47</sup>

Selalu gunakan AI untuk _scaffolding_ (kerangka awal) <sup>47</sup>, lalu buka di Cursor untuk _refactoring_ dan penyempurnaan.

### 6.2 Jebakan Kritis: Menghindari Kesalahan Umum RLS Supabase yang Dihasilkan AI

AI (termasuk asisten di Supabase Studio <sup>63</sup> dan Claude/ChatGPT <sup>24</sup>) sangat percaya diri dalam menulis kebijakan RLS SQL. Namun, AI sering menghasilkan kebijakan yang _secara fungsional benar_ tetapi **sangat tidak efisien** atau **tidak aman**.

AI mengoptimalkan _kebenaran sintaksis_, bukan _performa database_ atau _keamanan berlapis_.

**Jebakan Umum RLS yang Dihasilkan AI:**

- **Jebakan Performa (Subkueri Berlapis):** AI _senang_ menggunakan subkueri berlapis.<sup>64</sup>
  - _Contoh Buruk (AI):_ CREATE POLICY "..." ON guests USING ( wedding_id IN (SELECT id FROM weddings WHERE organization_id IN (SELECT organization_id FROM profiles WHERE user_id = auth.uid())) );
  - _Masalah:_ Subkueri berlapis ini <sup>65</sup> berjalan **untuk setiap baris** di tabel guests (yang bisa berisi jutaan baris). Ini akan membunuh performa _database_ Anda.<sup>30</sup>
- **Jebakan Keamanan (USING vs. WITH CHECK):** AI sering lupa menambahkan klausa WITH CHECK.<sup>66</sup>
  - _Masalah:_ USING (untuk SELECT) mengontrol apa yang bisa _dilihat_ pengguna. WITH CHECK (untuk INSERT/UPDATE) mengontrol ke mana pengguna bisa _menulis_ data. Tanpa WITH CHECK, WO A (yang tidak bisa _melihat_ pernikahan WO B) mungkin secara tidak sengaja (atau sengaja) _memasukkan_ tamu ke pernikahan WO B.
- **Jebakan Peran (authenticated vs. anon):** AI sering lupa menentukan kebijakan TO authenticated.<sup>67</sup>
  - _Masalah:_ Kebijakan tersebut secara tidak sengaja dapat berlaku untuk pengguna anon (publik), yang menyebabkan kebocoran data.

**Rekomendasi Strategi AI untuk RLS:**

- **JANGAN** minta AI untuk "menulis RLS untuk _multi-tenancy_."
- **LAKUKAN:** Terapkan **Arsitektur Hibrida** (Bagian 3.2).
- **LAKUKAN:** Minta AI untuk **menulis _Server Action_ TypeScript** untuk logika bisnis Anda (jauh lebih aman dan mudah di-debug).
- **LAKUKAN:** Gunakan asisten AI Supabase <sup>63</sup> hanya untuk kebijakan RLS _paling sederhana_ (misal: "Izinkan pengguna membaca profil mereka sendiri jika id cocok dengan auth.uid()") dan _review_ SQL-nya secara manual.<sup>66</sup>

#### Works cited

- Contact Page - Katsudoto.id, accessed on November 6, 2025, <https://katsudoto.id/contact>
- Undangan Pernikahan Online - Katsudoto, accessed on November 6, 2025, <https://katsudoto.id/v2/package>
- Mantu Package oleh katsudoto | Bridestory Store, accessed on November 6, 2025, <https://www.bridestory.com/id/store/mantu-package-95df>
- Vendor | Panduan Pengguna - Kelola Akun, accessed on November 6, 2025, <https://panduan.katsudoto.id/wedding-planner/smart-dashboard/vendor>
- Events - Katsudoto, accessed on November 6, 2025, <https://katsudoto.id/events>
- Mitra Katsudoto - Easy Money Less Effort - Katsudoto.id, accessed on November 6, 2025, <https://katsudoto.id/mitra/>
- Wedew Partner - Bisnis Undangan Website Pernikahan Digital ..., accessed on November 6, 2025, <https://wedew.id/partner>
- Developing an MVP for SaaS Startups: Technical Insights | DigitalSuits, accessed on November 6, 2025, <https://digitalsuits.co/blog/developing-an-mvp-for-saas-startups-technical-insights/>
- How to Prioritize the Feature Development after You've Built an MVP - Stormotion, accessed on November 6, 2025, <https://stormotion.io/blog/how-to-prioritize-the-feature-development-after-youve-built-an-mvp/>
- What Is the Best Tech Stack for Building an MVP in 2 weeks? : r/SaaS - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/SaaS/comments/1ilz04v/what_is_the_best_tech_stack_for_building_an_mvp/>
- How to build MVP in 12 weeks: a short guide to launching your product quickly - Merixstudio, accessed on November 6, 2025, <https://www.merixstudio.com/blog/how-to-build-mvp-in-12-weeks>
- 15 Product Feature Prioritization Frameworks Every PM Should Know - The CPO Club, accessed on November 6, 2025, <https://cpoclub.com/product-development/product-feature-prioritization-frameworks/>
- react-qr-code - NPM, accessed on November 6, 2025, <https://www.npmjs.com/package/react-qr-code>
- paulthadev/QRCode-Smart-Attendance-System: Smart attendance system built using React and Vite. It leverages QR codes and geolocation to enable lecturers to efficiently take attendance in classes and manage schedules, while providing a straightforward attendance process for students. - GitHub, accessed on November 6, 2025, <https://github.com/paulthadev/trackAS>
- Build a User Management App with Next.js | Supabase Docs, accessed on November 6, 2025, <https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs>
- Setting up Server-Side Auth for Next.js | Supabase Docs, accessed on November 6, 2025, <https://supabase.com/docs/guides/auth/server-side/nextjs>
- What Is the Best Tech Stack for Building an MVP in 2 weeks? : r/SaaS, accessed on November 6, 2025, <https://www.reddit.com/r/SaaS/comments/1ilz04v/what_is_the_best_tech_stack_for_building_an_mvp_in_2_weeks/>
- Breaking down Vercel's 2025 pricing plans quotas and hidden costs - Flexprice, accessed on November 6, 2025, <https://flexprice.io/blog/vercel-pricing-breakdown>
- Advanced functionality of Supabase | Software Engineering Notes - Serhii Hrekov, accessed on November 6, 2025, <https://hrekov.com/blog/supabase-advanced-functionality>
- Multi-Tenant Applications with RLS on Supabase (Postgress) | Build AI-Powered Software Agents with AntStack | Scalable, Intelligent, Reliable, accessed on November 6, 2025, <https://www.antstack.com/blog/multi-tenant-applications-with-rls-on-supabase-postgress/>
- Efficient multi tenancy with Supabase - Arda's Notebook, accessed on November 6, 2025, <https://arda.beyazoglu.com/supabase-multi-tenancy>
- Database Architecture for Multi-Tenant Apps : r/Supabase - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/Supabase/comments/1ace4ag/database_architecture_for_multitenant_apps/>
- Supabase Pitfalls: Avoid These Common Mistakes for a Robust Backend - Hrekov, accessed on November 6, 2025, <https://hrekov.com/blog/supabase-common-mistakes>
- Anyone else getting really frustrated with RLS? Any resources you recommend? : r/Supabase - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/Supabase/comments/1e9zulb/anyone_else_getting_really_frustrated_with_rls/>
- Am I really supposed to use Supabase alone without a separate backend? - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/Supabase/comments/1l68kxy/am_i_really_supposed_to_use_supabase_alone/>
- Row Level Security | Supabase Docs, accessed on November 6, 2025, <https://supabase.com/docs/guides/database/postgres/row-level-security>
- Should you still use RLS with Next server components? : r/Supabase - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/Supabase/comments/1hdviyr/should_you_still_use_rls_with_next_server/>
- Should I be using service-role or anon api-key for nextjs project. : r/Supabase - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/Supabase/comments/1hjxwnv/should_i_be_using_servicerole_or_anon_apikey_for/>
- RLS for complex authorization? : r/PostgreSQL - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/PostgreSQL/comments/1d95lq5/rls_for_complex_authorization/>
- Troubleshooting | RLS Performance and Best ... - Supabase Docs, accessed on November 6, 2025, <https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv>
- \# Enforcing Row Level Security in Supabase: A Deep Dive into ..., accessed on November 6, 2025, <https://dev.to/blackie360/-enforcing-row-level-security-in-supabase-a-deep-dive-into-lockins-multi-tenant-architecture-4hd2>
- How to Structure a Multi-Tenant Backend in Supabase for a White-Label App? - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/Supabase/comments/1iyv3c6/how_to_structure_a_multitenant_backend_in/>
- 10 Best AI Coding Tools in 2025: From IDE Assistants to Agentic Builders, accessed on November 6, 2025, <https://superframeworks.com/blog/best-ai-coding-tools>
- GitHub Copilot vs Cursor in 2025: Why I'm paying half price for the same features - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/GithubCopilot/comments/1jnboan/github_copilot_vs_cursor_in_2025_why_im_paying/>
- AI Coding Assistant Comparison: GitHub Copilot vs Cursor vs Claude Code for Enterprise Development - Augment Code, accessed on November 6, 2025, <https://www.augmentcode.com/guides/ai-coding-assistant-comparison-github-copilot-vs-cursor-vs-claude-code-for-enterprise-development>
- Cursor vs. Copilot: Which AI coding tool is best? \[2025\] - Zapier, accessed on November 6, 2025, <https://zapier.com/blog/cursor-vs-copilot/>
- Cursor vs Copilot: Which AI Coding Tool Is Better in 2025? - Openxcell, accessed on November 6, 2025, <https://www.openxcell.com/blog/cursor-vs-copilot/>
- Cursor vs Copilot vs Clark: Which Is the Best in 2025? - Superblocks, accessed on November 6, 2025, <https://www.superblocks.com/blog/cursor-vs-copilot>
- Mastering the Figma MCP with Claude Code | by Fabricio Corrieri Bizonin | Sep, 2025, accessed on November 6, 2025, <https://fabriciocorrieri.medium.com/from-figma-to-code-mastering-the-figma-mcp-with-claude-code-9bea8a0505b4>
- Figma MCP Server Tested - Figma to Code - Research AIMultiple, accessed on November 6, 2025, <https://research.aimultiple.com/figma-to-code/>
- One week with Claude Code on a legacy codebase - Alex Savin, accessed on November 6, 2025, <https://alexsavin.me/posts/2025-08-13-claude-code-for-a-week/>
- Claude Code + Figma MCP Server - Builder.io, accessed on November 6, 2025, <https://www.builder.io/blog/claude-code-figma-mcp-server>
- Start designing with UI kits - Figma Learn - Help Center, accessed on November 6, 2025, <https://help.figma.com/hc/en-us/articles/24037724065943-Start-designing-with-UI-kits>
- Choosing a UI library that makes everyone's life easier : r/reactjs - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/reactjs/comments/1bc16y2/choosing_a_ui_library_that_makes_everyones_life/>
- ShadCN UI vs MUI: Which One Should You Choose? - Worko Dev, accessed on November 6, 2025, <https://www.worko.dev/blog/shadcn-ui-vs-mui>
- Shadcn vs. Material UI (MUI): Detailed Comparison Guide - Django Stars, accessed on November 6, 2025, <https://djangostars.com/blog/shadcn-ui-and-material-design-comparison/>
- 20 Best AI Coding Assistant Tools \[Updated Aug 2025\] - Qodo, accessed on November 6, 2025, <https://www.qodo.ai/blog/best-ai-coding-assistant-tools/>
- MVP Boilerplate - shadcn/ui Template, accessed on November 6, 2025, <https://www.shadcn.io/template/devtodollars-mvp-boilerplate>
- Zustand vs Redux Toolkit vs Context API in 2025: Which global state solution actually wins? : r/react - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/react/comments/1neu4wc/zustand_vs_redux_toolkit_vs_context_api_in_2025/>
- React State Management in 2025: What You Actually Need, accessed on November 6, 2025, <https://www.developerway.com/posts/react-state-management-2025>
- State Management in 2025: When to Use Context, Redux, Zustand, or Jotai, accessed on November 6, 2025, <https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k>
- Scalable React State Management: Redux, Zustand, Jotai Or Recoil? (Expert View) | by Ancilar Technologies | Medium, accessed on November 6, 2025, <https://medium.com/@ancilartech/large-scale-apps-101-redux-zustand-jotai-or-recoil-for-scalable-react-state-management-cebcd77e24a3>
- Best State management framework for Nextjs? - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/nextjs/comments/1femzoh/best_state_management_framework_for_nextjs/>
- Vercel Hobby Plan, accessed on November 6, 2025, <https://vercel.com/docs/plans/hobby>
- Pricing & Fees - Supabase, accessed on November 6, 2025, <https://supabase.com/pricing>
- Supabase Pricing 2025: Free, Pro & Enterprise Costs | MetaCTO, accessed on November 6, 2025, <https://www.metacto.com/blogs/the-true-cost-of-supabase-a-comprehensive-guide-to-pricing-integration-and-maintenance>
- Supabase doubles down on it's free tier - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/Supabase/comments/1do5uvf/supabase_doubles_down_on_its_free_tier/>
- Will free tier be enough for my project? : r/Supabase - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/Supabase/comments/1hjcc5e/will_free_tier_be_enough_for_my_project/>
- Desktop server (using desktop app) | Developer Docs - Figma Developer, accessed on November 6, 2025, <https://developers.figma.com/docs/figma-mcp-server/local-server-installation/>
- A guide on how to use the Figma MCP server - GitHub, accessed on November 6, 2025, <https://github.com/figma/mcp-server-guide>
- Guide to the Figma MCP server, accessed on November 6, 2025, <https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server>
- Converting Figma To React the Fast and Easy Way | by Jack Herrington - Medium, accessed on November 6, 2025, <https://jherr2020.medium.com/converting-figma-to-react-the-fast-and-easy-way-d6525a866f24>
- Use AI to enable and generate RLS policies for Postgres with Supabase - YouTube, accessed on November 6, 2025, <https://www.youtube.com/watch?v=hu2SQjvCXIw>
- What were the top mistakes you made when starting to use Supabase, and how would you do it differently now? - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/Supabase/comments/1f41a3v/what_were_the_top_mistakes_you_made_when_starting/>
- Could supabase RLS used for complex authorization use cases? - Reddit, accessed on November 6, 2025, <https://www.reddit.com/r/Supabase/comments/15nem7t/could_supabase_rls_used_for_complex_authorization/>
- Supabase Row Level Security Explained With Real Examples | by debug_senpai - Medium, accessed on November 6, 2025, <https://medium.com/@jigsz6391/supabase-row-level-security-explained-with-real-examples-6d06ce8d221c>
- AI Prompt: Database: Create RLS policies | Supabase Docs, accessed on November 6, 2025, <https://supabase.com/docs/guides/getting-started/ai-prompts/database-rls-policies>
- AI Prompt: Database: Create migration | Supabase Docs, accessed on November 6, 2025, <https://supabase.com/docs/guides/getting-started/ai-prompts/database-create-migration>