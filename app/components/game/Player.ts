export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  isGrounded: boolean;
  lives: number;
  isHurt: boolean;
  hurtTimer: number; // frames remaining in hurt invincibility
}

export function createPlayer(groundY: number): PlayerState {
  const height = 52;
  return {
    x: 72,
    y: groundY - height,
    width: 40,
    height,
    vy: 0,
    isGrounded: true,
    lives: 3,
    isHurt: false,
    hurtTimer: 0,
  };
}
