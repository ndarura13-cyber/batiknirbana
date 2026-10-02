import React from 'react';

interface BottomNavDockProps {
  currentTab: string;
  onSelectTab: (tabKey: string) => void;
  onOpenNewSPK: () => void;
  onOpenRoleModal: () => void;
  onRequestLogout: () => void;
  urgentCount: number;
}

export const BottomNavDock: React.FC<BottomNavDockProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewSPK,
  onOpenRoleModal,
  onRequestLogout,
  urgentCount,
}) => {
  return (
    <div className="fixed bottom-3 inset-x-3 z-40 sm:hidden no-print">
      {/* 5 Slot Seimbang (Masing-masing 20% lebar): Jarak antar-tombol dijamin 100% sama rata & simetris */}
      <div className="relative bg-stone-950/95 backdrop-blur-md text-white rounded-2xl border border-white/15 shadow-2xl px-1 py-2 flex items-center justify-between">
        
        {/* 1. Home / Semua SPK (Slot 1: 20%) */}
        <button
          type="button"
          onClick={() => onSelectTab('all')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            currentTab === 'all'
              ? 'text-gold-300 font-bold scale-105'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-table-cells text-base"></i>
          <span className="text-[10px] mt-1 font-medium truncate">Semua SPK</span>
        </button>

        {/* 2. SPK Mendesak / Urgent (Slot 2: 20%) */}
        <button
          type="button"
          onClick={() => onSelectTab('urgent')}
          className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-all ${
            currentTab === 'urgent'
              ? 'text-amber-400 font-bold scale-105'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <i className={`fa-solid fa-fire-flame-curved text-base ${urgentCount > 0 ? 'text-amber-400 animate-pulse' : ''}`}></i>
            {urgentCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                {urgentCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium truncate">Mendesak</span>
        </button>

        {/* 3. (+) FRAME BULAT SIMETRIS KHUSUS MENONJOL TEPAT DI TENGAH (Slot 3: 20%) */}
        <div className="flex-1 flex flex-col items-center justify-center relative h-10">
          <div className="absolute -top-6 flex flex-col items-center pointer-events-auto">
            {/* Frame Lingkaran Presisi Tinggi (aspect-square & rounded-full) */}
            <div className="w-[58px] h-[58px] min-w-[58px] min-h-[58px] max-w-[58px] max-h-[58px] rounded-full p-1 bg-stone-950 shadow-2xl border-2 border-gold-400/50 flex items-center justify-center aspect-square shrink-0">
              <button
                type="button"
                onClick={onOpenNewSPK}
                className="w-full h-full rounded-full bg-gradient-to-tr from-brand-900 via-brand-800 to-brand-700 flex items-center justify-center shadow-inner active:scale-90 transition-transform group aspect-square border border-gold-300/70"
                title="Buat SPK Baru"
              >
                <i className="fa-solid fa-plus text-gold-300 text-xl group-hover:scale-110 transition-transform"></i>
              </button>
            </div>
            <span className="text-[9px] font-bold text-gold-300 mt-0.5 tracking-tight drop-shadow-xs">SPK Baru</span>
          </div>
        </div>

        {/* 4. Ganti Peran / Posisi (Slot 4: 20%) */}
        <button
          type="button"
          onClick={onOpenRoleModal}
          className="flex-1 flex flex-col items-center justify-center py-1 text-stone-400 hover:text-white transition-all active:scale-95"
        >
          <i className="fa-solid fa-user-shield text-base"></i>
          <span className="text-[10px] mt-1 font-medium truncate">Peran</span>
        </button>

        {/* 5. Kunci / Logout Aplikasi (Slot 5: 20%) */}
        <button
          type="button"
          onClick={onRequestLogout}
          className="flex-1 flex flex-col items-center justify-center py-1 text-stone-400 hover:text-red-400 transition-all active:scale-95"
          title="Kunci aplikasi & keluar"
        >
          <i className="fa-solid fa-lock text-base"></i>
          <span className="text-[10px] mt-1 font-medium truncate">Kunci</span>
        </button>

      </div>
    </div>
  );
};
