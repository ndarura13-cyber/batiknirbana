import React from 'react';
import { UserRole, Pabrik } from '../types/spk';

interface HeaderProps {
  currentRole: UserRole;
  currentPabrik?: Pabrik;
  onOpenRoleModal: () => void;
  onOpenNewSPKModal: () => void;
  onOpenDbModal: () => void;
  onRequestLogout: () => void;
  onBackToLanding: () => void;
  isDbConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentPabrik,
  onOpenRoleModal,
  onOpenNewSPKModal,
  onOpenDbModal,
  onRequestLogout,
  onBackToLanding,
  isDbConnected,
}) => {
  const getRoleBadge = () => {
    if (currentRole === 'admin') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-brand-900 text-white shadow-xs border border-gold-300/40">
          <i className="fa-solid fa-shield-halved text-gold-300 text-xs"></i>
          <span className="hidden sm:inline">Admin Pusat</span>
          <span className="sm:hidden font-bold">Admin</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-900 border border-gold-300">
        <i className="fa-solid fa-industry text-gold-700 text-xs"></i>
        <span className="truncate max-w-[85px] sm:max-w-none">{currentPabrik}</span>
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E4DC] transition-all no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo & Identitas Brand (SELALU TERLIHAT JELAS DI MOBILE & DESKTOP) */}
          <button onClick={onBackToLanding} className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 text-left hover:opacity-80 transition-opacity" title="Kembali ke Beranda">
            <div className="relative shrink-0">
              <img
                src="/logo.png"
                alt="Logo Nusantara Lestari"
                className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-contain p-0.5 border border-[#E2DCDB] shadow-xs bg-white"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 border-2 border-white rounded-full" title="Sistem Aktif" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-wider text-base sm:text-2xl font-bold text-brand-900 truncate">
                  BATIK NIRBANA
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide truncate">
                <span>Rumah dari Batik Indonesia</span>
                <span className="hidden sm:inline"> • Surakarta</span>
              </p>
            </div>
          </button>

          {/* Aksi Navigasi & Kontrol Header */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Tombol Ke Beranda */}
            <button
              onClick={onBackToLanding}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 transition-all"
            >
              <i className="fa-solid fa-house text-stone-500 text-xs"></i>
              <span>Beranda</span>
            </button>

            {/* Status Koneksi SQL Cloud (Desktop & Tablet) */}
            <button
              onClick={onOpenDbModal}
              title={isDbConnected ? 'Tersambung ke Supabase SQL' : 'Setup Cloud SQL'}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-all"
            >
              <i className="fa-solid fa-database text-emerald-600 text-xs"></i>
              <span>SQL Terhubung</span>
            </button>

            {/* Tombol Pemilih Peran / User Role */}
            <button
              onClick={onOpenRoleModal}
              className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all border border-stone-200/80 active:scale-95"
              title="Ganti Peran / Ubah PIN"
            >
              {getRoleBadge()}
            </button>

            {/* Tombol Kunci / Keluar (Desktop) */}
            <button
              onClick={onRequestLogout}
              className="hidden sm:flex p-2 rounded-xl text-stone-400 hover:text-red-700 hover:bg-red-50 border border-stone-200 transition-all"
              title="Kunci aplikasi & keluar"
            >
              <i className="fa-solid fa-lock text-sm"></i>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
