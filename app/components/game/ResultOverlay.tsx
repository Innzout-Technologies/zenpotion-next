'use client';

import { motion } from 'framer-motion';
import type { ProductRecommendation } from '../../utils/gameHelpers';

interface ResultOverlayProps {
  won: boolean;
  score: number;
  drinks: number;
  product: ProductRecommendation;
  onPlayAgain: () => void;
  onOrder: () => void;
}

export default function ResultOverlay({ won, score, drinks, product, onPlayAgain, onOrder }: ResultOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-8 px-6 text-center"
    >
      <div className="text-5xl mb-2">{won ? '🏆' : '💪'}</div>

      <h3
        className="text-2xl font-bold text-[#1a2e1a] mb-1"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {won ? (drinks >= 3 ? 'Juice Master!' : 'Well Done!') : 'Keep Practising!'}
      </h3>

      {/* Score + drinks row */}
      <div
        className="flex items-center gap-3 mb-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <span className="text-sm text-[#5a7a4e]">
          Score: <span className="font-bold tabular-nums">{String(score).padStart(5, '0')}</span>
        </span>
        {drinks > 0 && (
          <>
            <span className="text-[#c5e0bf]">·</span>
            <span className="text-sm font-semibold text-[#15803d]">
              🍶 {drinks} drink{drinks !== 1 ? 's' : ''} brewed
            </span>
          </>
        )}
        <span className="text-[#c5e0bf]">·</span>
        <span className="text-sm text-[#5a7a4e]">Your blend match:</span>
      </div>

      {/* Product card */}
      <div
        className="w-full max-w-xs rounded-2xl p-5 mb-5 border text-left"
        style={{ background: `${product.color}10`, borderColor: `${product.color}30` }}
      >
        {/* Size badge + label */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-full"
            style={{
              color: product.color,
              background: `${product.color}20`,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {product.size} Shot
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#8a9e84]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Recommended for you
          </span>
        </div>

        <h4
          className="text-xl font-bold text-[#1a2e1a] mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {product.name}
        </h4>
        <p
          className="text-xs text-[#5a7a4e] mb-3"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {product.tagline}
        </p>
        <ul className="space-y-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {product.benefits.map(b => (
            <li key={b} className="flex items-center gap-1.5 text-xs text-[#4a5c44]">
              <span style={{ color: product.color }}>✓</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onPlayAgain}
          className="px-6 py-2.5 rounded-full text-sm font-semibold border border-[#c5e0bf] text-[#5a7a4e] hover:bg-[#e8f5e4] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Play Again
        </button>
        <button
          onClick={onOrder}
          className="px-6 py-2.5 rounded-full text-sm font-semibold bg-[#1a2e1a] text-[#f8f5ef] hover:bg-[#5a7a4e] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Order 60ml Shot →
        </button>
      </div>
    </motion.div>
  );
}
