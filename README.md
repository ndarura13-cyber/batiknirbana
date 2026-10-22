# Batik Nirbana - Sistem Pemantauan Produksi & SPK

Aplikasi manajemen Surat Perintah Kerja (SPK) produksi batik berbasis cloud untuk **Batik Nirbana** (Surakarta, Jawa Tengah). Memantau progres 6 tahapan produksi (*Desain/Screen, Fabric Loading, Dyeing/Printing, Finishing/Steam, QC & Packing, Siap Kirim*), konversi meter-yard otomatis, cetak SPK resmi A4 1:1, serta pelacakan status secara real-time terintegrasi Supabase Cloud PostgreSQL.

- **Domain Resmi**: [https://nirbana.my.id](https://nirbana.my.id)

---

## 🚀 Fitur Utama

- **Otorisasi Multi-Peran Berbasis PIN**:
  - Admin Pusat (Nusantara Lestari)
  - PIC Pabrik (Pasar Kembang, Bayangkara, Nusupan)
- **Alur Kerja 6 Tahapan Produksi**:
  1. Desain/ Screen (Afdruk & Persiapan Desain)
  2. Fabric Loading (Persiapan Kain & Mori)
  3. Dyeing/ Printing (Proses Pewarnaan & Cetak Motif)
  4. Finishing/ Steam (Fiksasi Warna & Penyelesaian)
  5. QC dan Packing (Pengukuran Meter Riil Roll & Pengemasan)
  6. Siap Kirim (Distribusi ke Pemesan)
- **Konversi Satuan Tekstil Terintegrasi**:
  - Konversi dua arah instan Meter ⇄ Yard pada formulir SPK & kartu ringkasan.
- **Kompak & Mobile-Friendly**:
  - Bilah navigasi bawah simetris 5 tombol dengan tombol (+) SPK Baru menonjol elegan.
  - Kartu ringkasan metrik adaptif (*sticky* otomatis saat di-scroll ke bawah).
- **Cetak Dokumen SPK Resmi**:
  - Format cetak standar A4 pas 1 halaman dengan QR Code pelacak terintegrasi (bersih dari elemen UI).
- **Penyimpanan Terpusat**:
  - Didukung database PostgreSQL Supabase dengan skema relasional tabel `spk` dan `app_security_pins`.

---

## 🛠️ Teknologi

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, FontAwesome 6 Icons
- **Database Cloud**: Supabase (PostgreSQL)
- **Domain**: `nirbana.my.id`

