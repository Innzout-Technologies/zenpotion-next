'use client';
// app/components/Hero.tsx

import { useEffect, useRef } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';

const floatVariants: Variants = {
  animate: {
    y: [0, -20, 0],
    rotate: [-2, 2, -2],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (clientX - cx) / cx;
      const dy = (clientY - cy) / cy;
      if (orb1.current)
        orb1.current.style.transform = `translate(${dx * 24}px, ${dy * 24}px)`;
      if (orb2.current)
        orb2.current.style.transform = `translate(${-dx * 16}px, ${-dy * 16}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToCTA = () => {
    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f8f5ef]">
      {/* Ambient background orbs */}
      <div
        ref={orb1}
        className="pointer-events-none absolute top-[10%] left-[5%] w-[480px] h-[480px] rounded-full transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(134,197,130,0.18) 0%, transparent 70%)',
        }}
      />
      <div
        ref={orb2}
        className="pointer-events-none absolute bottom-[5%] right-[5%] w-[400px] h-[400px] rounded-full transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(240,186,100,0.14) 0%, transparent 70%)',
        }}
      />

      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center max-w-6xl">
        {/* Left: Text */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#5a7a4e] font-semibold bg-[#e8f5e4] px-4 py-2 rounded-full border border-[#c5e0bf]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5a7a4e] animate-pulse" />
              Early Access Open · India Launch 2025
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-[#1a2e1a]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Clean Hydration
            <br />
            <span className="text-[#5a7a4e]">for Everyday</span>
            <br />
            Energy.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-[#4a5c44] max-w-md leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            A refreshing blend crafted for modern lifestyles in India. Real ingredients,
            zero compromises, daily vitality.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-4 flex-wrap">
            <button
              onClick={scrollToCTA}
              className="group relative overflow-hidden bg-[#1a2e1a] text-[#f8f5ef] px-8 py-4 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#1a2e1a]/30"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.1em' }}
            >
              <span className="relative z-10">Join Waitlist</span>
              <div className="absolute inset-0 bg-[#5a7a4e] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button
              onClick={() =>
                document.getElementById('ingredients')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="text-[#5a7a4e] text-sm font-medium underline-offset-4 hover:underline transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Explore ingredients →
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-6 pt-2">
            {[
              { value: '100%', label: 'Natural' },
              { value: '0g', label: 'Added Sugar' },
              { value: '4', label: 'Ingredients' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span
                  className="text-2xl font-bold text-[#1a2e1a]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-[#8a9e84] uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Bottle */}
        <div className="flex justify-center items-center relative">
          {/* Glow ring */}
          <div
            className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(90,122,78,0.12) 0%, rgba(134,197,130,0.06) 50%, transparent 70%)',
            }}
          />
          <motion.div variants={floatVariants} animate="animate" className="relative z-10">
            {/* Plenish-style shot bottle */}
            <div className="relative w-40 md:w-52" style={{ filter: 'drop-shadow(0 28px 44px rgba(26,46,26,0.30))' }}>
              <svg viewBox="0 0 200 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <defs>
                  <linearGradient id="hBg" x1="0" y1="80" x2="200" y2="360" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"  stopColor="#daf0d6" />
                    <stop offset="40%" stopColor="#8fc98a" />
                    <stop offset="100%" stopColor="#3a5835" />
                  </linearGradient>
                  <linearGradient id="hGloss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="white" stopOpacity="0.55" />
                    <stop offset="80%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="hCap" x1="100" y1="4" x2="100" y2="82" gradientUnits="userSpaceOnUse">
                    <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="55%" stopColor="#e8e6e2" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#b0aca6" stopOpacity="0.35" />
                  </linearGradient>
                  <clipPath id="hClip">
                    <path d="M64,80 L64,108 C64,138 12,134 12,138 L12,308 Q12,328 32,328 L168,328 Q188,328 188,308 L188,138 C188,134 136,138 136,108 L136,80 Z" />
                  </clipPath>
                </defs>

                {/* Body (shoulder + barrel) */}
                <path
                  d="M64,80 L64,108 C64,138 12,134 12,138 L12,308 Q12,328 32,328 L168,328 Q188,328 188,308 L188,138 C188,134 136,138 136,108 L136,80 Z"
                  fill="url(#hBg)"
                />

                {/* Left gloss strip */}
                <rect x="16" y="80" width="34" height="248" rx="8" fill="url(#hGloss)" opacity="0.40" clipPath="url(#hClip)" />

                {/* White label background */}
                <rect x="14" y="152" width="172" height="140" rx="8" fill="rgba(255,255,255,0.92)" />

                {/* Neck */}
                <rect x="62" y="76" width="76" height="32" fill="url(#hBg)" />
                <rect x="62" y="76" width="76" height="32" fill="rgba(0,0,0,0.06)" />

                {/* Wide ribbed plastic cap */}
                <rect x="28" y="4"  width="144" height="76" rx="12" fill="#f0eeec" />
                <rect x="28" y="4"  width="144" height="76" rx="12" fill="url(#hCap)" />
                {/* Rib lines */}
                <line x1="30" y1="26" x2="170" y2="26" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
                <line x1="30" y1="46" x2="170" y2="46" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
                <line x1="30" y1="64" x2="170" y2="64" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
                {/* Cap–neck seam */}
                <rect x="28" y="78" width="144" height="5" rx="0" fill="rgba(0,0,0,0.10)" />
              </svg>

              {/* Label content */}
              <div
                className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
                style={{ top: '42.2%', left: '7%', right: '7%', bottom: '8.4%' }}
              >
                <span
                  className="font-black text-[#1a2e1a] leading-none"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(13px, 2.8vw, 20px)' }}
                >
                  ZenPotion
                </span>
                <div className="w-8 h-px bg-[#5a7a4e] my-1.5" />
                <span
                  className="uppercase text-[#5a7a4e] font-semibold"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(5px, 0.8vw, 7px)', letterSpacing: '0.20em' }}
                >
                  Natural Hydration
                </span>
                <div className="flex gap-1 mt-1.5" style={{ fontSize: 'clamp(8px, 1.6vw, 12px)' }}>
                  {['🥥', '🍋', '🌿'].map((e, i) => <span key={i}>{e}</span>)}
                </div>
                <span
                  className="uppercase text-[#8aaa84] mt-1"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(4px, 0.7vw, 6px)', letterSpacing: '0.25em' }}
                >
                  60ml
                </span>
              </div>
            </div>

            {/* Ground shadow */}
            <div
              className="mx-auto mt-2 w-36 h-3 rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(26,46,26,0.20) 0%, transparent 70%)' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a9e84]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#8a9e84] to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
