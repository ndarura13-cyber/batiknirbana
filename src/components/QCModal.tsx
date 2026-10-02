import React, { useState } from 'react';
import { SPKItem, QCRollItem } from '../types/spk';

interface QCModalProps {
  isOpen: boolean;
  onClose: () => void;
  spk: SPKItem | null;
  onSaveQC: (spkId: string, totalMeter: number, rollDetails: QCRollItem[], catatan: string) => void;
}

export const QCModal: React.FC<QCModalProps> = ({
  isOpen,
  onClose,
  spk,
  onSaveQC,
}) => {
  if (!isOpen || !spk) return null;

  const initialRolls: QCRollItem[] = spk.qc_roll_details && spk.qc_roll_details.length > 0
    ? spk.qc_roll_details
    : [
        { roll: 1, meter: 25 },
        { roll: 2, meter: 25 },
      ];

  const [rolls, setRolls] = useState<QCRollItem[]>(initialRolls);
  const [catatan, setCatatan] = useState(spk.qc_catatan || '');

  const totalMeter = rolls.reduce((acc, curr) => acc + (Number(curr.meter) || 0), 0);
  const selisihMeter = totalMeter - spk.jumlah_meter;

  const handleAddRoll = () => {
    setRolls(prev => [
      ...prev,
      { roll: prev.length + 1, meter: 25 }
    ]);
  };

  const handleRemoveRoll = (index: number) => {
    setRolls(prev => prev.filter((_, idx) => idx !== index).map((r, i) => ({ ...r, roll: i + 1 })));
  };

  const handleMeterChange = (index: number, val: number) => {
    setRolls(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], meter: val };
      return copy;
    });
  };

  const handleSave = () => {
    if (totalMeter <= 0) {
      alert('Total meter hasil ukur QC harus lebih dari 0.');
      return;
    }
    onSaveQC(spk.id, totalMeter, rolls, catatan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-all animate-fadeIn">
      {/* Slide-Up Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-0 sm:my-8 max-h-[92vh] flex flex-col transform transition-all animate-slideUp sm:animate-scaleIn">
        
        {/* Handle Bar untuk Mobile Drag Feel */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Header Modal */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-ruler-combined text-emerald-200 text-base"></i>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Pemeriksaan QC Ukur Meter Riil
              </h2>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              {spk.nomor_spk} • {spk.nama_produksi} ({spk.nama_pemesan})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Target SPK Info Banner */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-500 font-medium">Target SPK Awal</span>
              <p className="text-lg font-bold text-stone-900">{spk.jumlah_meter} Meter</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-stone-500 font-medium">Standar Roll Kain Cetak</span>
              <p className="text-xs font-semibold text-stone-700">24 – 30 Meter / Pcs</p>
            </div>
          </div>

          {/* Daftar Input Roll Meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-stone-700">
                Rincian Roll Kain Hasil Cetak:
              </label>
              <button
                type="button"
                onClick={handleAddRoll}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 active:scale-95"
              >
                <i className="fa-solid fa-plus text-[10px]"></i>
                <span>Tambah Roll</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {rolls.map((r, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="w-16 text-xs font-semibold text-stone-600 pl-1">
                    Roll #{r.roll}
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={r.meter}
                      onChange={(e) => handleMeterChange(index, Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs sm:text-sm font-bold bg-white text-center focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="text-xs text-stone-500 font-medium">meter</span>
                  </div>
                  {rolls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRoll(index)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Hapus roll ini"
                    >
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total Meter & Status Selisih */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-semibold block">
                  Total Meter Riil (QC):
                </span>
                <span className="text-2xl font-black text-emerald-950">
                  {totalMeter} Meter
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 block">Selisih vs Target:</span>
                <span className={`text-sm font-bold ${selisihMeter >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {selisihMeter >= 0 ? `+${selisihMeter} m (Cukup)` : `${selisihMeter} m (Kurang)`}
                </span>
              </div>
            </div>
          </div>

          {/* Catatan QC */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Catatan Kondisi Fisik Kain (Opsional):
            </label>
            <input
              type="text"
              placeholder="Contoh: Warna rata sempurna, tanpa cacat motif atau kotoran"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-check text-xs"></i>
              <span>Simpan Hasil QC Ukur</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
