import React, { useState, useEffect, useRef } from 'react';
import { LandingGallery } from './LandingGallery';

interface LandingPageProps {
  onEnterApp: () => void;
}

const NAV_LINKS = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#tentang', label: 'Tentang' },
  { href: '#portofolio', label: 'Portofolio' },
  { href: '#layanan', label: 'Layanan' },
  { href: '#testimoni', label: 'Testimoni' },
  { href: '#kontak', label: 'Kontak' },
];

const KEUNGGULAN = [
  { icon: 'fa-shield-check', label: 'Quality Control' },
  { icon: 'fa-award', label: 'Bergaransi' },
  { icon: 'fa-gem', label: 'Premium Material' },
  { icon: 'fa-palette', label: 'Color Matches' },
  { icon: 'fa-users-gear', label: 'SDM Terampil' },
  { icon: 'fa-handshake', label: 'Good Deals' },
  { icon: 'fa-box-open', label: 'Packaging Rapi' },
  { icon: 'fa-pen-ruler', label: 'Designer Collab' },
  { icon: 'fa-truck-fast', label: 'Pengiriman Aman' },
];

const TESTIMONIALS = [
  {
    quote: 'Pemiliknya ramah, produksi bagus, bergaransi. Tidak pernah kecewa pesan di sini.',
    name: 'Aziz Mundarso',
    from: 'Batik Bagus, Solo',
    initials: 'AM',
  },
  {
    quote: 'Sudah lama bekerja sama dengan produksi sini, tentunya balik lagi, semoga langgeng.',
    name: 'Handayani',
    from: 'Omah Batik 33',
    initials: 'HA',
  },
  {
    quote: 'Hampir tidak pernah bertemu langsung, hanya via telepon tapi pekerjaan selalu lancar dan tepat waktu.',
    name: 'Asnia',
    from: 'Ternate',
    initials: 'AS',
  },
];

