import React, { useEffect, useState } from 'react';
import { SPKItem } from '../types/spk';
import QRCode from 'qrcode';

interface SPKPrintViewProps {
  spk: SPKItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SPKPrintView: React.FC<SPKPrintViewProps> = ({
  spk,
  isOpen,
  onClose,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    if (spk) {
      const trackingUrl = `${window.location.origin}?spk=${spk.nomor_spk}`;
      QRCode.toDataURL(trackingUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#1e1e1e',
          light: '#ffffff'
        }
      })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error('Gagal generate QR Code:', err));
    }
  }, [spk]);

  if (!isOpen || !spk) return null;

  const handlePrint = () => {
    window.print();
  };

  // Format tanggal Indonesia resmi (contoh: 1 Oktober 26)
  const formatTanggalResmi = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = String(d.getFullYear()).slice(-2);
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="spk-print-modal-container fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:m-0 print:bg-white print:static print:overflow-visible print:block">

      {/* Floating Action Bar (Hanya di layar monitor / HP, tersembunyi saat cetak) */}
      <div className="fixed top-4 right-4 z-60 flex items-center gap-2 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-800 hover:bg-brand-900 text-white text-xs sm:text-sm font-bold shadow-xl transition-all active:scale-95"
        >
          <i className="fa-solid fa-print text-gold-300 text-sm"></i>
          <span>Cetak Sekarang (1 Halaman A4)</span>
        </button>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white text-stone-700 hover:bg-stone-100 shadow-xl transition-all"
          title="Tutup"
        >
          <i className="fa-solid fa-xmark text-base"></i>
        </button>
      </div>

      {/* DOKUMEN SPK NUSANTARA LESTARI (1:1 Sesuai File SPK Asli, Pas 1 Halaman A4) */}
      <div className="spk-print-document bg-white w-full max-w-[210mm] p-6 sm:p-8 shadow-2xl rounded-sm my-4 text-black print:my-0 print:p-0 print:shadow-none print:w-full print:max-w-none print:rounded-none">

        {/* 1. KOP SURAT RESMI */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3.5">
            <img
              src="/logo.png"
              alt="Logo Nusantara Lestari"
              className="w-16 h-16 sm:w-18 sm:h-18 object-contain shrink-0"
            />
            <div>
              <h1 className="font-serif tracking-wider text-xl sm:text-2xl font-black text-[#111] uppercase leading-tight">
                BATIK NIRBANA
              </h1>
              <p className="text-[11px] sm:text-[12px] text-stone-800 leading-tight max-w-[400px] mt-0.5 font-normal">
                Jl. Dr. Rajiman No.248, Sriwedari, Kec. Laweyan, Kota Surakarta, Jawa Tengah 57141. Telp. 085100 969475
              </p>
            </div>
          </div>

          {/* QR Code Pelacak Mandor / Pabrik */}
          {qrCodeDataUrl && (
            <div className="text-center pl-2 shrink-0">
              <img
                src={qrCodeDataUrl}
                alt="QR Code Pelacak SPK"
                className="w-14 h-14 sm:w-16 sm:h-16 border border-stone-300 rounded p-0.5 mx-auto"
              />
              <span className="block text-[8px] text-stone-600 font-mono mt-0.5 font-semibold">
                Scan Lacak
              </span>
            </div>
          )}
        </div>

        {/* Garis Tebal Pemisah Kop Surat */}
        <div className="border-b-[2.5px] border-black my-1.5" />

        {/* 2. JUDUL DOKUMEN */}
        <div className="text-center py-1.5">
          <h2 className="text-base sm:text-lg font-bold tracking-wider underline underline-offset-4 decoration-1 uppercase">
            SURAT PERINTAH KERJA
          </h2>
          <p className="font-mono text-[11px] text-stone-600 mt-0.5">
            Nomor: <strong>{spk.nomor_spk}</strong>
          </p>
        </div>

        {/* 3. TABEL SPESIFIKASI PEKERJAAN (1:1 Sesuai Layout SPK Asli) */}
        <div className="mt-1 border-t border-stone-400 pt-2 text-xs sm:text-sm">

          {/* Baris Nama Produksi (Pemesan) */}
          <div className="flex items-center mb-1.5">
            <span className="w-32 sm:w-36 font-semibold text-stone-900 shrink-0">Nama Produksi :</span>
            <span className="font-bold underline text-stone-950 text-sm sm:text-base">
              {spk.nama_produksi} ({spk.nama_pemesan})
            </span>
          </div>

          {/* Tabel Dua Kolom Spesifikasi */}
          <div className="border-t border-stone-200 pt-1.5 grid grid-cols-2 gap-y-1.5 gap-x-4">

            {/* Kolom Kiri: Bahan */}
            <div className="flex items-baseline">
              <span className="w-20 sm:w-24 font-semibold text-stone-800 shrink-0">Bahan</span>
              <span className="font-medium text-stone-950">: {spk.bahan}</span>
            </div>

            {/* Kolom Kanan: Obat */}
            <div className="flex items-baseline">
              <span className="w-24 sm:w-28 font-semibold text-stone-800 shrink-0">Obat</span>
              <span className="font-medium text-stone-950">: {spk.obat}</span>
            </div>

            {/* Kolom Kiri: Jumlah Target */}
            <div className="flex items-baseline">
              <span className="w-20 sm:w-24 font-semibold text-stone-800 shrink-0">Jumlah</span>
              <span className="font-medium text-stone-950">: {spk.jumlah_meter} Meter</span>
            </div>

            {/* Kolom Kanan: Jumlah Warna */}
            <div className="flex items-baseline">
              <span className="w-24 sm:w-28 font-semibold text-stone-800 shrink-0">Juml. Warna</span>
              <span className="font-medium text-stone-950">: {spk.jumlah_warna} Warna</span>
            </div>

            {/* Kolom Kiri: Pabrik Cetak */}
            <div className="flex items-baseline">
              <span className="w-20 sm:w-24 font-semibold text-stone-800 shrink-0">Pabrik</span>
              <span className="font-bold text-stone-950">: {spk.pabrik}</span>
            </div>

            {/* Kolom Kanan: Tanggal Masuk */}
            <div className="flex items-baseline">
              <span className="w-24 sm:w-28 font-semibold text-stone-800 shrink-0">Tanggal Masuk</span>
              <span className="font-medium text-stone-950">: {formatTanggalResmi(spk.tanggal_masuk)}</span>
            </div>

          </div>

          {/* Baris Keterangan */}
          <div className="border-t border-b border-stone-300 py-1.5 mt-1.5 flex items-start">
            <span className="w-20 sm:w-24 font-semibold text-stone-800 shrink-0">Keterangan :</span>
            <span className="font-medium text-stone-900 leading-snug">
              {spk.keterangan || '-'}
            </span>
          </div>

        </div>

        {/* 4. LAMPIRAN GAMBAR MOTIF BATIK (Proporsional Pas 1 Lembar) */}
        <div className="mt-3 flex flex-col items-center justify-center">
          <div className="border border-stone-400 p-1 bg-white max-w-full">
            <img
              src={spk.foto_motif_url || '/batik_parang_kusuma.png'}
              alt={`Motif ${spk.nama_produksi}`}
              className="w-full max-h-[140mm] sm:max-h-[145mm] object-contain block mx-auto"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
