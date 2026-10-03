import { createClient } from '@supabase/supabase-js';
import { SPKItem, QCRollItem, StageId, UserRole } from '../types/spk';

// Kredensial Supabase terintegrasi
export const SUPABASE_URL = 'https://lgxskxovlyllyslnpsci.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxneHNreG92bHlsbHlzbG5wc2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MjI3MzMsImV4cCI6MjEwNjM5ODczM30.qJp-cFUPEYW9zyU_dZnYvLBOG9FBc5GXy03O_U57V4E';

const resolvedUrl = (import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL).trim();
const resolvedKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY).trim();

export const supabase = createClient(resolvedUrl, resolvedKey);

export const isSupabaseConfigured = (): boolean => true;

export const cleanupLegacyLocalStorage = () => {
  try {
    localStorage.removeItem('NL_SPK_MOCK_DATA');
    localStorage.removeItem('spk_items');
    localStorage.removeItem('nirbana_spk_data');
    localStorage.removeItem('NL_SUPABASE_URL');
    localStorage.removeItem('NL_SUPABASE_KEY');
  } catch (e) {
    console.warn('Gagal bersihkan legacy local storage:', e);
  }
};

// ==========================================
// 1. PIN KEAMANAN PERAN (SUPABASE DATABASE)
// ==========================================
export const DEFAULT_PINS: Record<UserRole, string> = {
  admin: '2205',
  pasar_kembang: '1111',
  bayangkara: '2222',
  nusupan: '3333',
};

// Ambil PIN terkini dari Supabase
export const apiFetchRolePins = async (): Promise<Record<UserRole, string>> => {
  if (!supabase) return DEFAULT_PINS;

  try {
    const { data, error } = await supabase
      .from('app_security_pins')
      .select('role_id, pin');

    if (!error && data && data.length > 0) {
      const pinMap = { ...DEFAULT_PINS };
      data.forEach((row: any) => {
        if (row.role_id in pinMap) {
          pinMap[row.role_id as UserRole] = row.pin;
        }
      });
      return pinMap;
    }
  } catch (err) {
    console.warn('Gagal baca tabel app_security_pins, gunakan default:', err);
  }

  return DEFAULT_PINS;
};

// Ubah PIN peran di Supabase menggunakan UPDATE langsung
export const apiUpdateRolePin = async (
  roleId: UserRole, 
  newPin: string
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Koneksi Supabase belum terkonfigurasi di .env' };
  }

  try {
    const { error } = await supabase
      .from('app_security_pins')
      .update({
        pin: newPin.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('role_id', roleId);

    if (error) {
      console.error('Gagal update PIN ke Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception update PIN:', err);
    return { success: false, error: err?.message || 'Terjadi kesalahan sistem' };
  }
};

// ==========================================
// 2. OPERASI CRUD SPK
// ==========================================
export const apiFetchSPK = async (): Promise<SPKItem[]> => {
  cleanupLegacyLocalStorage();

  if (!supabase) {
    console.warn('Supabase client belum dikonfigurasi.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('spk')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error saat fetch dari Supabase:', error.message);
      return [];
    }

    return (data || []) as SPKItem[];
  } catch (err) {
    console.error('Koneksi Supabase error:', err);
    return [];
  }
};

export const apiSaveSPK = async (item: Omit<SPKItem, 'id'>): Promise<SPKItem | null> => {
  if (!supabase) {
    alert('Koneksi Supabase belum aktif.');
    return null;
  }

  try {
    const payload = {
      nomor_spk: item.nomor_spk,
      nama_produksi: item.nama_produksi,
      nama_pemesan: item.nama_pemesan,
      pabrik: item.pabrik,
      bahan: item.bahan,
      obat: item.obat,
      jumlah_meter: item.jumlah_meter,
      jumlah_warna: item.jumlah_warna,
      tanggal_masuk: item.tanggal_masuk,
      deadline: item.deadline,
      keterangan: item.keterangan,
      foto_motif_url: item.foto_motif_url,
      current_stage: item.current_stage || 1,
      status_design: item.status_design || 'Pending',
      is_urgent: item.is_urgent || false,
      pic_terakhir: item.pic_terakhir || 'Admin',
    };

    const { data, error } = await supabase
      .from('spk')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error insert SPK ke Supabase:', error.message);
      alert('Gagal menyimpan SPK: ' + error.message);
      return null;
    }

    return data as SPKItem;
  } catch (err) {
    console.error('Exception save SPK:', err);
    return null;
  }
};

export const apiUpdateStage = async (
  id: string,
  stage: StageId,
  picName: string
): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const updateData: any = {
      current_stage: stage,
      pic_terakhir: picName,
      updated_at: new Date().toISOString(),
    };

    if (stage > 1) {
      updateData.status_design = 'Approved';
    }

    const { error } = await supabase
      .from('spk')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error update alur SPK:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception update stage:', err);
    return false;
  }
};

export const apiUpdateQC = async (
  id: string,
  meterRiil: number,
  rollDetails: QCRollItem[],
  catatan: string,
  picName: string
): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('spk')
      .update({
        qc_meter_riil: meterRiil,
        qc_roll_details: rollDetails,
        qc_catatan: catatan,
        current_stage: 5,
        pic_terakhir: picName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error simpan hasil QC ke Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception update QC:', err);
    return false;
  }
};

export const subscribeToSPKChanges = (onUpdate: () => void) => {
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('public:spk')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'spk' },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription tidak aktif:', err);
    return () => {};
  }
};

// Ambil 1 data SPK berdasarkan Nomor SPK atau ID (Untuk Halaman Tracking Barcode)
export const apiFetchSPKByNumber = async (nomorOrId: string): Promise<SPKItem | null> => {
  if (!supabase || !nomorOrId) return null;

  try {
    const cleanQuery = nomorOrId.trim();
    
    // Coba cari berdasarkan nomor_spk terlebih dahulu
    const { data: byNomor, error: errNomor } = await supabase
      .from('spk')
      .select('*')
      .ilike('nomor_spk', cleanQuery)
      .maybeSingle();

    if (byNomor && !errNomor) {
      return byNomor as SPKItem;
    }

    // Jika tidak ditemukan, coba cari berdasarkan UUID id
    const { data: byId, error: errId } = await supabase
      .from('spk')
      .select('*')
      .eq('id', cleanQuery)
      .maybeSingle();

    if (byId && !errId) {
      return byId as SPKItem;
    }

    return null;
  } catch (err) {
    console.error('Exception fetch SPK by number:', err);
    return null;
  }
};

// Hapus SPK Permanen dari Supabase (Khusus Otorisasi Admin Pusat)
export const apiDeleteSPK = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Klien Supabase belum terhubung.' };
  }

  try {
    const { error } = await supabase
      .from('spk')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Gagal hapus SPK dari Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception delete SPK:', err);
    return { success: false, error: err?.message || 'Terjadi kesalahan sistem saat menghapus SPK' };
  }
};