const FEATURES = [
  {
    icon: 'fa-sliders',
    title: 'Sesuaikan Kebutuhan',
    desc: 'Anda bisa membuat seragam batik lokal sesuai dengan selera dan kebutuhan institusi Anda.',
  },
  {
    icon: 'fa-paintbrush',
    title: 'Desain Motif Sendiri',
    desc: 'Motif yang Anda rancang adalah motif yang nantinya akan Anda kenakan — benar-benar milik Anda.',
  },
  {
    icon: 'fa-briefcase',
    title: 'Seragam Batik Kantor',
    desc: 'Karena motif batik cocok untuk pekerja kantoran, instansi pemerintah, maupun perusahaan swasta.',
  },
  {
    icon: 'fa-graduation-cap',
    title: 'Seragam Batik Sekolah',
    desc: 'Dari SD hingga SMA, komunitas pendidikan, pesantren, maupun universitas — semuanya bisa!',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Sticky navbar scroll detection
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Smooth scroll helper
  const scrollTo = (href: string) => {
    setMobileNavOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const WA_ADMIN1 = 'https://wa.me/6282311016332';
  const WA_ADMIN2 = 'https://wa.me/6285100969475';

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden" id="beranda">

      {/* ═══════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Logo */}
            <a
              href="#beranda"
              onClick={(e) => { e.preventDefault(); scrollTo('#beranda'); }}
              className="flex items-center gap-2.5 shrink-0"
              aria-label="Nirbana Batik - Beranda"
            >
              <img
                src="/logo-nirbana.png"
                alt="Logo Nirbana Batik"
                className="h-9 sm:h-10 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="hidden sm:block">
                <p className={`font-serif font-bold text-base leading-tight tracking-wide ${isScrolled ? 'text-brand-900' : 'text-white'}`}>
                  Nirbana Batik
                </p>
                <p className={`text-[10px] tracking-widest font-medium uppercase ${isScrolled ? 'text-stone-500' : 'text-gold-200'}`}>
                  Printing · Cetak · Custom
                </p>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navigasi Utama">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isScrolled
                      ? 'text-stone-700 hover:text-brand-800 hover:bg-brand-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-2">
              <button
                onClick={onEnterApp}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
              >
                <i className="fa-solid fa-right-to-bracket text-xs"></i>
                <span>Masuk ke Sistem SPK</span>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className={`lg:hidden p-2 rounded-xl transition-colors ${
                  isScrolled ? 'text-stone-700 hover:bg-stone-100' : 'text-white hover:bg-white/10'
                }`}
                aria-label="Buka menu navigasi"
                aria-expanded={mobileNavOpen}
              >
                <i className={`fa-solid ${mobileNavOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-stone-100 shadow-lg animate-slideDown">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3 rounded-xl text-stone-800 font-semibold hover:bg-brand-50 hover:text-brand-800 transition-colors text-sm"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={onEnterApp}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-800 text-white font-bold text-sm active:scale-95 transition-all"
              >
                <i className="fa-solid fa-right-to-bracket text-xs"></i>
                Masuk ke Sistem SPK
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="beranda"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Banner Utama"
      >
        {/* Background batik image with parallax feel */}
        <div className="absolute inset-0">
          <img
            src="/hero-batik.png"
            alt="Motif Batik Parang Kusuma"
            className="w-full h-full object-cover scale-105"
            style={{ objectPosition: 'center 30%' }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/92 via-brand-900/80 to-brand-800/70" />
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(220,189,113,0.3) 0%, transparent 50%), 
                              radial-gradient(circle at 75% 75%, rgba(220,189,113,0.2) 0%, transparent 50%)`
          }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-8 max-w-4xl mx-auto pt-20">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/20 border border-gold-300/40 text-gold-300 text-xs font-semibold mb-6 backdrop-blur-sm">
            <i className="fa-solid fa-star text-[10px]"></i>
            Beroperasi Sejak 2013 di Surakarta
            <i className="fa-solid fa-star text-[10px]"></i>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Rumah Dari
            <br />
            <span className="text-gold-300">Batik Indonesia</span>
          </h1>

          <p className="text-stone-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Kami berkecimpung dalam industri tekstil, khususnya pembuatan batik dengan teknik{' '}
            <strong className="text-white">printing berkualitas tinggi</strong>. 
            Lebih dari seribu pelanggan telah mempercayakan kebutuhan batik mereka kepada kami.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => scrollTo('#portofolio')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gold-400 hover:bg-gold-300 text-brand-950 font-bold text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              <i className="fa-solid fa-images text-sm"></i>
              Lihat Portofolio Batik
            </button>
            <a
              href={WA_ADMIN1}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm backdrop-blur-sm active:scale-95 transition-all"
            >
              <i className="fa-brands fa-whatsapp text-green-400 text-base"></i>
              Hubungi via WhatsApp
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 text-stone-400 animate-bounce">
            <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
            <i className="fa-solid fa-chevron-down text-sm"></i>
          </div>
        </div>

        {/* Stat bar at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-4 grid grid-cols-3 divide-x divide-white/10">
            {[
              { num: '10+', label: 'Tahun Pengalaman' },
              { num: '1000+', label: 'Pelanggan Puas' },
              { num: '3', label: 'Pabrik Produksi' },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4">
                <p className="text-white font-bold text-xl sm:text-2xl font-serif">{stat.num}</p>
                <p className="text-stone-300 text-[11px] sm:text-xs font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TENTANG / KEUNGGULAN
      ═══════════════════════════════════════════════ */}
      <section id="tentang" className="py-20 sm:py-28 bg-cream-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-14">
            <p className="text-brand-700 text-xs font-bold tracking-[0.25em] uppercase mb-3">Mengapa Memilih Kami</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950 leading-tight">
              Wujudkan Mimpi Anda
              <br />
              <span className="text-brand-700">Bersama Nirbana Batik</span>
            </h2>
            <p className="mt-4 text-stone-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Jika Anda membutuhkan seragam batik untuk instansi atau komunitas, kami siap 
              membantu mewujudkan segala angan-angan Anda dalam pakaian yang nyaman dan elegan.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="group p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 group-hover:bg-brand-800 group-hover:border-brand-800 transition-colors">
                  <i className={`fa-solid ${feat.icon} text-brand-700 group-hover:text-gold-300 text-lg transition-colors`}></i>
                </div>
                <h3 className="font-bold text-stone-900 text-sm mb-2">{feat.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          GALERI PORTOFOLIO (DINAMIS DARI SUPABASE)
      ═══════════════════════════════════════════════ */}
      <section id="portofolio" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-brand-700 text-xs font-bold tracking-[0.25em] uppercase mb-3">Karya Terbaru</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
                Portofolio Motif Batik
              </h2>
              <p className="mt-3 text-stone-500 text-sm max-w-lg leading-relaxed">
                Kumpulan motif batik yang telah kami produksi. Setiap karya mencerminkan keahlian, 
                ketelitian, dan keindahan warisan batik Indonesia.
              </p>
            </div>
            <a
              href={WA_ADMIN1}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm active:scale-95 transition-all shadow-md"
            >
              <i className="fa-brands fa-whatsapp text-green-300"></i>
              Pesan Motif Ini
            </a>
          </div>

          {/* Dynamic Gallery Component */}
          <LandingGallery />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LAYANAN
      ═══════════════════════════════════════════════ */}
      <section id="layanan" className="py-20 sm:py-28 bg-brand-950 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-5">
          <img src="/hero-batik.png" alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: Quote */}
            <div>
              <p className="text-gold-400 text-xs font-bold tracking-[0.25em] uppercase mb-6">Tentang Kami</p>
              <blockquote className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-8">
                "Creativity takes courage."
                <cite className="block text-gold-300 text-lg font-sans font-normal mt-3 not-italic">
                  — Henri Matisse
                </cite>
              </blockquote>

              {/* Keunggulan Badges */}
              <div className="flex flex-wrap gap-2">
                {KEUNGGULAN.map((k) => (
                  <div
                    key={k.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-stone-200 text-xs font-semibold hover:bg-white/15 transition-colors"
                  >
                    <i className={`fa-solid ${k.icon} text-gold-400 text-[11px]`}></i>
                    {k.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Description */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
                Spesialis Batik Printing
                <br />
                <span className="text-gold-300">Berkualitas Tinggi</span>
              </h2>
              <div className="space-y-4 text-stone-300 text-sm sm:text-base leading-relaxed">
                <p>
                  Industri batik kami adalah jenis <strong className="text-white">batik printing</strong> — cetak sablon 
                  berkualitas. Kami melayani jasa pembuatan batik dalam bentuk kain utuh, potongan, 
                  maupun baju jadi.
                </p>
                <p>
                  Kami ada sejak <strong className="text-white">tahun 2013 di Surakarta</strong> dan masih berjalan 
                  hingga sekarang. Dengan pengalaman lebih dari 10 tahun, tentunya banyak pengalaman kami 
                  di bidang ini.
                </p>
                <p>
                  Kualitas yang kami tawarkan adalah kualitas terbaik — dari jenis kain, pemakaian obat, 
                  hingga pengerjaan. Kami memiliki SDM yang sangat terampil: desainer motif, pekerja cetak, 
                  penjahit profesional, tim QC, hingga bagian pengiriman.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={WA_ADMIN1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm active:scale-95 transition-all"
                >
                  <i className="fa-brands fa-whatsapp text-base"></i>
                  Admin 1 — Konsultasi
                </a>
                <a
                  href={WA_ADMIN2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm active:scale-95 transition-all"
                >
                  <i className="fa-brands fa-whatsapp text-green-400 text-base"></i>
                  Admin 2 — Pemesanan
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIAL
      ═══════════════════════════════════════════════ */}
      <section id="testimoni" className="py-20 sm:py-28 bg-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <p className="text-brand-700 text-xs font-bold tracking-[0.25em] uppercase mb-3">Kepercayaan Pelanggan</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
              Kata Partner Kami
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="relative p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all"
              >
                {/* Quote mark */}
                <i className="fa-solid fa-quote-left text-brand-100 text-4xl absolute top-4 right-4"></i>

                <p className="text-stone-700 text-sm leading-relaxed mb-6 relative z-10">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-sm">{t.name}</p>
                    <p className="text-stone-500 text-xs">{t.from}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          KONTAK & MAPS
      ═══════════════════════════════════════════════ */}
      <section id="kontak" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <p className="text-brand-700 text-xs font-bold tracking-[0.25em] uppercase mb-3">Temukan Kami</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
              We Have the Right Place For You
            </h2>
            <p className="mt-3 text-stone-500 text-sm max-w-md mx-auto">
              Kunjungi kami di Ndalem Tjokrosukarnan, Surakarta, atau hubungi langsung via WhatsApp.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-xl mx-auto">
            <a
              href={WA_ADMIN1}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-200 hover:bg-green-100 hover:border-green-300 transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <i className="fa-brands fa-whatsapp text-white text-xl"></i>
              </div>
              <div>
                <p className="font-bold text-green-900 text-sm">Admin 1</p>
                <p className="text-green-700 text-xs font-mono">+62 823-1101-6332</p>
              </div>
            </a>

            <a
              href={WA_ADMIN2}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-200 hover:bg-green-100 hover:border-green-300 transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <i className="fa-brands fa-whatsapp text-white text-xl"></i>
              </div>
              <div>
                <p className="font-bold text-green-900 text-sm">Admin 2</p>
                <p className="text-green-700 text-xs font-mono">+62 851-0096-9475</p>
              </div>
            </a>
          </div>

          {/* Google Maps */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-md">
            <iframe
              src="https://maps.google.com/maps?q=ndalem%20Tjokrosukarnan&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="360"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Nirbana Batik di Surakarta"
            ></iframe>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════ */}
      <footer className="bg-brand-950 text-stone-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

            {/* Left: Brand */}
            <div className="flex items-center gap-3">
              <img
                src="/logo-nirbana.png"
                alt="Logo Nirbana Batik"
                className="h-8 w-auto object-contain opacity-80"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div>
                <p className="font-serif font-bold text-white text-sm">Nirbana Batik</p>
                <p className="text-[10px] text-stone-500">© 2024 Nusantara Lestari. All rights reserved.</p>
              </div>
            </div>

            {/* Middle: Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/batiknirbana_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                aria-label="Instagram Nirbana Batik"
              >
                <i className="fa-brands fa-instagram text-base"></i>
              </a>
              <a
                href={WA_ADMIN1}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-green-600 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                aria-label="WhatsApp Admin 1"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
              </a>
            </div>

            {/* Right: Enter App */}
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <i className="fa-solid fa-right-to-bracket text-xs"></i>
              Masuk ke Sistem SPK
            </button>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a
        href={WA_ADMIN1}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 shadow-lg hover:shadow-xl flex items-center justify-center text-white text-2xl active:scale-95 transition-all"
        aria-label="Chat WhatsApp Admin"
        title="Chat WhatsApp Admin Nirbana Batik"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>

    </div>
  );
};
