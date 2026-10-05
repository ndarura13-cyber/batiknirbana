import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GalleryItem {
  id: string;
  nama_produksi: string;
  foto_motif_url: string;
}

const SkeletonCard = () => (
  <div className="aspect-square rounded-2xl overflow-hidden bg-stone-200 animate-pulse relative">
    <div className="absolute inset-0 bg-gradient-to-t from-stone-300 via-transparent to-transparent" />
  </div>
);

export const LandingGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('spk')
          .select('id, nama_produksi, foto_motif_url')
          .not('foto_motif_url', 'is', null)
          .neq('foto_motif_url', '')
          .order('created_at', { ascending: false })
          .limit(90);

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

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
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

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {currentItems.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            aria-label={`Lihat motif ${item.nama_produksi}`}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <img
              src={item.foto_motif_url}
              alt={item.nama_produksi}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <div>
                <p className="text-white font-bold text-[10px] sm:text-sm leading-tight line-clamp-2">
                  {item.nama_produksi}
                </p>
                <p className="text-gold-300 text-[9px] sm:text-xs mt-0.5 flex items-center gap-1">
                  <i className="fa-solid fa-magnifying-glass-plus text-[9px]"></i>
                  Perbesar
                </p>
              </div>
            </div>

            {/* Always visible bottom label on mobile */}
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent sm:hidden">
              <p className="text-white text-[9px] font-semibold truncate">{item.nama_produksi}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-brand-800 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center shadow-sm"
          >
            <i className="fa-solid fa-chevron-left text-sm"></i>
          </button>
          
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-700">
            <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-800 flex items-center justify-center">
              {currentPage}
            </span>
            <span className="text-stone-400">/</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-brand-800 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center shadow-sm"
          >
            <i className="fa-solid fa-chevron-right text-sm"></i>
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxItem.foto_motif_url}
              alt={lightboxItem.nama_produksi}
              className="w-full max-h-[70vh] object-contain bg-stone-50"
            />
            <div className="p-4 flex items-center justify-between bg-white border-t border-stone-100">
              <div>
                <p className="font-bold text-stone-900 text-sm">{lightboxItem.nama_produksi}</p>
                <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                  <i className="fa-solid fa-paintbrush text-brand-700 text-[10px]"></i>
                  Koleksi Motif Batik Nirbana
                </p>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                aria-label="Tutup"
              >
                <i className="fa-solid fa-xmark text-base"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
