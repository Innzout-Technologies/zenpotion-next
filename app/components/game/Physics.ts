// ─── Gravity ──────────────────────────────────────────────────────────────────

export const GRAVITY_RISE = 0.62;   // ascending (no hold)
export const GRAVITY_HOLD = 0.40;   // ascending + jump held (variable height)
export const GRAVITY_FALL = 0.95;   // descending — firm, predictable landing
export const TERMINAL_VELOCITY = 12;

// ─── Jump ─────────────────────────────────────────────────────────────────────

/**
 * Vertical impulse. -11 gives:
 *   tap  → ~97 px peak,  ~32 frames air time
 *   hold → ~151 px peak, ~43 frames air time
 */
export const JUMP_FORCE = -11;

/**
 * Forward velocity applied on jump.
 * Creates a visible parabolic arc in screen space:
 * player drifts ~45 px rightward to the peak then slides back on landing.
 */
export const JUMP_VX = 1.5;

/** How far ahead of baseX the player can travel during a jump */
export const PLAYER_MAX_FORWARD = 50;

/** px/frame the player slides back to baseX while grounded */
export const RETURN_SPEED = 2.0;

export const JUMP_BUFFER_FRAMES = 12;
export const HURT_FRAMES = 80;

// ─── Ginger super-power ───────────────────────────────────────────────────────

/** Frames ginger power stays active */
export const GINGER_POWER_FRAMES = 100;

/** Additional juice-meter fills from one ginger (total collected = 1 + this) */
export const GINGER_JUICE_BONUS = 2;

// ─── Speed stages ─────────────────────────────────────────────────────────────

/**
 * Score-to-speed table. ~60 score/sec.
 * Stages are deliberately wide early so new players have 10+ seconds per level.
 */
export const SPEED_STAGES: [number, number][] = [
  [0,    1.8],
  [100,  2.2],
  [280,  2.6],
  [550,  3.1],
  [900,  3.6],
  [1400, 4.1],
  [2100, 4.7],
  [3000, 5.2],
];

export function getSpeedForScore(score: number): number {
  let speed = SPEED_STAGES[0][1];
  for (const [threshold, s] of SPEED_STAGES) {
    if (score >= threshold) speed = s;
  }
  return speed;
}

// ─── Spawning ─────────────────────────────────────────────────────────────────

/**
 * Obstacle pixel gap.
 * Minimum 360 px — at max speed 5.2 and 43-frame air time the player covers
 * 224 px during a held jump, leaving 136 px of clear ground (≈26 frames) on landing.
 * The extra 20 px accounts for the ~45 px rightward drift closing the gap.
 */
export function getObstacleGap(score: number): number {
  const min = 360;
  const max = Math.max(min + 90, 560 - score * 0.09);
  return min + Math.random() * (max - min);
}

export function getIngredientGap(score: number): number {
  const min = 120;
  const max = Math.max(min + 60, 270 - score * 0.05);
  return min + Math.random() * (max - min);
}

export const INGREDIENTS_TO_WIN = 15;
