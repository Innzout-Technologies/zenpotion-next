'use client';

import { useRef, useCallback, useEffect } from 'react';

/**
 * Drives a game tick function at ~60fps using requestAnimationFrame.
 * Uses a ref to always call the latest tick without restarting the loop.
 * When `active` becomes false, the loop is cancelled. Component unmount also cancels.
 */
export function useGameLoop(tick: (deltaTime: number) => void, active: boolean) {
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const tickRef = useRef(tick);

  // Always point to the latest tick without recreating the loop
  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const loop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    // Cap delta at 50ms to prevent spiral of death on tab switch / blur
    const deltaTime = Math.min(timestamp - lastTimeRef.current, 50);
    lastTimeRef.current = timestamp;
    tickRef.current(deltaTime);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, loop]);
}
