-- ============================================================
-- Supabase RLS Policy: Izinkan Anonymous (Publik) Read Galeri
-- Jalankan di Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Pastikan RLS aktif pada tabel spk
ALTER TABLE spk ENABLE ROW LEVEL SECURITY;

-- 2. Hapus policy lama jika ada, lalu buat ulang
DROP POLICY IF EXISTS allow_anon_select_gallery ON spk;
DROP POLICY IF EXISTS allow_authenticated_select_all ON spk;
DROP POLICY IF EXISTS allow_authenticated_write ON spk;

-- 3. Policy: Anon (publik) boleh SELECT SPK yang punya foto motif
CREATE POLICY allow_anon_select_gallery
  ON spk
  FOR SELECT
  TO anon
  USING (
    foto_motif_url IS NOT NULL
    AND foto_motif_url != ''
  );

-- 4. Policy: Authenticated users boleh SELECT semua baris
CREATE POLICY allow_authenticated_select_all
  ON spk
  FOR SELECT
  TO authenticated
  USING (true);

-- 5. Policy: Authenticated users boleh INSERT, UPDATE, DELETE
CREATE POLICY allow_authenticated_write
  ON spk
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Verifikasi: Lihat semua policy aktif
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'spk';
