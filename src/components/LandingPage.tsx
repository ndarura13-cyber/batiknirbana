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
  { icon: 'fa-clipboard-check', label: 'Quality Control' },
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
  const [isWaOpen, setIsWaOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [trackInput, setTrackInput] = useState('');
  const heroRef = useRef<HTMLElement>(null);

  // Sticky navbar & Scroll spy detection
  useEffect(() => {
    const handler = () => {
      setIsScrolled(window.scrollY > 60);

      // Scroll spy logic
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= (element.offsetTop - 150)) {
          current = section;
        }
      }
      if (current) {
        setActiveSection(current);
      }
    };
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

  const WA_ADMIN1 = 'https://wa.me/+6282311016332';
  const WA_ADMIN2 = 'https://wa.me/+6285100969475';

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      window.location.href = `?spk=${encodeURIComponent(trackInput.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden" id="beranda">

      {/* ═══════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
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
                    activeSection === link.href.substring(1)
                      ? (isScrolled ? 'text-brand-800 bg-brand-50' : 'text-white bg-white/20')
                      : (isScrolled ? 'text-stone-700 hover:text-brand-800 hover:bg-brand-50' : 'text-white/90 hover:text-white hover:bg-white/10')
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
                <span>Sistem SPK</span>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className={`lg:hidden p-2 rounded-xl transition-colors ${isScrolled ? 'text-stone-700 hover:bg-stone-100' : 'text-white hover:bg-white/10'
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
                  className={`text-left px-4 py-3 rounded-xl font-semibold transition-colors text-sm ${
                    activeSection === link.href.substring(1)
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-stone-800 hover:bg-brand-50 hover:text-brand-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={onEnterApp}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-800 text-white font-bold text-sm active:scale-95 transition-all"
              >
                <i className="fa-solid fa-right-to-bracket text-xs"></i>
                Sistem SPK
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
            Sejak 2013
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
              Portofolio
            </button>
            <a
              href={WA_ADMIN1}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm backdrop-blur-sm active:scale-95 transition-all"
            >
              <i className="fa-brands fa-whatsapp text-green-400 text-base"></i>
              Hubungi Kami
            </a>
          </div>

          {/* Form Lacak SPK */}
          <form onSubmit={handleTrackSubmit} className="mt-8 max-w-sm mx-auto relative flex items-center">
            <input
              type="text"
              placeholder="Masukkan Nomor SPK untuk dilacak..."
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              className="w-full pl-5 pr-12 py-3.5 rounded-2xl bg-white/10 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-gold-400 backdrop-blur-sm text-sm"
              required
            />
            <button
              type="submit"
              className="absolute right-2 p-2.5 rounded-xl bg-gold-400 text-brand-950 hover:bg-gold-300 transition-colors shadow-sm"
              title="Lacak SPK"
            >
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </button>
          </form>

          {/* Form Lacak SPK */}
          <form onSubmit={handleTrackSubmit} className="mt-8 max-w-sm mx-auto relative flex items-center">
            <input
              type="text"
              placeholder="Masukkan Nomor SPK untuk dilacak..."
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              className="w-full pl-5 pr-12 py-3.5 rounded-2xl bg-white/10 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-gold-400 backdrop-blur-sm text-sm"
              required
            />
            <button
              type="submit"
              className="absolute right-2 p-2.5 rounded-xl bg-gold-400 text-brand-950 hover:bg-gold-300 transition-colors shadow-sm"
              title="Lacak SPK"
            >
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </button>
          </form>

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
              { num: '999+', label: 'Pelanggan Puas' },
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className="group p-4 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-brand-800 group-hover:border-brand-800 transition-colors">
                  <i className={`fa-solid ${feat.icon} text-brand-700 group-hover:text-gold-300 text-base sm:text-lg transition-colors`}></i>
                </div>
                <h3 className="font-bold text-stone-900 text-xs sm:text-sm mb-1.5 sm:mb-2 leading-tight">{feat.title}</h3>
                <p className="text-stone-500 text-[10px] sm:text-xs leading-relaxed">{feat.desc}</p>
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
            <p className="text-brand-700 text-xs font-bold tracking-[0.25em] uppercase mb-3">Testimoni</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-950">
              Kata Mereka
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
              Kunjungi Lokasi Kami
            </h2>
            <p className="mt-3 text-stone-500 text-sm max-w-md mx-auto">
              Kunjungi kami di Ndalem Tjokrosukarnan, Surakarta, atau hubungi langsung via WhatsApp.
            </p>
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
              Sistem SPK
            </button>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button & Roll-Up Modal */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Roll-up Menu */}
        {isWaOpen && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-3 flex flex-col gap-2 w-48 animate-slideUp origin-bottom-right">
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 px-1">Pilih Admin</div>
            <a
              href={WA_ADMIN1}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 text-stone-800 transition-colors group border border-transparent hover:border-green-100"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors text-green-600">
                <i className="fa-brands fa-whatsapp text-sm"></i>
              </div>
              <div>
                <div className="text-sm font-bold text-stone-800">Konsultasi</div>
                <div className="text-[10px] font-semibold text-stone-500">Admin 1</div>
              </div>
            </a>
            <a
              href={WA_ADMIN2}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 text-stone-800 transition-colors group border border-transparent hover:border-green-100"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors text-green-600">
                <i className="fa-brands fa-whatsapp text-sm"></i>
              </div>
              <div>
                <div className="text-sm font-bold text-stone-800">Pemesanan</div>
                <div className="text-[10px] font-semibold text-stone-500">Admin 2</div>
              </div>
            </a>
          </div>
        )}

        {/* Float Button */}
        <button
          onClick={() => setIsWaOpen(!isWaOpen)}
          className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white text-2xl active:scale-95 transition-all ${isWaOpen ? 'bg-stone-800 hover:bg-stone-700' : 'bg-green-500 hover:bg-green-400'
            }`}
          aria-label="Tampilkan opsi Chat WhatsApp"
          title="Chat WhatsApp Admin Nirbana Batik"
        >
          <i className={isWaOpen ? 'fa-solid fa-xmark' : 'fa-brands fa-whatsapp'}></i>
        </button>
      </div>

    </div>
  );
};
