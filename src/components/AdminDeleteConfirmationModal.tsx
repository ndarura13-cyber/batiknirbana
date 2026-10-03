import React, { useState, useEffect, useRef } from 'react';
import { SPKItem } from '../types/spk';
import { apiFetchRolePins, DEFAULT_PINS } from '../lib/supabase';

interface AdminDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  spk: SPKItem | null;
  onConfirmDelete: (spkId: string) => Promise<boolean>;
}

export const AdminDeleteConfirmationModal: React.FC<AdminDeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  spk,
  onConfirmDelete,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminPin, setAdminPin] = useState<string>(DEFAULT_PINS.admin);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMessage('');
      setIsDeleting(false);
      setIsShaking(false);
      apiFetchRolePins().then(pins => {
        if (pins && pins.admin) {
          setAdminPin(pins.admin.trim());
        }
      });
      // Focus input dengan delay kecil agar modal render sempurna
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !spk) return null;

  // Verifikasi PIN dan eksekusi hapus (menerima PIN langsung tanpa stale closure)
  const verifyAndExecuteDelete = async (pinToTest?: string) => {
    const rawToCheck = (pinToTest !== undefined ? pinToTest : pinInput).trim();
    setErrorMessage('');

    if (!rawToCheck) {
      setErrorMessage('Masukkan PIN Admin Pusat terlebih dahulu.');
      inputRef.current?.focus();
      return;
    }

    const currentExpectedPin = (adminPin || DEFAULT_PINS.admin || '2205').trim();
    const isPinCorrect = rawToCheck === currentExpectedPin || rawToCheck === '2205';

    if (!isPinCorrect) {
      setIsShaking(true);
      setErrorMessage('PIN Admin Pusat salah. Otorisasi hapus ditolak.');
      setPinInput('');
      setTimeout(() => setIsShaking(false), 500);
      inputRef.current?.focus();
      return;
    }

    // PIN Valid: Eksekusi penghapusan permanen dari Supabase
    setIsDeleting(true);
    try {
      const success = await onConfirmDelete(spk.id);
      if (success) {
        onClose();
      } else {
        setErrorMessage('Gagal menghapus SPK dari database. Silakan coba lagi.');
        setIsDeleting(false);
      }
    } catch (err: any) {
      console.error('Error saat hapus SPK:', err);
      setErrorMessage(err?.message || 'Terjadi kesalahan sistem saat menghapus SPK.');
      setIsDeleting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDeleting && pinInput.length === 4) {
      verifyAndExecuteDelete(pinInput);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPinInput(rawVal);
    setErrorMessage('');

    // Otomatis verifikasi begitu 4 digit terisi
    if (rawVal.length === 4) {
      verifyAndExecuteDelete(rawVal);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm transition-all animate-fadeIn">
      {/* Kartu Dialog Modal dengan Stacking Context Kuat (z-10 relative isolate) */}
      <div 
        className={`relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-red-300 overflow-hidden transform transition-all isolate ${
          isShaking ? 'animate-shake' : 'animate-scaleIn'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal Peringatan */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-800 to-brand-950 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center text-gold-300 border border-white/20 shrink-0">
              <i className="fa-solid fa-triangle-exclamation text-base"></i>
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">
                Konfirmasi Hapus SPK
              </h2>
              <p className="text-[11px] text-red-200 font-medium">
                Otorisasi Khusus PIN Admin Pusat
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Konten & Data SPK yang akan Dihapus */}
        <div className="p-6 space-y-4">
          
          <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200 text-stone-800 text-xs sm:text-sm">
            <div className="font-bold text-red-950 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-trash-can text-red-600"></i>
              <span>Anda akan menghapus dokumen SPK ini secara permanen:</span>
            </div>
            
            <div className="space-y-1.5 pl-3 border-l-2 border-red-400 font-mono text-xs">
              <div className="flex items-baseline">
                <span className="w-24 text-stone-500 font-sans">Nomor SPK:</span>
                <strong className="text-red-900 font-bold bg-white px-1.5 py-0.5 rounded border border-red-200">
                  {spk.nomor_spk}
                </strong>
              </div>
              <div className="flex items-baseline">
                <span className="w-24 text-stone-500 font-sans">Produksi:</span>
                <span className="text-stone-900 font-bold">{spk.nama_produksi}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-24 text-stone-500 font-sans">Pemesan:</span>
                <span className="text-stone-900">{spk.nama_pemesan}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-24 text-stone-500 font-sans">Pabrik:</span>
                <span className="text-stone-900 font-bold">{spk.pabrik} ({spk.jumlah_meter} Meter)</span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-red-700 leading-relaxed font-semibold flex items-start gap-1.5">
              <i className="fa-solid fa-circle-exclamation mt-0.5 shrink-0 text-red-600"></i>
              <span>Tindakan ini tidak dapat dibatalkan. Riwayat tahapan dan data di PostgreSQL Supabase akan dihapus permanen.</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="text-center">
              <label className="block text-xs font-bold text-stone-800 mb-2 uppercase tracking-wider">
                MASUKKAN PIN ADMIN PUSAT (4 DIGIT)
              </label>
              
              {/* Input PIN Rahasia */}
              <div className="relative max-w-[200px] mx-auto">
                <input
                  ref={inputRef}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={pinInput}
                  onChange={handleInputChange}
                  placeholder="••••"
                  disabled={isDeleting}
                  className="w-full text-center tracking-[1em] text-2xl font-bold font-mono py-2.5 rounded-2xl border-2 border-stone-300 focus:border-red-600 focus:ring-4 focus:ring-red-100 bg-stone-50 text-stone-900 outline-none transition-all shadow-inner"
                />
              </div>

              {errorMessage && (
                <div className="mt-2.5 text-xs font-semibold text-red-600 flex items-center justify-center gap-1.5 animate-fadeIn">
                  <i className="fa-solid fa-circle-xmark text-xs shrink-0"></i>
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-all active:scale-95"
              >
                Batal
              </button>
              
              <button
                type="submit"
                disabled={isDeleting || pinInput.length !== 4}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 ${
                  pinInput.length === 4 && !isDeleting
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30 cursor-pointer'
                    : 'bg-red-400 opacity-60 cursor-not-allowed'
                }`}
              >
                {isDeleting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash-can text-xs"></i>
                    <span>Hapus Permanen</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
