import React from 'react';
import { SPKItem, PRODUCTION_STAGES } from '../types/spk';

interface SPKDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  spk: SPKItem | null;
  onPrintSPK: (spk: SPKItem) => void;
  onAdvanceStage: (spk: SPKItem) => void;
  onOpenQCModal: (spk: SPKItem) => void;
  canEdit: boolean;
  isAdmin?: boolean;
  onRequestDelete?: (spk: SPKItem) => void;
  onOpenTracking?: (spk: SPKItem) => void;
}

export const SPKDetailModal: React.FC<SPKDetailModalProps> = ({
  isOpen,
  onClose,
  spk,
  onPrintSPK,
  onAdvanceStage,
  onOpenQCModal,
  canEdit,
  isAdmin,
  onRequestDelete,
  onOpenTracking,
}) => {
  if (!isOpen || !spk) return null;

  // Format tanggal Indonesia
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const now = new Date();
  const deadlineDate = new Date(spk.deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const isOverdue = diffDays < 0 && spk.current_stage < 6;
  const isApproaching = diffDays <= 2 && diffDays >= 0 && spk.current_stage < 6;
  const isUrgent = spk.is_urgent || isOverdue || isApproaching;

  const currentStageConfig = PRODUCTION_STAGES.find(s => s.id === spk.current_stage);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-all animate-fadeIn">
      {/* Slide-Up Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all animate-slideUp sm:animate-scaleIn max-h-[92vh] flex flex-col">
        
        {/* Handle Bar untuk Mobile Drag Feel */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Header Modal */}
        <div className="px-5 py-4 bg-gradient-to-r from-stone-900 to-brand-950 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-[11px] font-bold bg-white/10 px-2 py-0.5 rounded text-gold-300 border border-white/10">
                {spk.nomor_spk}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] bg-white/15 px-2 py-0.5 rounded-full text-stone-200">
                <i className="fa-solid fa-industry text-[10px]"></i>
                <span>{spk.pabrik}</span>
              </span>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                  <i className="fa-solid fa-fire-flame-curved text-[10px]"></i>
                  <span>{isOverdue ? 'Terlambat' : 'Mendesak'}</span>
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              {spk.nama_produksi}
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              Pemesan: <strong className="text-white">{spk.nama_pemesan}</strong>
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Konten Scrollable */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          
          {/* Status Tahapan Saat Ini */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs text-stone-500 font-semibold uppercase tracking-wider block">
                Tahap Produksi Saat Ini:
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm sm:text-base font-extrabold text-brand-900">
                  Tahap {spk.current_stage}: {currentStageConfig?.name}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {currentStageConfig?.description}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-900 flex items-center justify-center font-bold text-sm shrink-0 border border-brand-200">
              {spk.current_stage}/6
            </div>
          </div>

          {/* Gambar Motif & Spesifikasi Bahan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Foto Motif Batik */}
            <div>
              <span className="text-xs font-bold text-stone-700 mb-1.5 block">
                Visual Motif Batik:
              </span>
              <div className="w-full h-44 rounded-2xl border border-stone-200 overflow-hidden bg-stone-100 flex items-center justify-center relative shadow-inner">
                {spk.foto_motif_url ? (
                  <img 
                    src={spk.foto_motif_url} 
                    alt={spk.nama_produksi}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-stone-400 p-4">
                    <i className="fa-regular fa-image text-3xl mb-1 block"></i>
                    <span>Foto tidak tersedia</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white rounded text-[10px] font-mono">
                  {spk.status_design === 'Approved' ? 'Design Acc' : 'Pending Acc'}
                </div>
              </div>
            </div>

            {/* Rincian Spesifikasi */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-stone-700 block">
                Spesifikasi Teknis:
              </span>
              
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-center py-0.5 border-b border-stone-100">
                  <span className="text-stone-500">Kain / Bahan:</span>
                  <span className="font-semibold text-stone-900">{spk.bahan}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-stone-100">
                  <span className="text-stone-500">Jenis Obat / Warna:</span>
                  <span className="font-semibold text-stone-900">{spk.obat} ({spk.jumlah_warna} Warna)</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-stone-100">
                  <span className="text-stone-500">Target Panjang:</span>
                  <span className="font-extrabold text-brand-900">{spk.jumlah_meter} Meter</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-stone-100">
                  <span className="text-stone-500">Tgl Masuk SPK:</span>
                  <span className="font-medium text-stone-800">{formatDate(spk.tanggal_masuk)}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-stone-500">Deadline Target:</span>
                  <span className={`font-bold ${isUrgent ? 'text-red-600' : 'text-stone-800'}`}>
                    {formatDate(spk.deadline)}
                  </span>
                </div>
              </div>

              {spk.keterangan && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-stone-700 text-xs">
                  <span className="font-bold text-amber-900 block mb-0.5">Catatan Produksi:</span>
                  "{spk.keterangan}"
                </div>
              )}
            </div>

          </div>

          {/* Rincian QC Ukur (Jika Sudah Ada) */}
          {spk.qc_meter_riil ? (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-ruler-combined text-emerald-700 text-base"></i>
                  <h4 className="font-bold text-xs sm:text-sm text-emerald-900">
                    Hasil Pengukuran QC Meter Riil
                  </h4>
                </div>
                <span className="text-base sm:text-lg font-black text-emerald-900">
                  {spk.qc_meter_riil} Meter
                </span>
              </div>

              {spk.qc_roll_details && spk.qc_roll_details.length > 0 && (
                <div className="mt-2 pt-2 border-t border-emerald-200/80">
                  <span className="text-[11px] font-semibold text-emerald-800 block mb-1">
                    Rincian Roll (Standar 24-30m/pcs):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {spk.qc_roll_details.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-900 font-mono text-xs">
                        Roll #{r.roll}: <strong>{r.meter}m</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {spk.qc_catatan && (
                <p className="mt-2 text-xs italic text-emerald-800">
                  Catatan QC: "{spk.qc_catatan}"
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-center text-stone-500 text-xs">
              <i className="fa-solid fa-ruler text-stone-400 mr-1.5"></i>
              QC Ukur belum dilaksanakan (akan dilakukan di Tahap 4 di Pabrik)
            </div>
          )}

        </div>

        {/* Footer Modal dengan Tombol Aksi */}
        <div className="p-4 sm:px-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onPrintSPK(spk);
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-all"
            >
              <i className="fa-solid fa-print text-stone-600 text-xs"></i>
              <span>Cetak SPK</span>
            </button>

            {onOpenTracking && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTracking(spk);
                }}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-all"
                title="Buka halaman tracking publik (hasil scan barcode)"
              >
                <i className="fa-solid fa-qrcode text-brand-800 text-xs"></i>
                <span>Tracking</span>
              </button>
            )}

            {onRequestDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestDelete(spk);
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                  isAdmin 
                    ? 'border-red-300 bg-red-50 hover:bg-red-100 text-red-700' 
                    : 'border-stone-300 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-700'
                }`}
                title="Hapus SPK (Memerlukan Otorisasi PIN Admin)"
              >
                <i className={`fa-solid ${isAdmin ? 'fa-trash-can text-red-600' : 'fa-lock text-stone-400'} text-xs`}></i>
                <span>{isAdmin ? 'Hapus SPK' : 'Hapus (PIN Admin)'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (spk.current_stage === 3 || spk.current_stage === 4) && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQCModal(spk);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <i className="fa-solid fa-ruler-combined text-emerald-200 text-xs"></i>
                <span>Input QC Ukur</span>
              </button>
            )}

            {canEdit && spk.current_stage < 6 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAdvanceStage(spk);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                <span>Lanjut ke Tahap {spk.current_stage + 1}</span>
                <i className="fa-solid fa-arrow-right text-gold-300 text-xs"></i>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-200 transition-colors"
            >
              Tutup
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
