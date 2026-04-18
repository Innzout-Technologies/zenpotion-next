export interface PlayerState {
  x: number;
  vx: number;     // horizontal velocity — non-zero during jump arc
  baseX: number;  // resting position; player returns here when grounded
  y: number;
  width: number;
  height: number;
  vy: number;
  isGrounded: boolean;
  lives: number;
  isHurt: boolean;
  hurtTimer: number;
}

export function createPlayer(groundY: number): PlayerState {
  const width = 26;   // capsule width
  const height = 50;  // capsule height (≈1:1.9 ratio — pill proportions)
  const baseX = 72;
  return {
    x: baseX,
    vx: 0,
    baseX,
    y: groundY - height,
    width,
    height,
    vy: 0,
    isGrounded: true,
    lives: 3,
    isHurt: false,
    hurtTimer: 0,
  };
}
