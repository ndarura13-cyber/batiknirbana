import React, { useState, useEffect } from 'react';
import { UserRole, Pabrik } from '../types/spk';
import { apiFetchRolePins, apiUpdateRolePin, DEFAULT_PINS } from '../lib/supabase';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole, pabrik?: Pabrik) => void;
  onLogout: () => void;
}

interface RoleOption {
  role: UserRole;
  pabrik?: Pabrik;
  title: string;
  desc: string;
  icon: 'admin' | 'pabrik';
}

const ROLES: RoleOption[] = [
  {
    role: 'admin',
    title: 'Admin Pusat (Nusantara Lestari)',
    desc: 'Akses penuh seluruh pabrik, pembuatan SPK, dan pengaturan sistem.',
    icon: 'admin',
  },
  {
    role: 'pasar_kembang',
    pabrik: 'Pasar Kembang',
    title: 'PIC Pabrik Pasar Kembang',
    desc: 'Update progress cetak, loading bahan, dan QC ukur di Pasar Kembang.',
    icon: 'pabrik',
  },
  {
    role: 'bayangkara',
    pabrik: 'Bayangkara',
    title: 'PIC Pabrik Bayangkara',
    desc: 'Update progress cetak, loading bahan, dan QC ukur di Bayangkara.',
    icon: 'pabrik',
  },
  {
    role: 'nusupan',
    pabrik: 'Nusupan',
    title: 'PIC Pabrik Nusupan',
    desc: 'Update progress cetak, loading bahan, dan QC ukur di Nusupan.',
    icon: 'pabrik',
  },
];

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'changePin'>('switch');
  const [selectedTarget, setSelectedTarget] = useState<RoleOption>(ROLES[0]);
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [pins, setPins] = useState<Record<UserRole, string>>(DEFAULT_PINS);
  const [loadingPins, setLoadingPins] = useState(false);

  const [changeTargetRole, setChangeTargetRole] = useState<UserRole>('admin');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingPins(true);
      setErrorMessage('');
      setSuccessMessage('');
      setPinInput('');
      setOldPin('');
      setNewPin('');
      setConfirmNewPin('');
      apiFetchRolePins().then(loaded => {
        setPins(loaded);
        setLoadingPins(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirmSwitch = () => {
    setErrorMessage('');
    
    if (!pinInput || !pinInput.trim()) {
      setErrorMessage('PIN Keamanan wajib dimasukkan.');
      return;
    }

    const correctPin = pins[selectedTarget.role] || DEFAULT_PINS[selectedTarget.role];
    
    if (pinInput.trim() !== correctPin.trim()) {
      setErrorMessage('PIN salah. Silakan coba kembali.');
      setPinInput('');
      return;
    }

    onSelectRole(selectedTarget.role, selectedTarget.pabrik);
    onClose();
  };

  const handleUpdatePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const targetInfo = ROLES.find(r => r.role === changeTargetRole);
    const currentSavedPin = pins[changeTargetRole] || DEFAULT_PINS[changeTargetRole];

    if (!oldPin || oldPin.trim() !== currentSavedPin.trim()) {
      setErrorMessage('PIN Lama tidak sesuai.');
      return;
    }

    if (newPin.trim().length < 4) {
      setErrorMessage('PIN Baru minimal 4 karakter/angka.');
      return;
    }

    if (newPin.trim() !== confirmNewPin.trim()) {
      setErrorMessage('Konfirmasi PIN Baru tidak cocok dengan PIN Baru.');
      return;
    }

    setIsUpdatingPin(true);
    const result = await apiUpdateRolePin(changeTargetRole, newPin.trim());
    setIsUpdatingPin(false);

    if (result.success) {
      setPins(prev => ({ ...prev, [changeTargetRole]: newPin.trim() }));
      setSuccessMessage(`Berhasil memperbarui PIN untuk ${targetInfo?.title}!`);
      setOldPin('');
      setNewPin('');
      setConfirmNewPin('');
      setTimeout(() => {
        setSuccessMessage('');
        setActiveTab('switch');
      }, 1500);
    } else {
      setErrorMessage(`Gagal menyimpan PIN: ${result.error || 'Terjadi kesalahan sistem'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-all animate-fadeIn">
      {/* Slide-Up Bottom Sheet on Mobile, Centered Modal on Desktop */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-0 sm:my-6 max-h-[92vh] flex flex-col transform transition-all animate-slideUp sm:animate-scaleIn">
        
        {/* Handle Bar untuk Mobile Drag Feel */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Header Modal */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <i className="fa-solid fa-user-shield text-gold-300 text-base"></i>
            <h2 className="text-base font-bold tracking-tight">
              Keamanan Akses & Posisi
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Tab Navigasi */}
        <div className="flex border-b border-stone-200 bg-stone-50 shrink-0">
          <button
            type="button"
            onClick={() => { setActiveTab('switch'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'switch'
                ? 'border-brand-800 text-brand-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <i className="fa-solid fa-id-badge text-xs"></i>
            <span>Ganti Peran</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('changePin'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'changePin'
                ? 'border-brand-800 text-brand-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <i className="fa-solid fa-key text-xs text-gold-600"></i>
            <span>Ubah PIN Akses</span>
          </button>
        </div>

        {/* TAB 1: PILIH PERAN & LOGIN */}
        {activeTab === 'switch' && (
          <div className="p-5 sm:p-6 space-y-3 overflow-y-auto flex-1">
            <p className="text-xs text-stone-500 mb-1">
              Pilih posisi dan masukkan PIN untuk beralih akses:
            </p>

            <div className="space-y-2">
              {ROLES.map((r) => {
                const isSelected = selectedTarget.role === r.role;
                const isCurrentlyActive = currentRole === r.role;

                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      setSelectedTarget(r);
                      setPinInput('');
                      setErrorMessage('');
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-brand-800 ring-2 ring-brand-800/20 bg-brand-50/40'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-brand-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600'
                    }`}>
                      <i className={`text-sm ${r.icon === 'admin' ? 'fa-solid fa-shield-halved' : 'fa-solid fa-industry'}`}></i>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 text-xs sm:text-sm">
                          {r.title}
                        </span>
                        {isCurrentlyActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                        {r.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Input PIN untuk Masuk Peran Terpilih */}
            <div className="pt-3 border-t border-stone-200">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                PIN Keamanan ({selectedTarget.title})
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={8}
                placeholder="Ketik PIN..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono tracking-widest bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-800"
              />
            </div>

            {errorMessage && (
              <div className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200 animate-shake">
                {errorMessage}
              </div>
            )}

            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSwitch}
                disabled={loadingPins}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-arrow-right-to-bracket text-gold-300 text-xs"></i>
                <span>Masuk / Terapkan</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: UBAH PIN AKSES */}
        {activeTab === 'changePin' && (
          <form onSubmit={handleUpdatePinSubmit} className="p-5 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
            <p className="text-xs text-stone-500">
              Perbarui PIN keamanan untuk posisi yang Anda kelola:
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Pilih Posisi yang Ingin Diubah PIN-nya:
              </label>
              <select
                value={changeTargetRole}
                onChange={(e) => {
                  setChangeTargetRole(e.target.value as UserRole);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-800"
              >
                {ROLES.map(r => (
                  <option key={r.role} value={r.role}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                PIN Lama Saat Ini:
              </label>
              <input
                type="password"
                required
                placeholder="Masukkan PIN lama..."
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  PIN Baru (min. 4 digit):
                </label>
                <input
                  type="password"
                  required
                  placeholder="PIN baru..."
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Ulangi PIN Baru:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Konfirmasi..."
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-800"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200 animate-shake">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <i className="fa-solid fa-check mr-1.5"></i>
                {successMessage}
              </div>
            )}

            <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isUpdatingPin}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-check text-gold-300 text-xs"></i>
                <span>{isUpdatingPin ? 'Menyimpan...' : 'Simpan PIN Baru'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
