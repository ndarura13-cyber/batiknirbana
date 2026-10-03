import React, { useState, useEffect, useRef } from 'react';
import { SPKItem, UserRole } from '../types/spk';
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
      apiFetchRolePins().then(pins => {
        if (pins && pins.admin) {
          setAdminPin(pins.admin);
        }
      });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen || !spk) return null;

  const handleVerifyAndDelete = async () => {
    setErrorMessage('');

    if (!pinInput.trim()) {
      setErrorMessage('Masukkan PIN Admin Pusat.');
      inputRef.current?.focus();
      return;
    }

    const expectedPin = (adminPin || DEFAULT_PINS.admin || '2205').trim();
    if (pinInput.trim() !== expectedPin) {
      setIsShaking(true);
      setErrorMessage('PIN Admin Pusat salah. Otorisasi hapus ditolak.');
      setPinInput('');
      setTimeout(() => setIsShaking(false), 500);
      inputRef.current?.focus();
      return;
    }

    setIsDeleting(true);
    const success = await onConfirmDelete(spk.id);
    setIsDeleting(false);

    if (success) {
      onClose();
    } else {
      setErrorMessage('Gagal menghapus SPK dari database. Coba lagi.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDeleting) {
      handleVerifyAndDelete();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPinInput(rawVal);
    setErrorMessage('');

    if (rawVal.length === 4) {
      setTimeout(() => {
        const expectedPin = (adminPin || DEFAULT_PINS.admin || '2205').trim();
        if (rawVal.trim() === expectedPin) {
          handleVerifyAndDelete();
        } else {
          setIsShaking(true);
          setErrorMessage('PIN Admin Pusat salah.');
          setPinInput('');
          setTimeout(() => setIsShaking(false), 500);
          inputRef.current?.focus();
        }
      }, 150);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs transition-all animate-fadeIn">
      <div 
        className={`w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden transform transition-all ${
          isShaking ? 'animate-shake' : 'animate-scaleIn'
        }`}
      >
        {/* Header Peringatan Bahaya */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-700 to-red-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <i className="fa-solid fa-triangle-exclamation text-yellow-300 text-base"></i>
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">
                Konfirmasi Hapus SPK
              </h2>
              <p className="text-[11px] text-red-100 font-medium">
                Otorisasi Khusus PIN Admin Pusat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Konten & Info Dokumen yang akan Dihapus */}
        <div className="p-6 space-y-4">
          
          <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200 text-stone-800 text-xs sm:text-sm">
            <div className="font-semibold text-red-950 mb-1 flex items-center gap-1.5">
              <i className="fa-solid fa-trash-can text-red-600"></i>
              <span>Anda akan menghapus dokumen SPK ini secara permanen:</span>
            </div>
            <div className="space-y-1 mt-2 pl-2 border-l-2 border-red-300 font-mono text-xs">
              <div>Nomor SPK: <strong className="text-red-900 font-bold">{spk.nomor_spk}</strong></div>
              <div>Produksi : <span className="text-stone-900 font-medium">{spk.nama_produksi}</span></div>
              <div>Pemesan  : <span className="text-stone-900 font-medium">{spk.nama_pemesan}</span></div>
              <div>Pabrik   : <span className="text-stone-900 font-bold">{spk.pabrik}</span> ({spk.jumlah_meter} Meter)</div>
            </div>
            <p className="mt-2.5 text-[11px] text-red-700 leading-relaxed font-medium">
              <i className="fa-solid fa-circle-exclamation mr-1"></i>
              Tindakan ini tidak dapat dibatalkan. Riwayat tahapan dan data di PostgreSQL Supabase akan dihapus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="text-center">
              <label className="block text-xs font-bold text-stone-800 mb-1.5 uppercase tracking-wider">
                Masukkan PIN Admin Pusat (4 Digit)
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
                  className="w-full text-center tracking-[1em] text-2xl font-bold font-mono py-2.5 rounded-2xl border-2 border-stone-300 focus:border-red-600 focus:ring-4 focus:ring-red-100 bg-stone-50 text-stone-900 outline-none transition-all"
                />
              </div>

              {errorMessage && (
                <div className="mt-2 text-xs font-semibold text-red-600 flex items-center justify-center gap-1.5 animate-fadeIn">
                  <i className="fa-solid fa-circle-xmark text-xs"></i>
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
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-all"
              >
                Batal
              </button>
              
              <button
                type="submit"
                disabled={isDeleting || pinInput.length !== 4}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/30 transition-all active:scale-95"
              >
                {isDeleting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-trash text-xs"></i>
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
