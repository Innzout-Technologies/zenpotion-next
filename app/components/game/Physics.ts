// ─── Gravity ──────────────────────────────────────────────────────────────────

/** Gravity while ascending — light for floaty rise */
export const GRAVITY_RISE = 0.42;

/** Gravity while ascending AND jump key held — even lighter (variable jump height) */
export const GRAVITY_HOLD = 0.20;

/** Gravity while falling — heavy for snappy, satisfying landing */
export const GRAVITY_FALL = 0.88;

/** Terminal velocity — caps downward speed */
export const TERMINAL_VELOCITY = 16;

// ─── Jump ─────────────────────────────────────────────────────────────────────

/** Initial vertical velocity on jump */
export const JUMP_FORCE = -14;

/**
 * Frames a jump input is buffered.
 * If the player presses jump slightly before landing, the jump fires on touch-down.
 */
export const JUMP_BUFFER_FRAMES = 10;

/** Invincibility frames after an obstacle hit */
export const HURT_FRAMES = 75;

// ─── Speed stages ─────────────────────────────────────────────────────────────

/**
 * Score thresholds and their corresponding scroll speeds.
 * Speed jumps discretely at each milestone — no per-frame increment.
 * Player gets ~60 score/sec, so thresholds in seconds: 0, 1s, 3s, 6s, 10s, 15s, 22s, 30s
 */
export const SPEED_STAGES: [number, number][] = [
  [0,    2.0],
  [60,   2.5],
  [180,  3.0],
  [360,  3.6],
  [600,  4.2],
  [900,  5.0],
  [1300, 5.8],
  [1800, 6.5],
];

export function getSpeedForScore(score: number): number {
  let speed = SPEED_STAGES[0][1];
  for (const [threshold, s] of SPEED_STAGES) {
    if (score >= threshold) speed = s;
  }
  return speed;
}

// ─── Distance-based spawning ──────────────────────────────────────────────────

/**
 * Returns the pixel gap before the next obstacle spawns.
 * Gap shrinks as score grows but never below the minimum safe gap.
 * Distance-based (not frame-based) means gaps stay consistent as speed increases.
 */
export function getObstacleGap(score: number): number {
  const min = 250;
  const max = Math.max(min + 60, 450 - score * 0.12);
  return min + Math.random() * (max - min);
}

/**
 * Returns the pixel gap before the next ingredient spawns.
 */
export function getIngredientGap(score: number): number {
  const min = 160;
  const max = Math.max(min + 50, 300 - score * 0.06);
  return min + Math.random() * (max - min);
}

// ─── Win condition ────────────────────────────────────────────────────────────

export const INGREDIENTS_TO_WIN = 15;
