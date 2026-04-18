'use client';
// app/components/ParallaxSection.tsx

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ingredients = [
  { emoji: '🥥', label: 'Coconut', x: '8%', y: '20%', size: 80, delay: 0 },
  { emoji: '🍋', label: 'Lemon', x: '78%', y: '15%', size: 64, delay: 0.2 },
  { emoji: '🌿', label: 'Mint', x: '88%', y: '60%', size: 72, delay: 0.4 },
  { emoji: '🌱', label: 'Tulsi', x: '5%', y: '65%', size: 60, delay: 0.1 },
  { emoji: '💧', label: 'Water', x: '50%', y: '8%', size: 56, delay: 0.3 },
];

export default function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Layer speeds
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const fgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.05]);
  const textY = useTransform(scrollYProgress, [0, 1], ['20px', '-60px']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative h-[140vh] overflow-hidden"
      aria-label="Parallax hydration story section"
    >
      {/* ─── Layer 1: Background (slowest) ─── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0"
      >
        <div
          className="w-full h-full"
          style={{
            background:
              'linear-gradient(170deg, #eef7eb 0%, #d4edda 30%, #b8e0b4 55%, #8fc98a 80%, #5a7a4e 100%)',
          }}
        />
        {/* Organic blob shapes */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <ellipse cx="200" cy="200" rx="300" ry="220" fill="#a8d5a2" />
          <ellipse cx="1200" cy="700" rx="280" ry="200" fill="#6ba368" />
          <ellipse cx="720" cy="500" rx="350" ry="280" fill="#c5e0bf" />
        </svg>

        {/* Fine dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #1a2e1a 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </motion.div>

      {/* ─── Layer 2: Mid ingredients (medium speed) ─── */}
      <motion.div
        style={{ y: midY }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        {ingredients.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: item.delay + 0.3, duration: 0.7, ease: 'backOut' }}
            viewport={{ once: true }}
            className="absolute flex flex-col items-center gap-1 select-none"
            style={{ left: item.x, top: item.y }}
          >
            <div
              className="rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/80"
              style={{ width: item.size, height: item.size, fontSize: item.size * 0.42 }}
            >
              {item.emoji}
            </div>
            <span
              className="text-[10px] uppercase tracking-widest text-[#2a4a28] font-semibold bg-white/50 px-2 py-0.5 rounded-full"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {item.label}
            </span>
          </motion.div>
        ))}

        {/* Flowing lines decoration */}
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 1440 900">
          <path
            d="M0 400 Q360 300 720 450 Q1080 600 1440 400"
            stroke="#3d6b39"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="8 12"
          />
          <path
            d="M0 550 Q400 450 800 550 Q1100 650 1440 520"
            stroke="#3d6b39"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 16"
          />
        </svg>
      </motion.div>

      {/* ─── Layer 3: Foreground bottle + headline (fastest) ─── */}
      <motion.div
        style={{ y: fgY, scale: fgScale }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      >
        {/* Plenish-style bottle */}
        <div className="relative">
          {/* Glow behind bottle */}
          <div
            className="absolute -inset-8 -z-10 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(90,122,78,0.3) 0%, transparent 65%)' }}
          />

          <div
            className="relative w-36 md:w-48"
            style={{ filter: 'drop-shadow(0 20px 36px rgba(26,46,26,0.30))' }}
          >
            <svg viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <defs>
                <linearGradient id="psBg" x1="0" y1="88" x2="280" y2="320" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"  stopColor="#daf0d6" />
                  <stop offset="40%" stopColor="#8fc98a" />
                  <stop offset="100%" stopColor="#3a5835" />
                </linearGradient>
                <linearGradient id="psGloss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="white" stopOpacity="0.55" />
                  <stop offset="80%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="psCap" x1="140" y1="4" x2="140" y2="88" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="55%" stopColor="#e8e6e2" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#b0aca6" stopOpacity="0.35" />
                </linearGradient>
                <clipPath id="psClip">
                  <path d="M74,88 L74,118 C74,156 12,152 12,156 L12,290 Q12,312 34,312 L246,312 Q268,312 268,290 L268,156 C268,152 206,156 206,118 L206,88 Z" />
                </clipPath>
              </defs>

              {/* Body (shoulder + barrel) */}
              <path
                d="M74,88 L74,118 C74,156 12,152 12,156 L12,290 Q12,312 34,312 L246,312 Q268,312 268,290 L268,156 C268,152 206,156 206,118 L206,88 Z"
                fill="url(#psBg)"
              />

              {/* Left gloss strip */}
              <rect x="16" y="88" width="42" height="224" rx="10" fill="url(#psGloss)" opacity="0.40" clipPath="url(#psClip)" />

              {/* White label background */}
              <rect x="14" y="163" width="252" height="116" rx="10" fill="rgba(255,255,255,0.92)" />

              {/* Neck */}
              <rect x="72" y="84" width="136" height="34" fill="url(#psBg)" />
              <rect x="72" y="84" width="136" height="34" fill="rgba(0,0,0,0.06)" />

              {/* Wide ribbed plastic cap */}
              <rect x="36" y="4"  width="208" height="84" rx="14" fill="#f0eeec" />
              <rect x="36" y="4"  width="208" height="84" rx="14" fill="url(#psCap)" />
              {/* Rib lines */}
              <line x1="38" y1="28" x2="242" y2="28" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
              <line x1="38" y1="48" x2="242" y2="48" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
              <line x1="38" y1="68" x2="242" y2="68" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
              {/* Cap–neck seam */}
              <rect x="36" y="82" width="208" height="5" rx="0" fill="rgba(0,0,0,0.10)" />
            </svg>

            {/* Label content */}
            <div
              className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
              style={{ top: '50.9%', left: '5%', right: '5%', bottom: '13.4%' }}
            >
              <span
                className="font-black text-[#1a2e1a] leading-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(12px, 2.5vw, 18px)' }}
              >
                ZenPotion
              </span>
              <div className="w-6 h-px bg-[#5a7a4e] my-1" />
              <span
                className="uppercase text-[#5a7a4e] font-semibold text-center"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(4px, 0.8vw, 6px)', letterSpacing: '0.2em' }}
              >
                Natural Hydration
              </span>
            </div>
          </div>
        </div>

        {/* Text overlay */}
        <motion.div style={{ y: textY, opacity: textOpacity }} className="text-center mt-10 px-6">
          <p
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-md"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Purity in every drop.
          </p>
          <p
            className="text-white/80 mt-3 text-base md:text-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Sourced, crafted, and bottled for the Indian palate.
          </p>
        </motion.div>
      </motion.div>

      {/* Soft bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 z-30 bg-gradient-to-t from-[#f8f5ef] to-transparent" />
    </section>
  );
}
