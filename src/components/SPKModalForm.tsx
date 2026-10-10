import React, { useState } from 'react';
import { SPKItem, Pabrik } from '../types/spk';

interface SPKModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SPKItem, 'id'>) => void;
  spkList: SPKItem[];
  initialData?: SPKItem;
}

export const SPKModalForm: React.FC<SPKModalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  spkList,
  initialData,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString().split('T')[0];

  const [pabrik, setPabrik] = useState<Pabrik>('Pasar Kembang');
  const [namaProduksi, setNamaProduksi] = useState('');
  const [namaPemesan, setNamaPemesan] = useState('');
  const [bahan, setBahan] = useState('Primis');
  const [obat, setObat] = useState('Reaktif');
  const [jumlahMeter, setJumlahMeter] = useState<number>(200);
  const [jumlahWarna, setJumlahWarna] = useState<number>(3);
  const [tanggalMasuk, setTanggalMasuk] = useState(today);
  const [deadline, setDeadline] = useState(nextWeek);
  const [keterangan, setKeterangan] = useState('');
  const [fotoMotifUrl, setFotoMotifUrl] = useState('/batik_parang_kusuma.png');
  const [statusDesign, setStatusDesign] = useState<'Pending' | 'Approved'>('Pending');
  const [isUrgent, setIsUrgent] = useState(false);

  React.useEffect(() => {
    if (initialData && isOpen) {
      setPabrik(initialData.pabrik);
      setNamaProduksi(initialData.nama_produksi);
      setNamaPemesan(initialData.nama_pemesan);
      setBahan(initialData.bahan);
      setObat(initialData.obat);
      setJumlahMeter(initialData.jumlah_meter);
      setJumlahWarna(initialData.jumlah_warna);
      setTanggalMasuk(initialData.tanggal_masuk);
      setDeadline(initialData.deadline);
      setKeterangan(initialData.keterangan || '');
      setFotoMotifUrl(initialData.foto_motif_url || '/batik_parang_kusuma.png');
      setStatusDesign(initialData.status_design);
      setIsUrgent(initialData.is_urgent || false);
    } else if (isOpen && !initialData) {
      setPabrik('Pasar Kembang');
      setNamaProduksi('');
      setNamaPemesan('');
      setBahan('Primis');
      setObat('Reaktif');
      setJumlahMeter(200);
      setJumlahWarna(3);
      setTanggalMasuk(today);
      setDeadline(nextWeek);
      setKeterangan('');
      setFotoMotifUrl('/batik_parang_kusuma.png');
      setStatusDesign('Pending');
      setIsUrgent(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const getPabrikCode = (p: Pabrik) => {
    switch (p) {
      case 'Pasar Kembang': return 'PK';
      case 'Bayangkara': return 'BY';
      case 'Nusupan': return 'NS';
    }
  };

  const ym = today.slice(2, 4) + today.slice(5, 7);

  // Cari nomor urut terbesar untuk pabrik dan bulan yang sama
  const maxUrut = spkList
    .filter(s => s.nomor_spk && s.nomor_spk.startsWith(`SPK-${getPabrikCode(pabrik)}-${ym}`))
    .reduce((max, s) => {
      const parts = s.nomor_spk.split('-');
      if (parts.length === 4) {
        const urut = parseInt(parts[3], 10);
        return urut > max ? urut : max;
      }
      return max;
    }, 0);

  const nomorUrut = String(maxUrut + 1).padStart(3, '0');
  const generatedNomorSPK = initialData ? initialData.nomor_spk : `SPK-${getPabrikCode(pabrik)}-${ym}-${nomorUrut}`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setFotoMotifUrl(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProduksi.trim()) {
      alert('Mohon isi nama produksi / motif');
      return;
    }
    if (!namaPemesan.trim()) {
      alert('Mohon isi nama pemesan');
      return;
    }

    onSubmit({
      nomor_spk: generatedNomorSPK,
      nama_produksi: namaProduksi.trim(),
      nama_pemesan: namaPemesan.trim(),
      pabrik,
      bahan,
      obat,
      jumlah_meter: Number(jumlahMeter),
      jumlah_warna: Number(jumlahWarna),
      tanggal_masuk: tanggalMasuk,
      deadline,
      keterangan: keterangan.trim(),
      foto_motif_url: fotoMotifUrl,
      current_stage: initialData ? initialData.current_stage : 1,
      status_design: statusDesign,
      is_urgent: isUrgent,
      pic_terakhir: initialData ? initialData.pic_terakhir : `Admin (${pabrik})`,
      qc_meter_riil: initialData?.qc_meter_riil,
      qc_roll_details: initialData?.qc_roll_details,
      qc_catatan: initialData?.qc_catatan,
      created_at: initialData?.created_at,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-all animate-fadeIn">
      {/* Slide-Up Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-0 sm:my-8 max-h-[92vh] flex flex-col transform transition-all animate-slideUp sm:animate-scaleIn">

        {/* Handle Bar untuk Mobile Drag Feel */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Header Modal */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-brand-900 to-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-file-circle-plus text-gold-300 text-base"></i>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                {initialData ? 'Edit SPK' : 'Buat SPK Baru'}
              </h2>
            </div>
            <p className="text-xs text-brand-200 mt-0.5">
              Nomor Terbit Otomatis: <strong className="text-white font-mono">{generatedNomorSPK}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Form Isi Scrollable */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">

          {/* Baris 1: Nama Motif & Pemesan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Motif / Desain <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Misal: Parang Seling Kembang"
                value={namaProduksi}
                onChange={(e) => setNamaProduksi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-800/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nama Pemesan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Misal: Bu Hj. Rahmawati"
                value={namaPemesan}
                onChange={(e) => setNamaPemesan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-800/40"
              />
            </div>
          </div>

          {/* Baris 2: Pabrik Produksi Tujuan */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Alokasi Pabrik Produksi <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Pasar Kembang', 'Bayangkara', 'Nusupan'] as Pabrik[]).map((p) => {
                const isSelected = pabrik === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPabrik(p)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${isSelected
                        ? 'border-brand-900 bg-brand-900 text-white shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                  >
                    <i className="fa-solid fa-industry text-[11px]"></i>
                    <span className="truncate">{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Baris 3: Kain, Obat & Jumlah */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Kain / Bahan
              </label>
              <select
                value={bahan}
                onChange={(e) => setBahan(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/40"
              >
                <option value="Prima">Prima</option>
                <option value="Primis">Primis</option>
                <option value="Dobby">Dobby</option>
                <option value="Sanwos">Sanwos</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Jenis Obat
              </label>
              <select
                value={obat}
                onChange={(e) => setObat(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/40"
              >
                <option value="Reaktif">Reaktif</option>
                <option value="Disperse">Disperse</option>
                <option value="Pigment">Pigment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Target (Meter)
              </label>
              <input
                type="number"
                min="10"
                step="5"
                required
                value={jumlahMeter}
                onChange={(e) => setJumlahMeter(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-800/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Jml Warna
              </label>
              <input
                type="number"
                min="1"
                max="12"
                required
                value={jumlahWarna}
                onChange={(e) => setJumlahWarna(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-800/40"
              />
            </div>
          </div>

          {/* Baris 4: Tanggal Masuk & Target Selesai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tanggal Masuk
              </label>
              <input
                type="date"
                required
                value={tanggalMasuk}
                onChange={(e) => setTanggalMasuk(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Target Selesai
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-800/40"
              />
            </div>
          </div>

          {/* Baris 5: Upload Foto Motif Batik */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Gambar Motif
            </label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border border-stone-200 overflow-hidden bg-stone-100 flex items-center justify-center shrink-0 shadow-inner">
                {fotoMotifUrl ? (
                  <img src={fotoMotifUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <i className="fa-regular fa-image text-stone-400 text-lg"></i>
                )}
              </div>
              <label className="cursor-pointer flex-1 border-2 border-dashed border-stone-300 hover:border-brand-700 rounded-xl p-3 text-center transition-all bg-stone-50 hover:bg-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <i className="fa-solid fa-cloud-arrow-up text-brand-800 text-base mb-1 block"></i>
                <span className="text-xs font-semibold text-brand-900 block">Pilih Gambar</span>
                <span className="text-[10px] text-stone-400">JPG, PNG, WebP</span>
              </label>
            </div>
          </div>

          {/* Baris 6: Opsi Tambahan (Prioritas Mendesak & Status ACC) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-brand-900 focus:ring-brand-800"
              />
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <i className="fa-solid fa-fire-flame-curved text-amber-600 text-xs"></i>
                Tandai Mendesak
              </span>
            </label>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium">Status Desain:</span>
              <button
                type="button"
                onClick={() => setStatusDesign(statusDesign === 'Approved' ? 'Pending' : 'Approved')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${statusDesign === 'Approved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
              >
                {statusDesign === 'Approved' ? 'Sudah ACC' : 'Pending ACC'}
              </button>
            </div>
          </div>

          {/* Baris 7: Catatan Khusus */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Misal: Warna merah lebih pekat..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-800/40"
            />
          </div>

          {/* Tombol Simpan / Batal */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 hover:from-black hover:to-brand-900 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-gold-300/40"
            >
              <i className="fa-solid fa-check text-gold-300 text-xs"></i>
              <span>{initialData ? 'Simpan Perubahan' : 'Simpan SPK'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
