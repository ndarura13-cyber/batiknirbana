import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

interface GalleryItem {
  id: string;
  nama_produksi: string;
  nama_pemesan?: string;
  bahan?: string;
  obat?: string;
  foto_motif_url: string;
  created_at?: string;
}

type SortOption = 'newest' | 'oldest' | 'az' | 'za';

const SkeletonCard = () => (
  <div className="aspect-square rounded-2xl overflow-hidden bg-stone-200 animate-pulse relative">
    <div className="absolute inset-0 bg-gradient-to-t from-stone-300 via-transparent to-transparent" />
  </div>
);

export const LandingGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Filter & Sort States
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterPemesan, setFilterPemesan] = useState<string>('all');
  const [filterBahan, setFilterBahan] = useState<string>('all');
  const [filterObat, setFilterObat] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('spk')
          .select('id, nama_produksi, nama_pemesan, bahan, obat, foto_motif_url, created_at')
          .not('foto_motif_url', 'is', null)
          .neq('foto_motif_url', '')
          .order('created_at', { ascending: false })
          .limit(300);

        if (!error && data) {
          setItems(data as GalleryItem[]);
        }
      } catch (err) {
        console.warn('Galeri tidak dapat dimuat:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    if (lightboxItem) {
      document.addEventListener('keydown', handler);
    }
    return () => document.removeEventListener('keydown', handler);
  }, [lightboxItem]);

  // Extract unique options for filter dropdowns
  const pemesanOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach(it => {
      if (it.nama_pemesan && it.nama_pemesan.trim()) {
        set.add(it.nama_pemesan.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [items]);

  const bahanOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach(it => {
      if (it.bahan && it.bahan.trim()) {
        set.add(it.bahan.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [items]);

  const obatOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach(it => {
      if (it.obat && it.obat.trim()) {
        set.add(it.obat.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [items]);

  // Reset page to 1 whenever any filter or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, filterPemesan, filterBahan, filterObat]);

  // Filter & Sort Items
  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(item => {
      if (filterPemesan !== 'all') {
        if ((item.nama_pemesan || '').trim().toLowerCase() !== filterPemesan.toLowerCase()) {
          return false;
        }
      }
      if (filterBahan !== 'all') {
        if ((item.bahan || '').trim().toLowerCase() !== filterBahan.toLowerCase()) {
          return false;
        }
      }
      if (filterObat !== 'all') {
        if ((item.obat || '').trim().toLowerCase() !== filterObat.toLowerCase()) {
          return false;
        }
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'oldest') {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      }
      if (sortBy === 'az') {
        return (a.nama_produksi || '').localeCompare(b.nama_produksi || '', 'id', { sensitivity: 'base' });
      }
      if (sortBy === 'za') {
        return (b.nama_produksi || '').localeCompare(a.nama_produksi || '', 'id', { sensitivity: 'base' });
      }
      return 0;
    });

    return result;
  }, [items, sortBy, filterPemesan, filterBahan, filterObat]);

  const isFilterActive =
    filterPemesan !== 'all' ||
    filterBahan !== 'all' ||
    filterObat !== 'all' ||
    sortBy !== 'newest';

  const handleResetFilters = () => {
    setSortBy('newest');
    setFilterPemesan('all');
    setFilterBahan('all');
    setFilterObat('all');
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedItems.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const currentItems = filteredAndSortedItems.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const targetEl = document.getElementById('portofolio-gallery-top');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper to generate pagination numbers
  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (safeCurrentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages);
      }
    }

    return (
      <div className="flex items-center gap-1 sm:gap-2">
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-stone-400 text-sm">
                ...
              </span>
            );
          }
          const pageNum = p as number;
          const isActive = pageNum === safeCurrentPage;
          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => handlePageChange(pageNum)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-brand-900 text-white shadow-md shadow-brand-900/20'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-brand-900'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-stone-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <i className="fa-solid fa-images text-5xl mb-4 opacity-40"></i>
        <p className="text-lg font-semibold">Portofolio Segera Hadir</p>
        <p className="text-sm mt-1">Koleksi motif batik kami akan segera ditampilkan di sini.</p>
      </div>
    );
  }

  return (
    <div id="portofolio-gallery-top">
      {/* ─── SIMPLIFIED FILTER ROW (ICON-ONLY ON MOBILE, INLINE PILLS ON DESKTOP) ─── */}
      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
        {/* Sliders / Reset Button */}
        <button
          type="button"
          onClick={handleResetFilters}
          title={isFilterActive ? 'Klik untuk reset semua filter' : 'Filter Galeri'}
          className={`h-11 w-11 sm:h-10 sm:w-10 rounded-xl border flex items-center justify-center transition-all shrink-0 ${
            isFilterActive
              ? 'bg-brand-900 text-white border-brand-900 shadow-xs hover:bg-brand-950 cursor-pointer'
              : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
          }`}
          aria-label={isFilterActive ? 'Reset filter' : 'Filter galeri'}
        >
          <i className={`fa-solid ${isFilterActive ? 'fa-rotate-left' : 'fa-sliders'} text-xs sm:text-sm`}></i>
        </button>

        {/* 1. Urutkan */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Urutkan Portofolio"
          >
            <option value="newest">Waktu SPK (Terbaru)</option>
            <option value="oldest">Waktu SPK (Terlama)</option>
            <option value="az">Abjad (A - Z)</option>
            <option value="za">Abjad (Z - A)</option>
          </select>
          <div
            className={`h-11 sm:h-10 px-3 sm:px-3.5 rounded-xl border bg-white flex items-center justify-center sm:justify-start gap-2 shadow-2xs transition-all ${
              sortBy !== 'newest'
                ? 'border-brand-700 bg-brand-50/40 text-brand-900 font-semibold'
                : 'border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            <i className="fa-solid fa-arrow-down-short-wide text-brand-800 text-xs sm:text-sm"></i>
            <span className="hidden sm:inline text-xs sm:text-sm font-medium text-stone-700 truncate max-w-[130px] lg:max-w-none">
              {sortBy === 'newest'
                ? 'Waktu SPK (Terbaru)'
                : sortBy === 'oldest'
                ? 'Waktu SPK (Terlama)'
                : sortBy === 'az'
                ? 'Abjad (A - Z)'
                : 'Abjad (Z - A)'}
            </span>
            <i className="hidden sm:inline fa-solid fa-chevron-down text-[10px] text-stone-400 ml-0.5"></i>
            {sortBy !== 'newest' && (
              <span className="sm:hidden absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-700"></span>
            )}
          </div>
        </div>

        {/* 2. Nama Pemesan */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filterPemesan}
            onChange={e => setFilterPemesan(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Filter Nama Pemesan"
          >
            <option value="all">Semua Pemesan</option>
            {pemesanOptions.map(pemesan => (
              <option key={pemesan} value={pemesan}>
                {pemesan}
              </option>
            ))}
          </select>
          <div
            className={`h-11 sm:h-10 px-3 sm:px-3.5 rounded-xl border bg-white flex items-center justify-center sm:justify-start gap-2 shadow-2xs transition-all ${
              filterPemesan !== 'all'
                ? 'border-brand-700 bg-brand-50/40 text-brand-900 font-semibold'
                : 'border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            <i className="fa-solid fa-user text-brand-800 text-xs sm:text-sm"></i>
            <span className="hidden sm:inline text-xs sm:text-sm font-medium text-stone-700 truncate max-w-[120px] lg:max-w-none">
              {filterPemesan === 'all' ? 'Semua Pemesan' : filterPemesan}
            </span>
            <i className="hidden sm:inline fa-solid fa-chevron-down text-[10px] text-stone-400 ml-0.5"></i>
            {filterPemesan !== 'all' && (
              <span className="sm:hidden absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-700"></span>
            )}
          </div>
        </div>

        {/* 3. Jenis Kain */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filterBahan}
            onChange={e => setFilterBahan(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Filter Jenis Kain"
          >
            <option value="all">Semua Kain</option>
            {bahanOptions.map(bahan => (
              <option key={bahan} value={bahan}>
                {bahan}
              </option>
            ))}
          </select>
          <div
            className={`h-11 sm:h-10 px-3 sm:px-3.5 rounded-xl border bg-white flex items-center justify-center sm:justify-start gap-2 shadow-2xs transition-all ${
              filterBahan !== 'all'
                ? 'border-brand-700 bg-brand-50/40 text-brand-900 font-semibold'
                : 'border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            <i className="fa-solid fa-layer-group text-brand-800 text-xs sm:text-sm"></i>
            <span className="hidden sm:inline text-xs sm:text-sm font-medium text-stone-700 truncate max-w-[120px] lg:max-w-none">
              {filterBahan === 'all' ? 'Semua Kain' : filterBahan}
            </span>
            <i className="hidden sm:inline fa-solid fa-chevron-down text-[10px] text-stone-400 ml-0.5"></i>
            {filterBahan !== 'all' && (
              <span className="sm:hidden absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-700"></span>
            )}
          </div>
        </div>

        {/* 4. Jenis Obat */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filterObat}
            onChange={e => setFilterObat(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Filter Jenis Obat"
          >
            <option value="all">Semua Obat</option>
            {obatOptions.map(obat => (
              <option key={obat} value={obat}>
                {obat}
              </option>
            ))}
          </select>
          <div
            className={`h-11 sm:h-10 px-3 sm:px-3.5 rounded-xl border bg-white flex items-center justify-center sm:justify-start gap-2 shadow-2xs transition-all ${
              filterObat !== 'all'
                ? 'border-brand-700 bg-brand-50/40 text-brand-900 font-semibold'
                : 'border-stone-200 text-stone-700 hover:border-stone-300'
            }`}
          >
            <i className="fa-solid fa-flask-vial text-brand-800 text-xs sm:text-sm"></i>
            <span className="hidden sm:inline text-xs sm:text-sm font-medium text-stone-700 truncate max-w-[120px] lg:max-w-none">
              {filterObat === 'all' ? 'Semua Obat' : filterObat}
            </span>
            <i className="hidden sm:inline fa-solid fa-chevron-down text-[10px] text-stone-400 ml-0.5"></i>
            {filterObat !== 'all' && (
              <span className="sm:hidden absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-700"></span>
            )}
          </div>
        </div>
      </div>

      {/* ─── EMPTY STATE IF FILTERS RETURN ZERO ─── */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-center">
          <div className="w-14 h-14 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-400 text-2xl mb-3">
            <i className="fa-solid fa-filter-circle-xmark"></i>
          </div>
          <h4 className="text-base font-bold text-stone-800">
            Tidak ada motif batik yang cocok
          </h4>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mt-1 mb-5">
            Kombinasi filter pemesan, jenis kain, atau obat yang Anda pilih belum memiliki koleksi foto motif.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-brand-900 hover:bg-brand-950 rounded-xl transition-all shadow-sm"
          >
            <i className="fa-solid fa-rotate-left"></i>
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <>
          {/* ─── GALLERY GRID ─── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
            {currentItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 text-left"
                aria-label={`Lihat motif ${item.nama_produksi}`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <img
                  src={item.foto_motif_url}
                  alt={item.nama_produksi}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />

                {/* Badges on Top */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
                  {item.bahan && (
                    <span className="px-2 py-0.5 rounded-md bg-stone-900/65 backdrop-blur-xs text-[10px] font-medium text-white border border-white/10 shadow-xs">
                      {item.bahan}
                    </span>
                  )}
                  {item.obat && (
                    <span className="px-2 py-0.5 rounded-md bg-brand-900/75 backdrop-blur-xs text-[10px] font-medium text-amber-200 border border-amber-200/20 shadow-xs ml-auto">
                      {item.obat}
                    </span>
                  )}
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                  <div className="w-full">
                    <p className="text-white font-bold text-xs sm:text-base leading-snug line-clamp-2">
                      {item.nama_produksi}
                    </p>
                    {item.nama_pemesan && (
                      <p className="text-stone-300 text-[10px] sm:text-xs mt-0.5 truncate">
                        Pemesan: <span className="text-white font-medium">{item.nama_pemesan}</span>
                      </p>
                    )}
                    <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between">
                      <span className="text-gold-300 text-[10px] sm:text-xs font-semibold flex items-center gap-1.5">
                        <i className="fa-solid fa-magnifying-glass-plus text-[10px]"></i>
                        Perbesar Foto
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Bottom Label (always visible when not hovered) */}
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:opacity-0 transition-opacity sm:hidden">
                  <p className="text-white text-[11px] font-semibold truncate leading-tight">
                    {item.nama_produksi}
                  </p>
                  {item.nama_pemesan && (
                    <p className="text-stone-300 text-[9px] truncate">
                      {item.nama_pemesan}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* ─── PAGINATION CONTROLS ─── */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-stone-200">
              <p className="text-xs text-stone-500 order-2 sm:order-1">
                Halaman <span className="font-bold text-stone-800">{safeCurrentPage}</span> dari{' '}
                <span className="font-bold text-stone-800">{totalPages}</span> ({filteredAndSortedItems.length} motif total)
              </p>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                {/* Prev Button */}
                <button
                  onClick={() => handlePageChange(Math.max(1, safeCurrentPage - 1))}
                  disabled={safeCurrentPage === 1}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-brand-900 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center shadow-2xs"
                  aria-label="Halaman Sebelumnya"
                >
                  <i className="fa-solid fa-chevron-left text-xs sm:text-sm"></i>
                </button>

                {/* Number Buttons */}
                {renderPaginationButtons()}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, safeCurrentPage + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-brand-900 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center shadow-2xs"
                  aria-label="Halaman Selanjutnya"
                >
                  <i className="fa-solid fa-chevron-right text-xs sm:text-sm"></i>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── LIGHTBOX MODAL ─── */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-stone-100 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-900 flex items-center justify-center text-sm">
                  <i className="fa-solid fa-palette"></i>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm leading-tight">
                    {lightboxItem.nama_produksi}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Koleksi Motif Batik Nirbana
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                aria-label="Tutup"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Image Preview Container */}
            <div className="flex-1 bg-stone-950 flex items-center justify-center overflow-hidden min-h-[280px] max-h-[58vh]">
              <img
                src={lightboxItem.foto_motif_url}
                alt={lightboxItem.nama_produksi}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Detail Metadata Footer */}
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 shadow-2xs">
                  <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Pemesan
                  </span>
                  <span className="font-semibold text-stone-800 truncate block mt-0.5">
                    {lightboxItem.nama_pemesan || 'Nirbana Batik'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 shadow-2xs">
                  <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Bahan Kain
                  </span>
                  <span className="font-semibold text-stone-800 truncate block mt-0.5">
                    {lightboxItem.bahan || '-'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 shadow-2xs">
                  <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Jenis Obat
                  </span>
                  <span className="font-semibold text-brand-900 truncate block mt-0.5">
                    {lightboxItem.obat || '-'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 shadow-2xs">
                  <span className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    Tanggal SPK
                  </span>
                  <span className="font-semibold text-stone-800 truncate block mt-0.5">
                    {lightboxItem.created_at
                      ? new Date(lightboxItem.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
