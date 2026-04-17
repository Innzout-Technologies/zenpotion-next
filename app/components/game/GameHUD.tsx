'use client';

import type { IngredientType } from './Ingredients';

interface GameHUDProps {
  score: number;
  lives: number;
  juiceMeter: number; // 0–100
  collected: Record<IngredientType, number>;
}

export default function GameHUD({ score, lives, juiceMeter, collected }: GameHUDProps) {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-4 pt-3 pb-2 pointer-events-none select-none">
      {/* Score */}
      <div className="flex flex-col">
        <span
          className="text-[10px] uppercase tracking-[0.18em] text-[#5a7a4e] font-semibold"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Score
        </span>
        <span
          className="text-xl font-bold text-[#1a2e1a] leading-tight tabular-nums"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {String(score).padStart(5, '0')}
        </span>
      </div>

      {/* Juice Meter — center */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-[10px] uppercase tracking-[0.18em] text-[#5a7a4e] font-semibold"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Juice Meter
        </span>
        <div className="w-28 sm:w-40 h-2.5 rounded-full bg-[#e8f5e4] border border-[#c5e0bf] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${juiceMeter}%`,
              background: 'linear-gradient(90deg, #5a7a4e 0%, #a8d5a2 100%)',
            }}
          />
        </div>
        <div
          className="flex gap-2 text-xs text-[#4a5c44]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <span>🍊 {collected.orange}</span>
          <span>🌱 {collected.ginger}</span>
          <span>💚 {collected.amla}</span>
        </div>
      </div>

      {/* Lives */}
      <div className="flex flex-col items-end">
        <span
          className="text-[10px] uppercase tracking-[0.18em] text-[#5a7a4e] font-semibold mb-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Lives
        </span>
        <div className="flex gap-0.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="text-base transition-all duration-200"
              style={{ opacity: i < lives ? 1 : 0.2 }}
            >
              ❤️
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
