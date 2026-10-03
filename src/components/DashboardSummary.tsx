import React from 'react';
import { SPKItem } from '../types/spk';

interface DashboardSummaryProps {
  spkList: SPKItem[];
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  spkList,
  selectedFilter,
  onSelectFilter,
}) => {
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const [isStickyActive, setIsStickyActive] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!cardsRef.current) return;
      const rect = cardsRef.current.getBoundingClientRect();
      // Aktif saat bagian bawah kartu metrik sudah terlewat di atas header
      setIsStickyActive(rect.bottom <= 70);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalActive = spkList.filter(s => s.current_stage < 6).length;
  const urgentCount = spkList.filter(s => {
    if (s.current_stage >= 6) return false;
    if (s.is_urgent) return true;
    const now = new Date();
    const deadline = new Date(s.deadline);
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 2;
  }).length;

  const inProgressCount = spkList.filter(s => s.current_stage >= 2 && s.current_stage <= 4).length;
  const readyToShipCount = spkList.filter(s => s.current_stage >= 5).length;

  return (
    <div className="mb-5 sm:mb-8">

      {/* Sticky Compressed Strip (Aktif ketika kartu metrik tertutup scroll ke bawah) */}
      <div 
        className={`fixed top-16 sm:top-20 inset-x-0 z-30 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300 pointer-events-none no-print ${
          isStickyActive 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-lg p-1.5 sm:p-2 grid grid-cols-4 gap-1.5 sm:gap-2.5">

          {/* 1. SPK Aktif */}
          <button
            type="button"
            onClick={() => onSelectFilter(selectedFilter === 'active' ? 'all' : 'active')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 px-2 py-2 sm:px-3 sm:py-2 rounded-xl transition-all border ${
              selectedFilter === 'active'
                ? 'bg-brand-900 text-white border-brand-950 shadow-xs ring-1 ring-gold-400/50'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200/70 shadow-2xs'
            }`}
            title="SPK Aktif (Proyek Berjalan)"
          >
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 ${
              selectedFilter === 'active' ? 'bg-white/20 text-gold-300' : 'bg-brand-50 text-brand-800'
            }`}>
              <i className="fa-solid fa-industry text-xs"></i>
            </div>
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="text-xs sm:text-base font-extrabold tracking-tight">
                {totalActive}
              </span>
              <span className={`hidden sm:inline text-xs font-semibold truncate ${
                selectedFilter === 'active' ? 'text-brand-100' : 'text-stone-600'
              }`}>
                Active SPK
              </span>
            </div>
          </button>

          {/* 2. Mendesak / Urgent */}
          <button
            type="button"
            onClick={() => onSelectFilter(selectedFilter === 'urgent' ? 'all' : 'urgent')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 px-2 py-2 sm:px-3 sm:py-2 rounded-xl transition-all border ${
              selectedFilter === 'urgent'
                ? 'bg-amber-600 text-white border-amber-700 shadow-xs ring-1 ring-amber-300'
                : urgentCount > 0
                  ? 'bg-amber-50 hover:bg-amber-100/80 text-amber-950 border-amber-300 shadow-2xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200/70 shadow-2xs'
            }`}
            title="Mendesak / Perlu Atensi"
          >
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 ${
              selectedFilter === 'urgent'
                ? 'bg-white/20 text-white'
                : urgentCount > 0
                  ? 'bg-amber-200 text-amber-700 animate-pulse'
                  : 'bg-stone-100 text-stone-500'
            }`}>
              <i className="fa-solid fa-fire-flame-curved text-xs"></i>
            </div>
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="text-xs sm:text-base font-extrabold tracking-tight">
                {urgentCount}
              </span>
              <span className={`hidden sm:inline text-xs font-semibold truncate ${
                selectedFilter === 'urgent' ? 'text-amber-100' : 'text-stone-600'
              }`}>
                Mendesak
              </span>
            </div>
          </button>

          {/* 3. Sedang Diproses (Cetak / QC) */}
          <button
            type="button"
            onClick={() => onSelectFilter(selectedFilter === 'in_progress' ? 'all' : 'in_progress')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 px-2 py-2 sm:px-3 sm:py-2 rounded-xl transition-all border ${
              selectedFilter === 'in_progress'
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs ring-1 ring-blue-300'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200/70 shadow-2xs'
            }`}
            title="Proses Pabrik (Bahan, Cetak, QC)"
          >
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 ${
              selectedFilter === 'in_progress' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
            }`}>
              <i className="fa-solid fa-gears text-xs"></i>
            </div>
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="text-xs sm:text-base font-extrabold tracking-tight">
                {inProgressCount}
              </span>
              <span className={`hidden sm:inline text-xs font-semibold truncate ${
                selectedFilter === 'in_progress' ? 'text-blue-100' : 'text-stone-600'
              }`}>
                Proses Pabrik
              </span>
            </div>
          </button>

          {/* 4. Siap Kirim & Selesai */}
          <button
            type="button"
            onClick={() => onSelectFilter(selectedFilter === 'ready' ? 'all' : 'ready')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 px-2 py-2 sm:px-3 sm:py-2 rounded-xl transition-all border ${
              selectedFilter === 'ready'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-1 ring-emerald-300'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200/70 shadow-2xs'
            }`}
            title="Siap Kirim & Finishing"
          >
            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 ${
              selectedFilter === 'ready' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <i className="fa-solid fa-truck-fast text-xs"></i>
            </div>
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="text-xs sm:text-base font-extrabold tracking-tight">
                {readyToShipCount}
              </span>
              <span className={`hidden sm:inline text-xs font-semibold truncate ${
                selectedFilter === 'ready' ? 'text-emerald-100' : 'text-stone-600'
              }`}>
                Siap Kirim
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* Judul & Deskripsi Ringkasan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 sm:mb-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Ringkasan Produksi</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Pemantauan langsung proyek aktif, prioritas mendesak, dan kesiapan pengiriman
          </p>
        </div>
      </div>

      {/* Grid Kartu Metrik Ringkasan Utama */}
      <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">

        {/* 1. SPK Aktif */}
        <button
          onClick={() => onSelectFilter('active')}
          className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 shadow-xs border ${selectedFilter === 'active'
            ? 'ring-2 ring-brand-800 scale-[1.02]'
            : 'hover:shadow-md'
            } bg-[#68131B] text-white border-brand-900`}
        >
          <div className="flex items-center justify-between text-brand-200 mb-1">
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
              Active SPK
            </span>
            <i className="fa-solid fa-industry text-sm opacity-80"></i>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {totalActive}
            </span>
            <span className="text-[10px] sm:text-xs text-brand-200/90 font-medium truncate">
              Proyek berjalan
            </span>
          </div>
        </button>

        {/* 2. Proyek Mendesak / Urgent */}
        <button
          onClick={() => onSelectFilter('urgent')}
          className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 shadow-xs border ${selectedFilter === 'urgent'
            ? 'ring-2 ring-red-600 scale-[1.02]'
            : 'hover:shadow-md'
            } ${urgentCount > 0
              ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-600'
              : 'bg-white text-stone-800 border-stone-200'
            }`}
        >
          <div className="flex items-center justify-between opacity-90 mb-1">
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
              Mendesak / Urgent
            </span>
            <i className="fa-solid fa-fire-flame-curved text-sm text-amber-200 animate-pulse"></i>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {urgentCount}
            </span>
            <span className="text-[10px] sm:text-xs opacity-90 font-medium truncate">
              {urgentCount > 0 ? 'Perlu atensi segera' : 'Jadwal aman terkendali'}
            </span>
          </div>
        </button>

        {/* 3. Sedang Diproses (Cetak / QC) */}
        <button
          onClick={() => onSelectFilter('in_progress')}
          className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 shadow-xs border ${selectedFilter === 'in_progress'
            ? 'ring-2 ring-blue-600 scale-[1.02]'
            : 'hover:shadow-md'
            } bg-white text-stone-800 border-stone-200`}
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
              Proses Pabrik
            </span>
            <i className="fa-solid fa-gears text-sm text-blue-600"></i>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
              {inProgressCount}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium truncate">
              Bahan, Cetak, QC
            </span>
          </div>
        </button>

        {/* 4. Siap Kirim & Selesai */}
        <button
          onClick={() => onSelectFilter('ready')}
          className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 shadow-xs border ${selectedFilter === 'ready'
            ? 'ring-2 ring-emerald-600 scale-[1.02]'
            : 'hover:shadow-md'
            } bg-white text-stone-800 border-stone-200`}
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
              Siap Kirim
            </span>
            <i className="fa-solid fa-truck-fast text-sm text-emerald-600"></i>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
              {readyToShipCount}
            </span>
            <span className="text-[10px] sm:text-xs text-stone-500 font-medium truncate">
              Finishing & Siap Antar
            </span>
          </div>
        </button>

      </div>

      {/* Filter Tabs Pabrik & Kategori */}
      <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-stone-400 font-semibold px-1 shrink-0 flex items-center gap-1">
          <i className="fa-solid fa-filter text-[10px]"></i>
          <span>:</span>
        </span>

        <button
          onClick={() => onSelectFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 ${selectedFilter === 'all'
            ? 'bg-brand-900 text-white shadow-xs'
            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
        >
          <i className="fa-solid fa-table-cells text-[11px]"></i>
          <span>({spkList.length})</span>
        </button>

        {['Pasar Kembang', 'Bayangkara', 'Nusupan'].map((pabrik) => {
          const count = spkList.filter(s => s.pabrik === pabrik && s.current_stage < 6).length;
          const isSelected = selectedFilter === pabrik;
          return (
            <button
              key={pabrik}
              onClick={() => onSelectFilter(pabrik)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 ${isSelected
                ? 'bg-gold-500 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
            >
              <i className="fa-solid fa-location-dot text-[11px]"></i>
              <span>{pabrik}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
