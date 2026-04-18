'use client';

import type { IngredientType } from './Ingredients';

interface GameHUDProps {
  score: number;
  lives: number;
  juiceMeter: number;         // 0–100
  collected: Record<IngredientType, number>;
  gingerTimer: number;        // 0–100 frames remaining of ginger power
  drinks: number;             // completed drink cycles
}

const INGREDIENT_ICONS: { type: IngredientType; emoji: string; label: string }[] = [
  { type: 'orange',   emoji: '🍊', label: 'Orange'   },
  { type: 'lemon',    emoji: '🍋', label: 'Lemon'    },
  { type: 'ginger',   emoji: '⚡', label: 'Ginger'   },
  { type: 'amla',     emoji: '🟢', label: 'Amla'     },
  { type: 'beetroot', emoji: '🔴', label: 'Beetroot' },
];

const GINGER_MAX = 100;

export default function GameHUD({ score, lives, juiceMeter, collected, gingerTimer, drinks }: GameHUDProps) {
  const gingerPct = Math.round((gingerTimer / GINGER_MAX) * 100);
  const isPowered = gingerTimer > 0;

  return (
    <div className="absolute top-0 left-0 right-0 flex flex-col pointer-events-none select-none">
      {/* ── Main row ── */}
      <div className="flex items-start justify-between px-3 pt-2.5 pb-1.5">

        {/* Score + Drinks */}
        <div className="flex flex-col min-w-[56px]">
          <span
            className="text-[9px] uppercase tracking-[0.18em] text-[#5a7a4e] font-semibold"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Score
          </span>
          <span
            className="text-lg font-bold text-[#1a2e1a] leading-tight tabular-nums"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {String(score).padStart(5, '0')}
          </span>
          {drinks > 0 && (
            <span
              className="text-[9px] font-semibold text-[#15803d] mt-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              🍶 ×{drinks}
            </span>
          )}
        </div>

        {/* Juice Meter + ingredient counts */}
        <div className="flex flex-col items-center gap-1 flex-1 mx-3">
          <span
            className="text-[9px] uppercase tracking-[0.18em] text-[#5a7a4e] font-semibold"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Juice Meter
          </span>

          {/* Progress bar */}
          <div className="w-full max-w-[160px] h-2.5 rounded-full bg-[#e8f5e4] border border-[#c5e0bf] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${juiceMeter}%`,
                background: isPowered
                  ? 'linear-gradient(90deg, #d97706 0%, #fbbf24 100%)'
                  : 'linear-gradient(90deg, #5a7a4e 0%, #a8d5a2 100%)',
              }}
            />
          </div>

          {/* Ingredient counts — 5 in a row */}
          <div
            className="flex gap-1.5 text-[10px] text-[#4a5c44]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {INGREDIENT_ICONS.map(({ type, emoji }) => (
              <span
                key={type}
                className="flex items-center gap-0.5 transition-all duration-150"
                style={{
                  fontWeight: type === 'ginger' && collected[type] > 0 ? 700 : 400,
                  color: type === 'ginger' && collected[type] > 0 ? '#d97706' : undefined,
                }}
              >
                {emoji} {collected[type]}
              </span>
            ))}
          </div>
        </div>

        {/* Lives */}
        <div className="flex flex-col items-end min-w-[52px]">
          <span
            className="text-[9px] uppercase tracking-[0.18em] text-[#5a7a4e] font-semibold mb-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Lives
          </span>
          <div className="flex gap-0.5">
            {[0, 1, 2].map(i => (
              <span key={i} className="text-sm transition-all duration-200" style={{ opacity: i < lives ? 1 : 0.2 }}>
                ❤️
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Ginger Power bar — only rendered when active ── */}
      {isPowered && (
        <div
          className="mx-3 mb-1 flex items-center gap-2 px-3 py-1 rounded-full border"
          style={{
            background: 'rgba(251,191,36,0.15)',
            borderColor: 'rgba(217,119,6,0.4)',
          }}
        >
          <span className="text-sm">⚡</span>
          <span
            className="text-[9px] uppercase tracking-[0.15em] font-bold text-amber-700 flex-shrink-0"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Ginger Power
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-amber-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${gingerPct}%`,
                background: 'linear-gradient(90deg, #d97706, #fbbf24)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
