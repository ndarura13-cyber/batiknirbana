import React from 'react';
import { SPKItem, PRODUCTION_STAGES, StageId } from '../types/spk';

interface SPKCardProps {
  spk: SPKItem;
  onAdvanceStage: (spk: SPKItem) => void;
  onOpenQCModal: (spk: SPKItem) => void;
  onPrintSPK: (spk: SPKItem) => void;
  onOpenDetail: (spk: SPKItem) => void;
  canEdit: boolean;
  isAdmin?: boolean;
  onDeleteSPK?: (spk: SPKItem) => void;
  onOpenTracking?: (spk: SPKItem) => void;
}

export const SPKCard: React.FC<SPKCardProps> = ({
  spk,
  onAdvanceStage,
  onOpenQCModal,
  onPrintSPK,
  onOpenDetail,
  canEdit,
  isAdmin,
  onDeleteSPK,
  onOpenTracking,
}) => {
  const now = new Date();
  const deadlineDate = new Date(spk.deadline);
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const isOverdue = diffDays < 0 && spk.current_stage < 6;
  const isApproaching = diffDays <= 2 && diffDays >= 0 && spk.current_stage < 6;
  const isUrgent = spk.is_urgent || isOverdue || isApproaching;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = () => {
    if (spk.current_stage === 6) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <i className="fa-solid fa-circle-check text-xs text-emerald-700"></i>
          <span>SELESAI</span>
        </span>
      );
    }
    if (spk.current_stage === 1 && spk.status_design === 'Pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <i className="fa-solid fa-clock text-xs text-amber-700"></i>
          <span>PENDING</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-800 border border-orange-200">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-ping mr-0.5" />
        <span>PROSES</span>
      </span>
    );
  };

  const getStageIconClass = (stageId: StageId) => {
    switch (stageId) {
      case 1: return 'fa-solid fa-palette';
      case 2: return 'fa-solid fa-scroll';
      case 3: return 'fa-solid fa-fill-drip';
      case 4: return 'fa-solid fa-ruler-combined';
      case 5: return 'fa-solid fa-box-archive';
      case 6: return 'fa-solid fa-truck-fast';
    }
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md ${
      isUrgent ? 'border-amber-400/90 ring-1 ring-amber-300/40' : 'border-stone-200/90'
    } overflow-hidden`}>
      
      {/* Header Kartu */}
      <div className="p-3.5 sm:p-5 pb-2.5 sm:pb-3">
        <div className="flex flex-wrap items-start justify-between gap-1.5 mb-1.5">
          
          {/* Judul & Nomor SPK */}
          <div className="flex-1 min-w-[180px]">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="font-mono text-[11px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/80">
                {spk.nomor_spk}
              </span>
              {spk.pabrik && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200">
                  <i className="fa-solid fa-location-dot text-[10px] text-brand-700"></i>
                  <span>{spk.pabrik}</span>
                </span>
              )}
              {isUrgent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                  <i className="fa-solid fa-fire-flame-curved text-[10px] text-red-600"></i>
                  <span>{isOverdue ? 'Terlambat' : 'Mendesak'}</span>
                </span>
              )}
            </div>

            {/* Nama Produksi & Pemesan */}
            <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug flex items-center flex-wrap gap-1.5 mt-1">
              <span>{spk.nama_produksi}</span>
              <span className="inline-flex items-center gap-1 text-stone-500 font-normal text-[11px] sm:text-xs bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200/50">
                <i className="fa-regular fa-user text-[10px]"></i>
                {spk.nama_pemesan}
              </span>
            </h3>
          </div>

          {/* Status Badge & Aksi Cepat */}
          <div className="flex items-center gap-1.5 shrink-0">
            {getStatusBadge()}

            {/* Tombol Preview Tracking Barcode */}
            {onOpenTracking && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTracking(spk);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-brand-900 hover:bg-stone-100 transition-colors"
                title="Buka Halaman Preview / Tracking Barcode"
              >
                <i className="fa-solid fa-qrcode text-xs"></i>
              </button>
            )}

            {/* Tombol Hapus Khusus Admin Pusat */}
            {isAdmin && onDeleteSPK && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSPK(spk);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Hapus SPK (Memerlukan Otorisasi PIN Admin)"
              >
                <i className="fa-solid fa-trash-can text-xs"></i>
              </button>
            )}
          </div>
        </div>

        {/* Informasi Spesifikasi (Desktop View) */}
        <div className="hidden sm:flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-stone-600 bg-stone-50/70 p-2.5 rounded-xl border border-stone-100 mt-2">
          <div className="flex items-center gap-1.5" title="Bahan dan Obat">
            <i className="fa-solid fa-scroll text-stone-400"></i>
            <span className="font-semibold text-stone-800">{spk.bahan} ({spk.obat})</span>
          </div>
          <div className="h-3 w-px bg-stone-300" />
          <div className="flex items-center gap-1.5" title="Target Panjang">
            <i className="fa-solid fa-ruler-horizontal text-stone-400"></i>
            <span className="font-semibold text-stone-800">{spk.jumlah_meter}m</span>
          </div>
          <div className="h-3 w-px bg-stone-300" />
          <div className="flex items-center gap-1.5" title="Jumlah Warna">
            <i className="fa-solid fa-palette text-stone-400"></i>
            <span className="font-semibold text-stone-800">{spk.jumlah_warna} Warna</span>
          </div>
          <div className="h-3 w-px bg-stone-300" />
          <div className="flex items-center gap-1.5" title="Target Selesai">
            <i className="fa-regular fa-calendar text-stone-400 text-xs"></i>
            <span className={`font-semibold ${isUrgent ? 'text-red-600 font-bold' : 'text-stone-800'}`}>
              {formatDate(spk.deadline)}
            </span>
          </div>
        </div>

        {/* Hasil QC Ukur (Tampil jika sudah diisi) */}
        {spk.qc_meter_riil && (
          <div className="hidden sm:flex mt-2 items-center justify-between text-xs bg-emerald-50/70 border border-emerald-200/70 px-3 py-1.5 rounded-lg text-emerald-900">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-ruler-combined text-emerald-700 text-xs"></i>
              <span>
                <strong>Hasil Ukur QC:</strong> {spk.qc_meter_riil} Meter 
                {spk.qc_roll_details && spk.qc_roll_details.length > 0 && (
                  <span className="text-emerald-700 ml-1">
                    ({spk.qc_roll_details.length} Roll)
                  </span>
                )}
              </span>
            </div>
            {spk.qc_catatan && (
              <span className="text-[11px] text-emerald-800 italic truncate max-w-[200px]">
                "{spk.qc_catatan}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* 6-Stage Timeline Progress Bar */}
      <div className="px-3 sm:px-5 py-2.5 sm:py-3 bg-[#FAF8F5] border-t border-stone-100">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1 bg-stone-200 z-0" />
          <div 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 z-0 transition-all duration-300"
            style={{ 
              width: `${Math.min(100, Math.max(0, ((spk.current_stage - 1) / 5) * 100))}%` 
            }}
          />

          {PRODUCTION_STAGES.map((stage) => {
            const isCompleted = stage.id < spk.current_stage;
            const isCurrent = stage.id === spk.current_stage;

            return (
              <div 
                key={stage.id} 
                className="relative z-1 flex flex-col items-center group cursor-pointer"
                onClick={() => {
                  if (!canEdit) return;
                  if (stage.id === 5) onOpenQCModal(spk);
                }}
                title={`${stage.name} - ${stage.description}`}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shadow-2xs ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-600' 
                    : isCurrent 
                      ? 'bg-amber-500 text-white ring-3 ring-amber-200 animate-pulse' 
                      : 'bg-white text-stone-400 border border-stone-300'
                }`}>
                  {isCompleted ? (
                    <i className="fa-solid fa-check text-[10px] sm:text-xs"></i>
                  ) : (
                    <i className={`${getStageIconClass(stage.id)} text-[10px] sm:text-xs`}></i>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Label Tahapan */}
        <div className="grid grid-cols-6 text-center mt-2 text-[9px] sm:text-[11px] font-medium text-stone-500">
          {PRODUCTION_STAGES.map(stage => {
            const isCurrent = stage.id === spk.current_stage;
            const isCompleted = stage.id < spk.current_stage;
            return (
              <span 
                key={stage.id} 
                className={`truncate px-0.5 ${
                  isCurrent 
                    ? 'font-bold text-amber-800' 
                    : isCompleted 
                      ? 'text-emerald-700 font-semibold' 
                      : 'text-stone-400'
                }`}
              >
                {stage.shortName}
              </span>
            );
          })}
        </div>
      </div>

      {/* Footer Kartu & Tombol Aksi */}
      <div className="p-2.5 sm:px-5 sm:py-3 bg-white border-t border-stone-100 flex items-center justify-between gap-2">
        
        {/* Tombol Lihat Detail (Slide-Up Modal di Mobile) */}
        <button
          onClick={() => onOpenDetail(spk)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all border border-stone-200/80 active:scale-95"
          title="Buka rincian lengkap SPK dalam slide-up modal"
        >
          <i className="fa-solid fa-eye text-stone-500 text-xs"></i>
          <span>Lihat Detail</span>
        </button>

        <div className="flex items-center gap-2">
          
          {/* Tombol Cetak SPK PDF */}
          <button
            onClick={() => onPrintSPK(spk)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all active:scale-95"
            title="Cetak SPK atau simpan PDF 1 Halaman"
          >
            <i className="fa-solid fa-print text-stone-600 text-xs"></i>
            <span className="hidden sm:inline">Cetak</span>
          </button>

          {/* Tombol Aksi Lanjut Tahap / Input QC */}
          {canEdit && spk.current_stage < 6 && (
            <button
              onClick={() => {
                if (spk.current_stage === 5) {
                  onOpenQCModal(spk);
                } else {
                  onAdvanceStage(spk);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <span>{spk.current_stage === 5 ? 'Input QC' : 'Lanjut'}</span>
              <i className="fa-solid fa-arrow-right text-gold-300 text-[10px]"></i>
            </button>
          )}

          {spk.current_stage === 6 && (
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <i className="fa-solid fa-circle-check text-emerald-600 text-xs"></i>
              <span>Selesai</span>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
