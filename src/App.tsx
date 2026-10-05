import React, { useState, useEffect, useRef } from 'react';
import { SPKItem, UserRole, Pabrik, StageId } from './types/spk';
import {
  apiFetchSPK,
  apiSaveSPK,
  apiUpdateStage,
  apiUpdateQC,
  apiDeleteSPK,
  subscribeToSPKChanges,
  isSupabaseConfigured,
  cleanupLegacyLocalStorage
} from './lib/supabase';
import { Header } from './components/Header';
import { DashboardSummary } from './components/DashboardSummary';
import { SPKCard } from './components/SPKCard';
import { SPKModalForm } from './components/SPKModalForm';
import { QCModal } from './components/QCModal';
import { SPKPrintView } from './components/SPKPrintView';
import { SPKDetailModal } from './components/SPKDetailModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { DatabaseSettingsModal } from './components/DatabaseSettingsModal';
import { LogoutConfirmationModal } from './components/LogoutConfirmationModal';
import { LoginScreen } from './components/LoginScreen';
import { BottomNavDock } from './components/BottomNavDock';
import { SPKPublicPreview } from './components/SPKPublicPreview';
import { AdminDeleteConfirmationModal } from './components/AdminDeleteConfirmationModal';
import { LandingPage } from './components/LandingPage';

