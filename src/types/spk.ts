export type Pabrik = 'Pasar Kembang' | 'Bayangkara' | 'Nusupan';

export type StageId = 1 | 2 | 3 | 4 | 5 | 6;

export interface StageConfig {
  id: StageId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
}

export const PRODUCTION_STAGES: StageConfig[] = [
  {
    id: 1,
    name: 'Design (Approval/Pending)',
    shortName: 'Design',
    description: 'Persetujuan motif & warna desain',
    iconName: 'PenTool',
  },
  {
    id: 2,
    name: 'Fabric Loading / Persiapan Bahan',
    shortName: 'Fabric Loading',
    description: 'Penyiapan kain mori & obat warna',
    iconName: 'Layers',
  },
  {
    id: 3,
    name: 'Dyeing / Printing Pabrik',
    shortName: 'Dyeing/Printing',
    description: 'Proses cetak & pewarnaan di pabrik',
    iconName: 'Droplets',
  },
  {
    id: 4,
    name: 'QC Ukur (Ukur Ulang Meter)',
    shortName: 'QC Ukur',
    description: 'Pemeriksaan cacat & ukur meter riil',
    iconName: 'Ruler',
  },
  {
    id: 5,
    name: 'Packaging & Finishing',
    shortName: 'Packaging',
    description: 'Lipat, gulung & pembungkusan rapi',
    iconName: 'PackageCheck',
  },
  {
    id: 6,
    name: 'Siap Kirim / Selesai',
    shortName: 'Siap Kirim',
    description: 'Produk siap diambil / dikirim ke pemesan',
    iconName: 'Truck',
  },
];

export interface QCRollItem {
  roll: number;
  meter: number;
}

export interface SPKItem {
  id: string;
  nomor_spk: string;
  nama_produksi: string; // e.g. "Parang Kusuma"
  nama_pemesan: string;  // e.g. "Nirbana"
  pabrik: Pabrik;
  bahan: string;         // e.g. "Primis"
  obat: string;          // e.g. "Reaktif"
  jumlah_meter: number;  // Target SPK
  jumlah_warna: number;  // e.g. 3
  tanggal_masuk: string; // YYYY-MM-DD
  deadline: string;      // YYYY-MM-DD
  keterangan: string;
  foto_motif_url: string;
  current_stage: StageId;
  status_design: 'Pending' | 'Approved';
  qc_meter_riil?: number | null;
  qc_roll_details?: QCRollItem[];
  qc_catatan?: string;
  pic_terakhir?: string;
  is_urgent?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type UserRole = 'admin' | 'pasar_kembang' | 'bayangkara' | 'nusupan';

export interface RoleInfo {
  role: UserRole;
  label: string;
  pabrik?: Pabrik;
  pin: string;
}
