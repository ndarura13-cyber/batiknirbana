import React from 'react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roleTitle?: string;
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  roleTitle = 'Pengguna',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-all animate-fadeIn">
      {/* Container: Slide-up on mobile, centered modal on desktop */}
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all animate-slideUp sm:animate-scaleIn p-6 flex flex-col">
        
        {/* Handle Bar untuk Mobile Drag Feel */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto -mt-2 mb-4 sm:hidden shrink-0" />

        {/* Header Icon & Close */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-800 flex items-center justify-center shadow-xs">
            <i className="fa-solid fa-lock text-xl text-brand-800"></i>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Pertanyaan Konfirmasi */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-stone-900 tracking-tight">
            Kunci & Keluar dari Sistem?
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
            Anda saat ini sedang masuk sebagai <strong className="text-stone-800 font-semibold">{roleTitle}</strong>. 
            Setelah keluar, sistem akan terkunci dan Anda perlu memasukkan PIN kembali untuk dapat mengakses dashboard.
          </p>
        </div>

        {/* Tombol Yes / No Elegan */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-50 transition-colors text-center"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 hover:from-black hover:to-brand-950 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-lock text-gold-300 text-xs"></i>
            <span>Ya, Kunci Aplikasi</span>
          </button>
        </div>

      </div>
    </div>
  );
};
