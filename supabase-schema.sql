-- ========================================================
-- NUSANTARA LESTARI / NIRBANA - DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Sistem Manajemen & Pemantauan Produksi Batik Terpusat
-- ========================================================

-- Aktifkan ekstensi UUID jika belum ada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABEL SPK (Surat Perintah Kerja)
CREATE TABLE IF NOT EXISTS spk (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nomor_spk VARCHAR(50) UNIQUE NOT NULL,
    nama_produksi VARCHAR(150) NOT NULL, -- Nama Motif (cth: Parang Kusuma)
    nama_pemesan VARCHAR(150) NOT NULL,  -- Nama Pemesan (cth: Nirbana)
    pabrik VARCHAR(50) NOT NULL CHECK (pabrik IN ('Pasar Kembang', 'Bayangkara', 'Nusupan')),
    bahan VARCHAR(100) NOT NULL DEFAULT 'Primis',
    obat VARCHAR(100) NOT NULL DEFAULT 'Reaktif',
    jumlah_meter NUMERIC(10, 2) NOT NULL DEFAULT 200,
    jumlah_warna INTEGER NOT NULL DEFAULT 3,
    tanggal_masuk DATE NOT NULL DEFAULT CURRENT_DATE,
    deadline DATE NOT NULL,
    keterangan TEXT DEFAULT '',
    foto_motif_url TEXT DEFAULT '',
    
    -- Status Alur 6 Tahapan:
    -- 1: Design (Approval / Pending)
    -- 2: Fabric Loading / Persiapan Bahan
    -- 3: Dyeing / Printing
    -- 4: QC Ukur (Ukur ulang dalam bentuk meter)
    -- 5: Packaging
    -- 6: Siap Kirim
    current_stage INTEGER NOT NULL DEFAULT 1 CHECK (current_stage BETWEEN 1 AND 6),
    status_design VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status_design IN ('Pending', 'Approved')),
    
    -- Hasil Ukur QC
    qc_meter_riil NUMERIC(10, 2) DEFAULT NULL,
    qc_roll_details JSONB DEFAULT '[]'::jsonb, -- Contoh: [{"roll": 1, "meter": 26}, {"roll": 2, "meter": 28}]
    qc_catatan TEXT DEFAULT '',
    
    -- Log PIC & Audit
    pic_terakhir VARCHAR(100) DEFAULT 'Admin',
    is_urgent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeks untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_spk_nomor ON spk(nomor_spk);
CREATE INDEX IF NOT EXISTS idx_spk_pabrik ON spk(pabrik);
CREATE INDEX IF NOT EXISTS idx_spk_stage ON spk(current_stage);
CREATE INDEX IF NOT EXISTS idx_spk_deadline ON spk(deadline);

-- 2. TABEL KEAMANAN PIN PERAN & POSISI (BISA DIUBAH SETIAP SAAT)
CREATE TABLE IF NOT EXISTS app_security_pins (
    role_id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    pin VARCHAR(20) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL LOG AKTIVITAS / PROGRESS HISTORY
CREATE TABLE IF NOT EXISTS spk_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spk_id UUID REFERENCES spk(id) ON DELETE CASCADE,
    stage_from INTEGER,
    stage_to INTEGER,
    pic_name VARCHAR(100) NOT NULL,
    pabrik VARCHAR(50),
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger untuk memperbarui updated_at secara otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_spk_updated_at ON spk;
CREATE TRIGGER trigger_spk_updated_at
BEFORE UPDATE ON spk
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ========================================================
-- KEBIJAKAN AKSES (PENTING AGAR APLIKASI WEB BISA SIMPAN DATA)
-- ========================================================
ALTER TABLE spk DISABLE ROW LEVEL SECURITY;
ALTER TABLE spk_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_security_pins DISABLE ROW LEVEL SECURITY;

-- Aktifkan Real-Time Replication untuk tabel spk & pins
ALTER PUBLICATION supabase_realtime ADD TABLE spk;
ALTER PUBLICATION supabase_realtime ADD TABLE app_security_pins;

-- Data PIN Awal
INSERT INTO app_security_pins (role_id, title, pin) VALUES
('admin', 'Admin Pusat (Nusantara Lestari)', '1234'),
('pasar_kembang', 'PIC Pabrik Pasar Kembang', '1111'),
('bayangkara', 'PIC Pabrik Bayangkara', '2222'),
('nusupan', 'PIC Pabrik Nusupan', '3333')
ON CONFLICT (role_id) DO NOTHING;
