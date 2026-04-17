'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import ResultOverlay from './game/ResultOverlay';
import { getProductRecommendation } from '../utils/gameHelpers';
import type { IngredientType } from './game/Ingredients';

// Dynamic import with ssr:false — canvas APIs are browser-only
const GameCanvas = dynamic(() => import('./game/GameCanvas'), { ssr: false });

type GameState = 'idle' | 'playing' | 'finished';

interface GameResult {
  score: number;
  collected: Record<IngredientType, number>;
  won: boolean;
}

export default function GameSection() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [result, setResult] = useState<GameResult | null>(null);
  // Incrementing key forces a full remount of GameCanvas on each play
  const [gameKey, setGameKey] = useState(0);

  const handleGameEnd = useCallback(
    (score: number, collected: Record<IngredientType, number>, won: boolean) => {
      setResult({ score, collected, won });
      setGameState('finished');
    },
    []
  );

  const handleStart = useCallback(() => {
    setResult(null);
    setGameKey(k => k + 1);
    setGameState('playing');
  }, []);

  const scrollToCTA = useCallback(() => {
    document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const product = result ? getProductRecommendation(result.collected) : null;

  return (
    <section id="game" className="relative py-20 bg-[#f8f5ef] overflow-hidden">
      {/* Ambient orb */}
      <div
        className="pointer-events-none absolute -top-20 right-0 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(134,197,130,0.13) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <span
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#5a7a4e] font-semibold bg-[#e8f5e4] px-4 py-2 rounded-full border border-[#c5e0bf] mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span className="text-sm">🎮</span>
            Juice Runner
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#1a2e1a] mt-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Build Your Perfect Blend
          </h2>
          <p
            className="text-base text-[#4a5c44] mt-3 max-w-md mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Collect ingredients, dodge sugar, discover your ZenPotion.
          </p>
        </motion.div>

        {/* Game container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl overflow-hidden border border-[#c5e0bf] shadow-lg bg-white"
          style={{ minHeight: '240px' }}
        >
          <AnimatePresence mode="wait">
            {/* ── Idle ── */}
            {gameState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-14 px-6 text-center"
              >
                <div className="text-6xl mb-4">🧃</div>
                <h3
                  className="text-2xl font-bold text-[#1a2e1a] mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Juice Runner
                </h3>
                <p
                  className="text-sm text-[#5a7a4e] mb-1 max-w-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Collect 15 ingredients to reveal your ZenPotion match.
                </p>
                <div
                  className="flex flex-wrap justify-center gap-3 text-sm text-[#4a5c44] mt-3 mb-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span className="bg-[#e8f5e4] px-3 py-1 rounded-full">🍊 Orange</span>
                  <span className="bg-[#e8f5e4] px-3 py-1 rounded-full">🌱 Ginger</span>
                  <span className="bg-[#e8f5e4] px-3 py-1 rounded-full">💚 Amla</span>
                </div>
                <p
                  className="text-xs text-[#8a9e84] mb-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Avoid 🍬 sugar · 🍕 junk food · 🥤 soda
                </p>
                <p
                  className="text-xs text-[#a0b49a] mb-8"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Space / ↑ key or tap to jump
                </p>
                <button
                  onClick={handleStart}
                  className="group relative overflow-hidden bg-[#1a2e1a] text-[#f8f5ef] px-10 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span className="relative z-10">Start Game</span>
                  <div className="absolute inset-0 bg-[#5a7a4e] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </motion.div>
            )}

            {/* ── Playing ── */}
            {gameState === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <GameCanvas key={gameKey} onGameEnd={handleGameEnd} />
                <p
                  className="text-center text-[10px] text-[#a0b49a] py-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Space / ↑ / Tap to jump · 3 lives · Collect {15} ingredients to win
                </p>
              </motion.div>
            )}

            {/* ── Finished ── */}
            {gameState === 'finished' && product && result && (
              <motion.div
                key="finished"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ResultOverlay
                  won={result.won}
                  score={result.score}
                  product={product}
                  onPlayAgain={handleStart}
                  onOrder={scrollToCTA}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
