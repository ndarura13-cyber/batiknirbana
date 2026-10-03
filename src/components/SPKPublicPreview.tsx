import React, { useState, useEffect } from 'react';
import { SPKItem, PRODUCTION_STAGES, StageId } from '../types/spk';
import { apiFetchSPKByNumber, subscribeToSPKChanges } from '../lib/supabase';
import { SPKPrintView } from './SPKPrintView';

interface SPKPublicPreviewProps {
  nomorSpk: string;
  onBackToApp: () => void;
}

export const SPKPublicPreview: React.FC<SPKPublicPreviewProps> = ({
  nomorSpk,
  onBackToApp,
}) => {
  const [spk, setSpk] = useState<SPKItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);

  const loadSPKData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setIsRefreshing(true);
    try {
      const data = await apiFetchSPKByNumber(nomorSpk);
      setSpk(data);
    } catch (err) {
      console.error('Gagal mengambil data SPK:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSPKData(true);

    // Realtime listener untuk auto-update status saat pabrik mengubah tahap
    const unsubscribe = subscribeToSPKChanges(() => {
      loadSPKData(false);
    });

    return () => {
      unsubscribe();
    };
  }, [nomorSpk]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStageIcon = (stageId: StageId) => {
    switch (stageId) {
      case 1: return 'fa-solid fa-palette';
      case 2: return 'fa-solid fa-scroll';
      case 3: return 'fa-solid fa-fill-drip';
      case 4: return 'fa-solid fa-flask-vial';
      case 5: return 'fa-solid fa-ruler-combined';
      case 6: return 'fa-solid fa-truck-fast';
      default: return 'fa-solid fa-circle-notch';
    }
  };

  // State: Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full border-4 border-brand-900 border-t-gold-400 animate-spin mb-4" />
        <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-900 tracking-wide text-center">
          Memuat Data SPK Batik Nirbana...
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 font-mono">
          Nomor: {nomorSpk}
        </p>
      </div>
    );
  }

  // State: Not Found
  if (!spk) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
            <i className="fa-solid fa-file-circle-xmark text-2xl"></i>
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-900">
            SPK Tidak Ditemukan
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Data dengan nomor atau kode <code className="font-bold text-brand-900 bg-stone-100 px-1.5 py-0.5 rounded">{nomorSpk}</code> tidak ditemukan di sistem database PostgreSQL kami.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={() => loadSPKData(true)}
              className="px-5 py-2.5 rounded-xl bg-brand-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              <i className="fa-solid fa-arrows-rotate mr-2"></i>
              Coba Muat Ulang
            </button>
            <button
              onClick={onBackToApp}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-100 transition-all"
            >
              Masuk ke Aplikasi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Data SPK Ditemukan
  const now = new Date();
  const deadlineDate = new Date(spk.deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const isOverdue = diffDays < 0 && spk.current_stage < 6;
  const isApproaching = diffDays <= 2 && diffDays >= 0 && spk.current_stage < 6;
  const isUrgent = spk.is_urgent || isOverdue || isApproaching;
  const progressPercent = Math.min(100, Math.round(((spk.current_stage - 1) / 5) * 100));

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1E1E1E] flex flex-col selection:bg-brand-900 selection:text-white">
      
      {/* 1. HEADER RESMI TRACKING SPK */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E4DC] shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/logo.png"
              alt="Logo Nusantara Lestari"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full border border-stone-200 p-0.5 bg-white shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-brand-900 text-base sm:text-xl tracking-wider truncate">
                  BATIK NIRBANA
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Tracking
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-500 font-medium truncate">
                Sistem Pemantauan Produksi & Progres SPK Resmi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => loadSPKData(false)}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition-all flex items-center gap-1.5"
              title="Perbarui status sekarang"
            >
              <i className={`fa-solid fa-arrows-rotate text-xs ${isRefreshing ? 'fa-spin text-brand-900' : ''}`}></i>
              <span className="hidden md:inline">Refresh</span>
            </button>

            <button
              onClick={() => setIsPrintOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Cetak SPK 1 Halaman A4"
            >
              <i className="fa-solid fa-print text-stone-600 text-xs"></i>
              <span className="hidden md:inline">Cetak</span>
            </button>

            <button
              onClick={onBackToApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all"
              title="Masuk ke aplikasi internal"
            >
              <i className="fa-solid fa-arrow-right-to-bracket text-gold-300 text-xs"></i>
              <span className="hidden sm:inline">Masuk Sistem</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. KONTEN UTAMA TRACKING */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* HERO CARD: NOMOR SPK & STATUS TAHAPAN AKTIF */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-5 sm:p-7 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="font-mono text-xs sm:text-sm font-black px-3 py-1 rounded-lg bg-stone-900 text-gold-300 border border-gold-400/30 tracking-wider">
                  {spk.nomor_spk}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <i className="fa-solid fa-industry text-amber-700 text-xs"></i>
                  <span>Pabrik {spk.pabrik}</span>
                </span>

                {isUrgent && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                    <i className="fa-solid fa-fire-flame-curved text-xs"></i>
                    <span>{isOverdue ? 'Terlambat' : 'Mendesak'}</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-tight">
                {spk.nama_produksi}
              </h1>
              
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Pemesan: <strong className="text-stone-950 font-bold">{spk.nama_pemesan}</strong> • Target: <strong className="text-brand-900 font-extrabold">{spk.jumlah_meter} Meter</strong>
              </p>
            </div>

            {/* Tombol Salin Link Tracking */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-300 transition-all active:scale-95"
                title="Salin tautan ini untuk dibagikan ke WhatsApp pelanggan"
              >
                <i className={`fa-solid ${copied ? 'fa-check text-emerald-600' : 'fa-link text-stone-600'} text-xs`}></i>
                <span>{copied ? 'Tautan Disalin!' : 'Bagikan Link'}</span>
              </button>
            </div>
          </div>

          {/* Baris Status Ringkas & Indikator Persentase */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-900 text-gold-300 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                {spk.current_stage}/6
              </div>
              <div>
                <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block">
                  Posisi Alur Terkini:
                </span>
                <span className="text-sm font-extrabold text-stone-900">
                  {spk.current_stage === 6 
                    ? 'Produksi Selesai (Siap Dikirim / Diserahkan)' 
                    : `Tahap ${spk.current_stage}: ${PRODUCTION_STAGES.find(s => s.id === spk.current_stage)?.name}`}
                </span>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-stone-200 sm:pl-4">
              <span className="text-[10px] text-stone-400 block font-medium">Update Terakhir</span>
              <span className="text-xs font-semibold text-stone-800">
                {formatDateTime(spk.updated_at || spk.tanggal_masuk)}
              </span>
              <span className="text-[10px] text-stone-500 block">
                oleh: {spk.pic_terakhir || 'Admin'}
              </span>
            </div>
          </div>

          {/* Progress Bar Visual */}
          <div className="mt-4">
            <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div
                className={`h-full transition-all duration-700 ${
                  spk.current_stage === 6 
                    ? 'bg-emerald-500' 
                    : 'bg-gradient-to-r from-brand-900 to-amber-500'
                }`}
                style={{ width: `${Math.max(8, progressPercent)}%` }}
              />
            </div>
          </div>

        </div>

        {/* 3. POSISI PROGRES SPK LENGKAP (6 TAHAPAN ALUR PRODUKSI) */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-5 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center">
                <i className="fa-solid fa-timeline text-sm"></i>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                  Posisi Progres & Timeline Pengerjaan SPK
                </h2>
                <p className="text-xs text-stone-500">
                  Alur transparan 6 tahapan produksi batik dari desain hingga pengiriman
                </p>
              </div>
            </div>
          </div>

          {/* Stepper Timeline 6 Tahap */}
          <div className="relative border-l-2 border-stone-200 ml-4 sm:ml-6 space-y-6 sm:space-y-8 my-2">
            {PRODUCTION_STAGES.map((stage) => {
              const isCurrent = stage.id === spk.current_stage;
              const isCompleted = stage.id < spk.current_stage;
              const isPending = stage.id > spk.current_stage;

              return (
                <div key={stage.id} className="relative pl-6 sm:pl-8 group">
                  
                  {/* Titik / Marker Node */}
                  <div
                    className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : isCurrent
                          ? 'bg-amber-500 border-amber-600 text-white ring-4 ring-amber-100 shadow-md animate-pulse'
                          : 'bg-white border-stone-300 text-stone-400'
                    }`}
                  >
                    {isCompleted ? (
                      <i className="fa-solid fa-check text-xs"></i>
                    ) : (
                      <i className={`${getStageIcon(stage.id)} text-xs`}></i>
                    )}
                  </div>

                  {/* Isi Card Tahapan */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-50/60 border-amber-300 shadow-sm'
                        : isCompleted
                          ? 'bg-stone-50/80 border-stone-200'
                          : 'bg-white border-stone-200/60 opacity-60'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                          Tahap {stage.id}
                        </span>
                        <h3 className={`text-sm sm:text-base font-bold ${
                          isCurrent ? 'text-amber-950 font-extrabold' : isCompleted ? 'text-stone-900' : 'text-stone-600'
                        }`}>
                          {stage.name}
                        </h3>
                      </div>

                      {/* Badge Status Tahapan */}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <i className="fa-solid fa-circle-check text-xs"></i>
                          <span>Selesai</span>
                        </span>
                      )}
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500 text-white shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          <span>SEDANG DIKERJAKAN</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-500">
                          <span>Menunggu</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {stage.description}
                    </p>

                    {/* Info Khusus Tahap QC Ukur (Jika Aktif / Selesai) */}
                    {stage.id === 5 && spk.qc_meter_riil && (
                      <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-200 text-xs">
                        <div className="flex items-center justify-between font-semibold text-emerald-900 mb-1">
                          <span>Hasil QC Riil Kain:</span>
                          <span className="font-extrabold text-sm">{spk.qc_meter_riil} Meter</span>
                        </div>
                        {spk.qc_roll_details && spk.qc_roll_details.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {spk.qc_roll_details.map(r => (
                              <span key={r.roll} className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px]">
                                Roll #{r.roll}: {r.meter}m
                              </span>
                            ))}
                          </div>
                        )}
                        {spk.qc_catatan && (
                          <p className="mt-1 text-[11px] text-stone-600 italic">
                            Catatan: "{spk.qc_catatan}"
                          </p>
                        )}
                      </div>
                    )}

                    {/* PIC & Waktu jika ini tahap aktif saat ini */}
                    {isCurrent && (
                      <div className="mt-3 pt-2.5 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-amber-900 font-medium">
                        <span>Penanggung Jawab: <strong>{spk.pic_terakhir || spk.pabrik}</strong></span>
                        <span>Diproses di: <strong>Pabrik {spk.pabrik}</strong></span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* 4. DUA KOLOM: SPESIFIKASI TEKNIS & LAMPIRAN GAMBAR MOTIF */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Kolom Kiri: Tabel Spesifikasi Pekerjaan */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-list-check text-brand-900 text-base"></i>
                <h2 className="text-base font-bold text-stone-900">
                  Spesifikasi Teknis Kain & Cetak
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm divide-y divide-stone-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-500">Jenis Bahan Kain</span>
                  <span className="font-bold text-stone-900">{spk.bahan}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-500">Jenis Obat / Warna</span>
                  <span className="font-bold text-stone-900">{spk.obat}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-500">Jumlah Target Panjang</span>
                  <span className="font-bold text-brand-900">{spk.jumlah_meter} Meter</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-500">Jumlah Warna Cetak</span>
                  <span className="font-bold text-stone-900">{spk.jumlah_warna} Warna</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-500">Tanggal Mulai Masuk</span>
                  <span className="font-medium text-stone-900">{formatDate(spk.tanggal_masuk)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-500">Target Deadline</span>
                  <span className={`font-bold ${isUrgent ? 'text-red-600' : 'text-stone-900'}`}>
                    {formatDate(spk.deadline)}
                  </span>
                </div>
                {spk.keterangan && (
                  <div className="py-2">
                    <span className="text-stone-500 block mb-0.5">Catatan Khusus Pesanan:</span>
                    <p className="p-2.5 rounded-xl bg-stone-50 text-stone-700 italic border border-stone-200">
                      "{spk.keterangan}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
              <span>Status Desain: <strong>{spk.status_design}</strong></span>
              <span>Lokasi: <strong>Pabrik {spk.pabrik}</strong></span>
            </div>
          </div>

          {/* Kolom Kanan: Lampiran Gambar Motif Batik */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-5 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-image text-brand-900 text-base"></i>
                <h2 className="text-base font-bold text-stone-900">
                  Lampiran Motif Batik
                </h2>
              </div>
              <button
                onClick={() => setIsImageLightboxOpen(true)}
                className="text-xs text-brand-900 font-semibold hover:underline flex items-center gap-1"
              >
                <i className="fa-solid fa-expand text-[10px]"></i>
                Perbesar
              </button>
            </div>

            <div 
              className="flex-1 bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden flex items-center justify-center p-2 relative cursor-pointer group min-h-[220px]"
              onClick={() => setIsImageLightboxOpen(true)}
            >
              <img
                src={spk.foto_motif_url || '/batik_parang_kusuma.png'}
                alt={`Motif ${spk.nama_produksi}`}
                className="max-h-[260px] w-auto max-w-full object-contain rounded-xl group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2">
                <i className="fa-solid fa-magnifying-glass-plus text-base"></i>
                <span>Klik untuk memperbesar</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 text-center mt-2 font-medium">
              Motif master acuan pengerjaan pabrik cetak & pewarnaan
            </p>
          </div>

        </div>

      </main>

      {/* 5. FOOTER RESMI */}
      <footer className="bg-stone-900 text-stone-400 py-6 px-4 sm:px-6 border-t border-stone-800 text-center text-xs mt-12">
        <div className="max-w-5xl mx-auto space-y-2">
          <p className="font-serif tracking-widest text-stone-200 font-bold uppercase">
            Batik Nirbana • Nusantara Lestari Surakarta
          </p>
          <p className="text-[11px] text-stone-400">
            Jl. Dr. Rajiman No.248, Sriwedari, Kec. Laweyan, Kota Surakarta, Jawa Tengah 57141 • Telp. 085100 969475
          </p>
          <p className="text-[10px] text-stone-500 pt-2 border-t border-stone-800/80">
            Halaman ini dihasilkan otomatis dari sistem pemantauan barcode Surat Perintah Kerja (SPK).
          </p>
        </div>
      </footer>

      {/* MODAL PRINT DOKUMEN 1 HALAMAN A4 */}
      <SPKPrintView
        spk={spk}
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />

      {/* LIGHTBOX PERBESAR GAMBAR MOTIF */}
      {isImageLightboxOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsImageLightboxOpen(false)}
        >
          <button
            onClick={() => setIsImageLightboxOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 text-2xl transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <img
            src={spk.foto_motif_url || '/batik_parang_kusuma.png'}
            alt="Motif Full Preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};