export const App: React.FC = () => {
  // Sesi Keamanan Login PIN Wajib
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('NL_AUTH_LOGGED_IN') === 'true';
    } catch {
      return false;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      return (sessionStorage.getItem('NL_AUTH_ROLE') as UserRole) || 'admin';
    } catch {
      return 'admin';
    }
  });

  const [currentPabrik, setCurrentPabrik] = useState<Pabrik | undefined>(() => {
    try {
      return (sessionStorage.getItem('NL_AUTH_PABRIK') as Pabrik) || undefined;
    } catch {
      return undefined;
    }
  });

  // State Data SPK dari Supabase
  const [spkList, setSpkList] = useState<SPKItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter & Pencarian
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State (Default 5 di Mobile, 10 di Desktop)
  const isMobileScreen = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  const [itemsPerPage, setItemsPerPage] = useState<number>(isMobileScreen ? 5 : 10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Visibility Tombol Buat SPK Atas vs Floating FAB
  const topSPKButtonRef = useRef<HTMLDivElement>(null);
  const [isTopButtonVisible, setIsTopButtonVisible] = useState(true);

  // Modals & Dialogs
  const [isNewSPKOpen, setIsNewSPKOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [selectedSPKForQC, setSelectedSPKForQC] = useState<SPKItem | null>(null);
  const [selectedSPKForPrint, setSelectedSPKForPrint] = useState<SPKItem | null>(null);
  const [selectedSPKForDetail, setSelectedSPKForDetail] = useState<SPKItem | null>(null);

  // Status Parameter Halaman Tracking Barcode / Preview Publik
  const [publicSpkParam, setPublicSpkParam] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('spk') || params.get('preview') || null;
    } catch {
      return null;
    }
  });

  // Landing Page vs App routing: tampilkan landing jika tidak ada param ?app=1 / ?spk=
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const hasAppParam = params.get('app') === '1';
      const hasSpkParam = !!(params.get('spk') || params.get('preview'));
      return !hasAppParam && !hasSpkParam;
    } catch {
      return true;
    }
  });

  // Handler: Masuk ke Sistem SPK dari Landing Page
  const handleEnterApp = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('app', '1');
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.warn(e);
    }
    setShowLanding(false);
  };

  // Handler: Kembali ke Landing Page
  const handleBackToLanding = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('app');
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.warn(e);
    }
    setShowLanding(true);
  };

  // State Hapus SPK Khusus Otorisasi Admin
  const [spkToDelete, setSpkToDelete] = useState<SPKItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Reset pagination ke halaman 1 saat filter atau pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter]);

  const isDbConnected = isSupabaseConfigured();

  // Muat Data SPK Langsung dari PostgreSQL Supabase
  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setIsRefreshing(true);
    cleanupLegacyLocalStorage();
    const data = await apiFetchSPK();
    setSpkList(data);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const unsubscribe = subscribeToSPKChanges(() => {
        loadData(false);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [isAuthenticated]);

  // Observer: Deteksi apakah tombol SPK atas terlihat di viewport
  useEffect(() => {
    const target = topSPKButtonRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTopButtonVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isAuthenticated, spkList.length]);

  // Reset page ke 1 saat filter, search, atau itemsPerPage berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchQuery, itemsPerPage]);

  // Handler: Berhasil Login PIN
  const handleLoginSuccess = (role: UserRole, pabrik?: Pabrik) => {
    try {
      sessionStorage.setItem('NL_AUTH_LOGGED_IN', 'true');
      sessionStorage.setItem('NL_AUTH_ROLE', role);
      if (pabrik) {
        sessionStorage.setItem('NL_AUTH_PABRIK', pabrik);
        setSelectedFilter(pabrik);
      } else {
        sessionStorage.removeItem('NL_AUTH_PABRIK');
        setSelectedFilter('all');
      }
    } catch (e) {
      console.warn(e);
    }

    setCurrentRole(role);
    setCurrentPabrik(pabrik);
    setIsAuthenticated(true);
  };

  // Handler: Logout Konfirmasi
  const handleConfirmLogout = () => {
    try {
      sessionStorage.removeItem('NL_AUTH_LOGGED_IN');
      sessionStorage.removeItem('NL_AUTH_ROLE');
      sessionStorage.removeItem('NL_AUTH_PABRIK');
    } catch (e) {
      console.warn(e);
    }
    setIsAuthenticated(false);
    setIsLogoutConfirmOpen(false);
  };

  // Handler: Tambah SPK Baru
  const handleCreateSPK = async (data: Omit<SPKItem, 'id'>) => {
    const created = await apiSaveSPK(data);
    if (created) {
      setSpkList(prev => [created, ...prev]);
    } else {
      loadData(false);
    }
  };

  // Handler: Maju Tahapan Alur
  const handleAdvanceStage = async (spk: SPKItem) => {
    if (spk.current_stage >= 6) return;
    const nextStage = (spk.current_stage + 1) as StageId;
    const picName = currentRole === 'admin' ? 'Admin Nusantara Lestari' : `PIC ${currentPabrik || spk.pabrik}`;

    setSpkList(prev => prev.map(item => {
      if (item.id === spk.id) {
        return {
          ...item,
          current_stage: nextStage,
          pic_terakhir: picName,
          status_design: nextStage > 1 ? 'Approved' : item.status_design,
          updated_at: new Date().toISOString(),
        };
      }
      return item;
    }));

    const success = await apiUpdateStage(spk.id, nextStage, picName);
    if (!success) {
      loadData(false);
    }
  };

  // Handler: Simpan Hasil QC Ukur
  const handleSaveQC = async (
    spkId: string,
    totalMeter: number,
    rollDetails: { roll: number; meter: number }[],
    catatan: string
  ) => {
    const picName = currentRole === 'admin' ? 'Admin Nusantara Lestari' : `PIC ${currentPabrik || 'QC'}`;

    setSpkList(prev => prev.map(item => {
      if (item.id === spkId) {
        return {
          ...item,
          current_stage: 5,
          qc_meter_riil: totalMeter,
          qc_roll_details: rollDetails,
          qc_catatan: catatan,
          pic_terakhir: picName,
          updated_at: new Date().toISOString(),
        };
      }
      return item;
    }));

    const success = await apiUpdateQC(spkId, totalMeter, rollDetails, catatan, picName);
    if (!success) {
      loadData(false);
    }
  };

  // Handler: Ganti Peran
  const handleSelectRole = (role: UserRole, pabrik?: Pabrik) => {
    try {
      sessionStorage.setItem('NL_AUTH_ROLE', role);
      if (pabrik) {
        sessionStorage.setItem('NL_AUTH_PABRIK', pabrik);
        setSelectedFilter(pabrik);
      } else {
        sessionStorage.removeItem('NL_AUTH_PABRIK');
        setSelectedFilter('all');
      }
    } catch (e) {
      console.warn(e);
    }

    setCurrentRole(role);
    setCurrentPabrik(pabrik);
  };

  // Handler: Buka Halaman Tracking Preview (Hasil Scan Barcode)
  const handleOpenTrackingPreview = (spk: SPKItem) => {
    setPublicSpkParam(spk.nomor_spk);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('spk', spk.nomor_spk);
      window.history.pushState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  const handleBackToApp = () => {
    setPublicSpkParam(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('spk');
      url.searchParams.delete('preview');
      window.history.pushState({}, '', url.pathname);
    } catch {
      // ignore
    }
  };

  // Handler: Hapus SPK (Otorisasi PIN Admin Pusat)
  const handleRequestDelete = (spk: SPKItem) => {
    setSpkToDelete(spk);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (spkId: string): Promise<boolean> => {
    const res = await apiDeleteSPK(spkId);
    if (res.success) {
      setSpkList(prev => prev.filter(item => item.id !== spkId));
      if (selectedSPKForDetail?.id === spkId) setSelectedSPKForDetail(null);
      if (selectedSPKForQC?.id === spkId) setSelectedSPKForQC(null);
      if (selectedSPKForPrint?.id === spkId) setSelectedSPKForPrint(null);
      return true;
    }
    return false;
  };

  // Filter List SPK
  const filteredSPK = spkList.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.nomor_spk.toLowerCase().includes(q) ||
        item.nama_produksi.toLowerCase().includes(q) ||
        item.nama_pemesan.toLowerCase().includes(q) ||
        item.bahan.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return item.current_stage < 6;
    if (selectedFilter === 'urgent') {
      if (item.current_stage >= 6) return false;
      if (item.is_urgent) return true;
      const now = new Date();
      const deadline = new Date(item.deadline);
      const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));
      return diffDays <= 2;
    }
    if (selectedFilter === 'in_progress') {
      return item.current_stage >= 2 && item.current_stage <= 4;
    }
    if (selectedFilter === 'ready') return item.current_stage >= 5;
    if (selectedFilter === 'Pasar Kembang') return item.pabrik === 'Pasar Kembang';
    if (selectedFilter === 'Bayangkara') return item.pabrik === 'Bayangkara';
    if (selectedFilter === 'Nusupan') return item.pabrik === 'Nusupan';

    return true;
  });

  // Kalkulasi Pagination
  const totalPages = Math.ceil(filteredSPK.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSPK = filteredSPK.slice(startIndex, startIndex + itemsPerPage);

  const canUserEdit = (item: SPKItem) => {
    if (currentRole === 'admin') return true;
    if (currentPabrik && item.pabrik === currentPabrik) return true;
    return false;
  };

  const urgentCount = spkList.filter(s => {
    if (s.current_stage >= 6) return false;
    if (s.is_urgent) return true;
    const now = new Date();
    const deadline = new Date(s.deadline);
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 2;
  }).length;

  // JIKA MEMBUKA LANDING PAGE (URL tidak memiliki ?app=1 atau ?spk=)
  if (showLanding) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  // JIKA MEMBUKA LINK TRACKING BARCODE / PREVIEW PUBLIK (Dapat dibuka tanpa login)
  if (publicSpkParam) {
    return (
      <SPKPublicPreview
        nomorSpk={publicSpkParam}
        onBackToApp={handleBackToApp}
      />
    );
  }

  // JIKA BELUM LOGIN: LAYAR LOGIN PIN WAJIB
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} onBackToLanding={handleBackToLanding} />;
  }

  // JIKA SUDAH LOGIN: TAMPILKAN DASHBOARD PRODUKSI LENGKAP
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#1E1E1E]">

      {/* Header Utama Responsif */}
      <Header
        currentRole={currentRole}
        currentPabrik={currentPabrik}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenNewSPKModal={() => setIsNewSPKOpen(true)}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onRequestLogout={() => setIsLogoutConfirmOpen(true)}
        isDbConnected={isDbConnected}
      />

      {/* Konten Utama (Diberi padding bawah pb-28 di mobile agar tidak tertutup floating dock) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 sm:pb-12">

        {/* Banner Status Supabase */}
        {!isDbConnected && (
          <div className="mb-4 sm:mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start justify-between gap-3 text-amber-900 shadow-xs">
            <div className="flex items-center gap-2.5">
              <i className="fa-solid fa-database text-amber-700 text-lg shrink-0"></i>
              <div className="text-xs sm:text-sm">
                <strong>Supabase Belum Dihubungkan di .env:</strong> Isi <code>.env</code> Anda untuk cloud PostgreSQL terpusat.
              </div>
            </div>
            <button
              onClick={() => setIsDbModalOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-800 text-white text-xs font-bold hover:bg-amber-900"
            >
              Setup Supabase
            </button>
          </div>
        )}

        {/* Ringkasan Dashboard */}
        <DashboardSummary
          spkList={spkList}
          selectedFilter={selectedFilter}
          onSelectFilter={(tab) => {
            setSelectedFilter(tab);
            setCurrentPage(1);
          }}
        />

        {/* Section Header: Progres Produksi, Tombol Buat SPK Baru yang Menonjol & Pencarian */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-xl font-bold text-stone-900 tracking-tight">
              Progres Produksi
            </h2>
            <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800">
              {filteredSPK.length}
            </span>
            <button
              onClick={() => loadData(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Refresh data Supabase"
            >
              <i className={`fa-solid fa-arrows-rotate text-xs ${isRefreshing ? 'fa-spin text-brand-800' : ''}`}></i>
            </button>
          </div>

          <div className="w-full sm:w-72">
            {/* Kotak Pencarian */}
            <div className="relative w-full">
              <i className="fa-solid fa-magnifying-glass text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 text-xs"></i>
              <input
                type="text"
                placeholder="Cari motif, pemesan, SPK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-700/50 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Tombol Buat SPK Baru Memanjang Di Atas Kartu SPK (Hanya Desktop/Tablet, di Mobile disembunyikan karena sudah ada tombol bulat di bilah navigasi bawah) */}
        <div ref={topSPKButtonRef} className="mb-4 sm:mb-5 hidden sm:block">
          <button
            type="button"
            onClick={() => setIsNewSPKOpen(true)}
            className="w-full py-3 sm:py-3.5 px-5 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 hover:from-black hover:to-brand-950 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 border border-gold-300/40 active:scale-[0.99] group"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-plus text-gold-300 text-xs"></i>
            </div>
            <span className="tracking-wide">Buat Baru</span>
          </button>
        </div>

        {/* List Kartu SPK (Paginated) */}
        {loading ? (
          <div className="py-16 text-center text-stone-500 text-sm">
            <i className="fa-solid fa-spinner fa-spin text-2xl mb-2 text-brand-800 block"></i>
            Menghubungkan ke database Supabase...
          </div>
        ) : filteredSPK.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs">
            <i className="fa-solid fa-industry text-4xl text-stone-300 mx-auto mb-3 block"></i>
            <h3 className="text-base font-bold text-stone-800">
              Tidak ada SPK yang sesuai filter
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Coba ganti kata kunci pencarian atau terbitkan SPK baru.
            </p>
            <button
              onClick={() => setIsNewSPKOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold shadow-sm"
            >
              <i className="fa-solid fa-plus text-gold-300 text-xs"></i>
              <span>Buat Baru</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {paginatedSPK.map(spk => (
              <SPKCard
                key={spk.id}
                spk={spk}
                onAdvanceStage={handleAdvanceStage}
                onOpenQCModal={(item) => setSelectedSPKForQC(item)}
                onPrintSPK={(item) => setSelectedSPKForPrint(item)}
                onOpenDetail={(item) => setSelectedSPKForDetail(item)}
                canEdit={canUserEdit(spk)}
                isAdmin={currentRole === 'admin'}
                onDeleteSPK={handleRequestDelete}
                onOpenTracking={handleOpenTrackingPreview}
              />
            ))}
          </div>
        )}

        {/* PAGINATION KONTROL ELEGAN */}
        {filteredSPK.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 sm:px-5 sm:py-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">

            {/* Info Jumlah & Dropdown Per Halaman */}
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span>{startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredSPK.length)} dari {filteredSPK.length}</span>
              <span className="text-stone-300 hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-stone-400">Tampilkan:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold text-stone-800 focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            {/* Tombol Navigasi Halaman */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-stone-700 transition-colors"
              >
                <i className="fa-solid fa-chevron-left text-[10px]"></i>
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              {/* Nomor Halaman */}
              <div className="flex items-center gap-1 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                  if (totalPages > 5 && Math.abs(pageNum - currentPage) > 2) {
                    return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${currentPage === pageNum
                          ? 'bg-brand-900 text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-100'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-stone-700 transition-colors"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Floating Action Button (FAB) Buat SPK Baru Khusus Desktop - Hanya Muncul Saat Tombol Atas Tertutup/Scroll */}
      <button
        type="button"
        onClick={() => setIsNewSPKOpen(true)}
        className={`hidden sm:flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 hover:from-black hover:to-brand-950 text-white font-bold text-sm shadow-xl shadow-brand-950/30 border border-gold-300/50 fixed bottom-6 right-6 z-30 transition-all duration-300 ${isTopButtonVisible
            ? 'opacity-0 translate-y-8 pointer-events-none'
            : 'opacity-100 translate-y-0 active:scale-95'
          }`}
        title="Buat SPK Baru"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <i className="fa-solid fa-plus text-gold-300 text-xs"></i>
        </div>
        <span>Buat Baru</span>
      </button>

      {/* Floating Bottom Navigation Dock Khusus Mobile */}
      <BottomNavDock
        currentTab={selectedFilter}
        onSelectTab={(tab) => {
          setSelectedFilter(tab);
          setCurrentPage(1);
        }}
        onOpenNewSPK={() => setIsNewSPKOpen(true)}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onRequestLogout={() => setIsLogoutConfirmOpen(true)}
        urgentCount={urgentCount}
      />

      {/* Footer Minimalis */}
      <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-500 bg-white no-print hidden sm:block">
        <p className="font-serif text-brand-950 font-bold tracking-wide">
          BATIK NIRBANA
        </p>
        <p className="text-[11px] text-stone-400 mt-0.5">
          Surakarta, Jawa Tengah • Database Cloud PostgreSQL Terintegrasi
        </p>
      </footer>

      {/* Slide-Up Bottom Sheet Modals */}
      <SPKModalForm
        isOpen={isNewSPKOpen}
        onClose={() => setIsNewSPKOpen(false)}
        onSubmit={handleCreateSPK}
        existingCount={spkList.length}
      />

      <QCModal
        isOpen={Boolean(selectedSPKForQC)}
        onClose={() => setSelectedSPKForQC(null)}
        spk={selectedSPKForQC}
        onSaveQC={handleSaveQC}
      />

      <SPKDetailModal
        isOpen={Boolean(selectedSPKForDetail)}
        onClose={() => setSelectedSPKForDetail(null)}
        spk={selectedSPKForDetail}
        onPrintSPK={(item) => setSelectedSPKForPrint(item)}
        onAdvanceStage={handleAdvanceStage}
        onOpenQCModal={(item) => setSelectedSPKForQC(item)}
        canEdit={selectedSPKForDetail ? canUserEdit(selectedSPKForDetail) : false}
        isAdmin={currentRole === 'admin'}
        onRequestDelete={handleRequestDelete}
        onOpenTracking={handleOpenTrackingPreview}
      />

      <SPKPrintView
        isOpen={Boolean(selectedSPKForPrint)}
        onClose={() => setSelectedSPKForPrint(null)}
        spk={selectedSPKForPrint}
      />

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        onLogout={() => setIsLogoutConfirmOpen(true)}
      />

      <DatabaseSettingsModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        isDbConnected={isDbConnected}
      />

      <LogoutConfirmationModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        roleTitle={currentRole === 'admin' ? 'Admin Pusat' : `PIC ${currentPabrik || 'Pabrik'}`}
      />

      <AdminDeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSpkToDelete(null);
        }}
        spk={spkToDelete}
        onConfirmDelete={handleConfirmDelete}
      />

    </div>
  );
};

export default App;
