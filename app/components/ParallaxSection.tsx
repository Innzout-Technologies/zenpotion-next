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
        {/* Bottle */}
        <div className="relative">
          <div
            className="w-36 h-[330px] md:w-44 md:h-[380px] rounded-[70px] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(160deg, #d4edda 0%, #a8d5a2 40%, #6ba368 100%)',
            }}
          >
            <div
              className="absolute top-0 left-[20%] w-[28%] h-full rounded-full opacity-35"
              style={{
                background: 'linear-gradient(180deg, white 0%, transparent 60%)',
              }}
            />
            <div className="absolute inset-x-4 top-[22%] bottom-[22%] rounded-[36px] bg-white/75 flex flex-col items-center justify-center gap-1.5 border border-white/90">
              <span
                className="text-[#1a2e1a] text-2xl font-black"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                ZenPotion
              </span>
              <div className="w-6 h-px bg-[#5a7a4e]" />
              <span className="text-[8px] uppercase tracking-widest text-[#5a7a4e] text-center px-3">
                Natural Hydration
              </span>
            </div>
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-12 h-6 rounded-full bg-[#1a2e1a]" />
          </div>
          {/* Glow */}
          <div
            className="absolute -inset-8 -z-10 rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(90,122,78,0.3) 0%, transparent 65%)',
            }}
          />
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
