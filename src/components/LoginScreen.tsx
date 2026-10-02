import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Pabrik } from '../types/spk';
import { apiFetchRolePins, DEFAULT_PINS } from '../lib/supabase';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole, pabrik?: Pabrik) => void;
}

interface RoleOption {
  role: UserRole;
  pabrik?: Pabrik;
  label: string;
  icon: 'admin' | 'pabrik';
}

const ROLES: RoleOption[] = [
  { role: 'admin', label: 'Admin Pusat', icon: 'admin' },
  { role: 'pasar_kembang', pabrik: 'Pasar Kembang', label: 'Pasar Kembang', icon: 'pabrik' },
  { role: 'bayangkara', pabrik: 'Bayangkara', label: 'Bayangkara', icon: 'pabrik' },
  { role: 'nusupan', pabrik: 'Nusupan', label: 'Nusupan', icon: 'pabrik' },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<RoleOption>(ROLES[0]);
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingPins, setLoadingPins] = useState(true);
  const [pins, setPins] = useState<Record<UserRole, string>>(DEFAULT_PINS);
  const [isShaking, setIsShaking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiFetchRolePins().then((loadedPins) => {
      setPins(loadedPins);
      setLoadingPins(false);
    });
    // Auto-focus input saat layar terbuka
    inputRef.current?.focus();
  }, []);

  const handleVerifyPin = (inputToVerify: string) => {
    setErrorMessage('');

    if (!inputToVerify.trim()) {
      setErrorMessage('Masukkan PIN terlebih dahulu.');
      return;
    }

    const correctPin = pins[selectedRole.role] || DEFAULT_PINS[selectedRole.role];

    if (inputToVerify.trim() !== correctPin.trim()) {
      setIsShaking(true);
      setErrorMessage('PIN tidak sesuai. Silakan coba kembali.');
      setPinInput('');
      setTimeout(() => setIsShaking(false), 500);
      inputRef.current?.focus();
      return;
    }

    onLoginSuccess(selectedRole.role, selectedRole.pabrik);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleVerifyPin(pinInput);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPinInput(rawVal);
    setErrorMessage('');

    // Otomatis verifikasi jika sudah 4 digit
    if (rawVal.length === 4) {
      setTimeout(() => {
        handleVerifyPin(rawVal);
      }, 150);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F8F7F4] flex flex-col justify-center items-center p-4 sm:p-6 relative select-none"
      onClick={() => inputRef.current?.focus()}
    >

      {/* Background Watermark Batik Halus */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-repeat bg-center"
        style={{ backgroundImage: `url('/batik_parang_kusuma.png')`, backgroundSize: '320px' }}
      />

      <div
        className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-xl border border-stone-200/90 overflow-hidden relative z-10 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Identitas Brand Bersih di Atas */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo Nusantara Lestari"
              className="w-10 h-10 rounded-full object-contain p-0.5 border border-gold-300/80 bg-white shrink-0 shadow-xs"
            />
            <div>
              <h1 className="font-serif tracking-wider text-base font-bold text-brand-950 uppercase leading-tight">
                BATIK NIRBANA
              </h1>
              <p className="text-[10px] text-stone-400 tracking-wide font-medium">
                Rumah dari Batik Indonesia
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
            <i className="fa-solid fa-lock text-xs"></i>
          </div>
        </div>

        {/* Pemilih Peran Kompak (Pill-Tabs di Atas) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Pilih Posisi:
            </span>
            <span className="text-[11px] font-bold text-brand-900">
              {selectedRole.label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
            {ROLES.map((r) => {
              const isSelected = selectedRole.role === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(r);
                    setPinInput('');
                    setErrorMessage('');
                    inputRef.current?.focus();
                  }}
                  className={`py-1.5 px-1 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 truncate ${isSelected
                    ? 'bg-brand-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                >
                  <i className={`text-[10px] ${r.icon === 'admin' ? 'fa-solid fa-shield-halved text-gold-300' : 'fa-solid fa-industry'}`}></i>
                  <span className="truncate">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Heading Masukkan PIN Mirip Referensi Gambar */}
        <div className="text-center pt-1 mb-2">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Masukkan PIN
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Ketik 4 digit PIN keamanan untuk <strong className="text-stone-800">{selectedRole.label}</strong>
          </p>
        </div>

        {/* AREA DISPLAY 4 KOTAK PIN (E-Wallet Style dengan Native Keypad Trigger) */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div
            onClick={() => inputRef.current?.focus()}
            className={`relative flex items-center justify-center gap-3 sm:gap-4 my-6 py-2 cursor-pointer ${isShaking ? 'animate-shake' : ''
              }`}
          >
            {/* Input tak terlihat dengan inputMode="numeric" untuk mentriger keyboard angka HP */}
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={4}
              value={pinInput}
              onChange={handleInputChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-30"
              autoFocus
            />

            {[0, 1, 2, 3].map((index) => {
              const isFilled = index < pinInput.length;
              const isCurrent = index === pinInput.length;

              return (
                <div
                  key={index}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${isCurrent
                    ? 'border-brand-800 ring-4 ring-brand-800/15 bg-white shadow-sm scale-105'
                    : isFilled
                      ? 'border-brand-900 bg-stone-50 shadow-2xs'
                      : 'border-stone-200 bg-stone-50/70'
                    }`}
                >
                  {isFilled ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-stone-900 animate-scaleIn" />
                  ) : isCurrent ? (
                    <div className="w-0.5 h-6 bg-brand-800 animate-pulse rounded-full" />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Pesan Kesalahan */}
          {errorMessage && (
            <div className="mb-4 text-center">
              <span className="text-xs font-bold text-red-600 bg-red-50 py-1.5 px-3 rounded-xl border border-red-200 inline-block animate-fadeIn">
                {errorMessage}
              </span>
            </div>
          )}

          {/* Tombol Konfirmasi / Masuk */}
          <button
            type="submit"
            disabled={loadingPins}
            className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2 ${pinInput.length === 4
              ? 'bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 hover:from-black hover:to-brand-950 text-white shadow-brand-950/25 active:scale-[0.98]'
              : 'bg-stone-200 text-stone-400 cursor-pointer hover:bg-stone-300'
              }`}
          >
            <span>Konfirmasi & Masuk</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </form>

        <p className="text-[11px] text-stone-400 mt-6 text-center">
          Ketuk kotak di atas untuk membuka keypad angka
        </p>

      </div>

      <p className="text-[10px] text-stone-400 mt-4 text-center">
        Surakarta, Jawa Tengah • BATIK NIRBANA
      </p>

    </div>
  );
};
