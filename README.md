# Batik Nirbana - Sistem Pemantauan Produksi & SPK

Aplikasi manajemen Surat Perintah Kerja (SPK) produksi batik berbasis cloud untuk **Batik Nirbana** (Surakarta, Jawa Tengah). Memantau progres 6 tahapan produksi (Kain Mori, Cap/Tulis, Pewarnaan, QC & Potong, Finishing/Packing, Siap Kirim), kalkulasi meter kain otomatis, cetak SPK resmi A4 1:1, serta pelacakan status secara real-time terintegrasi Supabase Cloud PostgreSQL.

---

## 🚀 Fitur Utama

- **Otorisasi Multi-Peran Berbasis PIN**:
  - Admin Pusat
  - PIC Pabrik (Pasar Kembang, Bayangkara, Nusupan)
- **Alur Kerja 6 Tahapan Produksi**:
  1. Pengadaan Bahan (Mori)
  2. Pembatikan (Cap / Tulis)
  3. Pewarnaan (Colet / Celup)
  4. Pengukuran & QC Roll (Standar 24–30 meter)
  5. Finishing & Packing
  6. Siap Kirim / Distribusi
- **Kompak & Mobile-Friendly**:
  - Bilah navigasi bawah simetris 5 tombol dengan tombol (+) SPK Baru menonjol elegan.
  - Kartu ringkasan metrik adaptif (*sticky* otomatis saat di-scroll ke bawah).
- **Cetak Dokumen SPK Resmi**:
  - Format cetak standar A4 pas 1 halaman dengan QR Code pelacak terintegrasi.
- **Penyimpanan Terpusat**:
  - Didukung database PostgreSQL Supabase dengan skema relasional tabel `spk` dan `app_security_pins`.

---

## 🛠️ Teknologi

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, FontAwesome 6 Icons
- **Database Cloud**: Supabase (PostgreSQL)
- **Deployment**: Vercel

---

## 💻 Menjalankan Secara Lokal

1. **Clone repository**:
   ```bash
   git clone https://github.com/ndarura13-cyber/nirbanaAI.git
   cd nirbanaAI
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin `.env.example` menjadi `.env` dan isi kredensial Supabase:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```

5. **Build produksi**:
   ```bash
   npm run build
   ```

---

## 🌐 Panduan Deploy ke Vercel

1. Buka [Vercel](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **"Add New"** > **"Project"**, lalu pilih repository GitHub ini.
3. Pada bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` : URL proyek Supabase Anda
   - `VITE_SUPABASE_ANON_KEY` : Anon key Supabase Anda
4. Klik **"Deploy"**. Vercel akan otomatis mengompilasi dan menerbitkan website dalam hitungan detik.
