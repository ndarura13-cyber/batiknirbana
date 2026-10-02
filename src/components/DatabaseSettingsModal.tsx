import React from 'react';

interface DatabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig?: (url: string, key: string) => void;
  isDbConnected: boolean;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  isDbConnected,
}) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lgxskxovlyllyslnpsci.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '••••••••••••••••••••••••••••••••••••••••••••';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-all animate-fadeIn">
      {/* Slide-Up Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-0 sm:my-6 max-h-[92vh] flex flex-col transform transition-all animate-slideUp sm:animate-scaleIn">
        
        {/* Handle Bar untuk Mobile Drag Feel */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Header Modal */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-stone-900 to-brand-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <i className="fa-solid fa-database text-emerald-400 text-base"></i>
            <h2 className="text-base font-bold tracking-tight">
              Koneksi Database Supabase
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Konten Sederhana & Bersih */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Status Koneksi */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <i className="fa-solid fa-circle-check text-lg"></i>
              </div>
              <div>
                <span className="text-base font-extrabold text-emerald-900 leading-tight block">
                  Tersambung
                </span>
                <span className="text-xs text-emerald-700 font-medium">
                  Database Cloud PostgreSQL Aktif
                </span>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Isian Form Read-Only */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Supabase Project URL
                </label>
                <span className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                  <i className="fa-solid fa-lock text-[10px]"></i>
                  Terkunci (.env)
                </span>
              </div>
              <input
                type="text"
                readOnly
                value={supabaseUrl}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 text-xs font-mono select-all cursor-not-allowed focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Supabase Anon / Public Key
                </label>
                <span className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                  <i className="fa-solid fa-lock text-[10px]"></i>
                  Terkunci (.env)
                </span>
              </div>
              <input
                type="password"
                readOnly
                value={supabaseKey}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-600 text-xs font-mono cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          {/* Tombol Tutup */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md transition-all text-center"
            >
              Tutup
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
