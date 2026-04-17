'use client';

import { motion } from 'framer-motion';
import type { ProductRecommendation } from '../../utils/gameHelpers';

interface ResultOverlayProps {
  won: boolean;
  score: number;
  product: ProductRecommendation;
  onPlayAgain: () => void;
  onOrder: () => void;
}

export default function ResultOverlay({
  won,
  score,
  product,
  onPlayAgain,
  onOrder,
}: ResultOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-10 px-6 text-center"
    >
      {/* Trophy / retry icon */}
      <div className="text-5xl mb-3">{won ? '🏆' : '💪'}</div>

      <h3
        className="text-2xl font-bold text-[#1a2e1a] mb-1"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {won ? 'Juice Complete!' : 'Almost There!'}
      </h3>
      <p
        className="text-sm text-[#5a7a4e] mb-5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Score: {String(score).padStart(5, '0')} &nbsp;·&nbsp; Your ZenPotion match:
      </p>

      {/* Product card */}
      <div
        className="w-full max-w-xs rounded-2xl p-5 mb-5 border text-left"
        style={{
          background: `${product.color}12`,
          borderColor: `${product.color}35`,
        }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1"
          style={{ color: product.color, fontFamily: "'DM Sans', sans-serif" }}
        >
          Recommended for you
        </p>
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
        <ul
          className="space-y-1 text-xs text-[#4a5c44]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {product.benefits.map(b => (
            <li key={b} className="flex items-center gap-1.5">
              <span className="text-[#5a7a4e]">✓</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
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
          Order Now →
        </button>
      </div>
    </motion.div>
  );
}
