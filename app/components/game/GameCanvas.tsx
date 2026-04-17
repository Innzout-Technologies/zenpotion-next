'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { createPlayer } from './Player';
import type { PlayerState } from './Player';
import {
  GRAVITY_RISE,
  GRAVITY_HOLD,
  GRAVITY_FALL,
  TERMINAL_VELOCITY,
  JUMP_FORCE,
  JUMP_BUFFER_FRAMES,
  HURT_FRAMES,
  INGREDIENTS_TO_WIN,
  getSpeedForScore,
  getObstacleGap,
  getIngredientGap,
} from './Physics';
import { createObstacle, updateObstacles } from './Obstacles';
import type { Obstacle } from './Obstacles';
import { createIngredient, updateIngredients } from './Ingredients';
import type { Ingredient, IngredientType } from './Ingredients';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useCollision } from '../../hooks/useCollision';
import { calcJuiceMeter } from '../../utils/gameHelpers';
import GameHUD from './GameHUD';

// ─── Canvas resolution ────────────────────────────────────────────────────────
const CANVAS_W = 800;
const CANVAS_H = 300;
const GROUND_Y = CANVAS_H - 55;

// ─── Particle system ──────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

function spawnPickupBurst(list: Particle[], x: number, y: number, color: string) {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i + Math.random() * 0.4;
    const spd = 1.5 + Math.random() * 2.5;
    list.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 1.5,
      life: 22 + Math.random() * 12,
      maxLife: 34,
      color,
      size: 3 + Math.random() * 3,
    });
  }
}

function spawnDust(list: Particle[], x: number, y: number) {
  list.push({
    x: x + Math.random() * 10 - 5,
    y,
    vx: -0.4 - Math.random() * 0.8,
    vy: -Math.random() * 0.7,
    life: 10 + Math.random() * 8,
    maxLife: 18,
    color: '#b8d9b2',
    size: 2 + Math.random() * 2,
  });
}

function spawnHitBurst(list: Particle[], x: number, y: number) {
  for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = 1.5 + Math.random() * 3;
    list.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 2,
      life: 20 + Math.random() * 15,
      maxLife: 35,
      color: i % 2 === 0 ? '#ef4444' : '#fbbf24',
      size: 2.5 + Math.random() * 3,
    });
  }
}

const INGREDIENT_COLORS: Record<IngredientType, string> = {
  orange: '#f97316',
  ginger: '#22c55e',
  amla:   '#16a34a',
};

// ─── Component ────────────────────────────────────────────────────────────────
interface GameCanvasProps {
  onGameEnd: (score: number, collected: Record<IngredientType, number>, won: boolean) => void;
}

export default function GameCanvas({ onGameEnd }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // All mutable game state in refs — never trigger re-renders
  const playerRef         = useRef<PlayerState>(createPlayer(GROUND_Y));
  const obstaclesRef      = useRef<Obstacle[]>([]);
  const ingredientsRef    = useRef<Ingredient[]>([]);
  const particlesRef      = useRef<Particle[]>([]);
  const speedRef          = useRef(2.0);
  const frameRef          = useRef(0);
  const scoreRef          = useRef(0);
  const collectedRef      = useRef<Record<IngredientType, number>>({ orange: 0, ginger: 0, amla: 0 });
  const totalCollectedRef = useRef(0);
  const activeRef         = useRef(true);

  // Input state
  const jumpHeldRef    = useRef(false);
  const jumpBufferRef  = useRef(0); // frames of buffered jump remaining

  // Visual FX
  const shakeRef       = useRef(0);    // current screen shake magnitude
  const squashRef      = useRef(1.0);  // y-scale spring value (1 = normal)
  const squashVelRef   = useRef(0.0);  // spring velocity

  // Distance-based spawn counters (count down by `speed` each frame)
  const distToObstRef  = useRef(getObstacleGap(0));
  const distToIngRef   = useRef(getIngredientGap(0));

  // Cloud layers for parallax (each has independent speed)
  const cloudsRef = useRef([
    { x: 70,  y: 26, w: 65, spd: 0.18 },
    { x: 260, y: 44, w: 50, spd: 0.23 },
    { x: 450, y: 20, w: 72, spd: 0.14 },
    { x: 640, y: 50, w: 48, spd: 0.26 },
    { x: 760, y: 34, w: 58, spd: 0.20 },
  ]);

  const hudTickRef = useRef(0);

  const [hudData, setHudData] = useState({
    score: 0,
    lives: 3,
    juiceMeter: 0,
    collected: { orange: 0, ginger: 0, amla: 0 } as Record<IngredientType, number>,
  });

  const { checkAABB, shrinkRect } = useCollision();

  // ── Input handlers ──────────────────────────────────────────────────────────
  const triggerJump = useCallback(() => {
    jumpBufferRef.current = JUMP_BUFFER_FRAMES;
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'ArrowUp') return;
      e.preventDefault();
      jumpHeldRef.current = true;
      if (!e.repeat) triggerJump();
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') jumpHeldRef.current = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [triggerJump]);

  // ── Main tick ───────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !activeRef.current) return;

    frameRef.current++;
    const frame = frameRef.current;
    scoreRef.current = Math.floor(frame / 6);
    const score = scoreRef.current;

    speedRef.current = getSpeedForScore(score);
    const speed = speedRef.current;

    // ── Player: jump buffer execution ────────────────────────────────────────
    let p = playerRef.current;
    const wasGrounded = p.isGrounded;

    if (jumpBufferRef.current > 0 && p.isGrounded) {
      jumpBufferRef.current = 0;
      squashVelRef.current = 0.28; // upward stretch on takeoff
      p = { ...p, vy: JUMP_FORCE, isGrounded: false };
    }
    jumpBufferRef.current = Math.max(0, jumpBufferRef.current - 1);

    // ── Player: asymmetric gravity ────────────────────────────────────────────
    const rising = p.vy < 0;
    const gravity = rising && jumpHeldRef.current
      ? GRAVITY_HOLD   // floaty — jump key held during ascent
      : rising
      ? GRAVITY_RISE   // normal rise
      : GRAVITY_FALL;  // fast fall

    const newVy = Math.min(p.vy + gravity, TERMINAL_VELOCITY);
    let newY = p.y + newVy;
    let finalVy = newVy;
    let grounded = false;

    const groundTarget = GROUND_Y - p.height;
    if (newY >= groundTarget) {
      newY = groundTarget;
      finalVy = 0;
      grounded = true;
      // Landing: inject squash proportional to impact velocity
      if (!wasGrounded) {
        squashVelRef.current = -(Math.abs(p.vy) * 0.028 + 0.18);
      }
    }

    const newHurtTimer = Math.max(0, p.hurtTimer - 1);
    p = { ...p, y: newY, vy: finalVy, isGrounded: grounded, hurtTimer: newHurtTimer, isHurt: newHurtTimer > 0 };
    playerRef.current = p;

    // ── Squash/stretch spring ─────────────────────────────────────────────────
    // Spring: F = stiffness * (target - current); damping prevents oscillation
    squashVelRef.current += (1 - squashRef.current) * 0.28;
    squashRef.current    += squashVelRef.current;
    squashVelRef.current *= 0.68;
    squashRef.current = Math.max(0.62, Math.min(1.42, squashRef.current));

    // ── Distance-based entity spawning ────────────────────────────────────────
    distToObstRef.current -= speed;
    distToIngRef.current  -= speed;

    if (distToObstRef.current <= 0) {
      obstaclesRef.current = [...obstaclesRef.current, createObstacle(CANVAS_W, GROUND_Y)];
      distToObstRef.current = getObstacleGap(score);
    }
    if (distToIngRef.current <= 0) {
      ingredientsRef.current = [...ingredientsRef.current, createIngredient(CANVAS_W, GROUND_Y)];
      distToIngRef.current = getIngredientGap(score);
    }

    // ── Move entities ─────────────────────────────────────────────────────────
    obstaclesRef.current   = updateObstacles(obstaclesRef.current, speed);
    ingredientsRef.current = updateIngredients(ingredientsRef.current, speed);

    // ── Collision ─────────────────────────────────────────────────────────────
    const hitbox = shrinkRect(p, 9);

    if (!p.isHurt) {
      for (const obs of obstaclesRef.current) {
        if (checkAABB(hitbox, obs)) {
          const newLives = p.lives - 1;
          playerRef.current = { ...playerRef.current, lives: newLives, isHurt: true, hurtTimer: HURT_FRAMES };
          obstaclesRef.current = obstaclesRef.current.filter(o => o.id !== obs.id);
          shakeRef.current = 10;
          spawnHitBurst(particlesRef.current, p.x + p.width / 2, p.y + p.height / 2);
          if (newLives <= 0) {
            activeRef.current = false;
            onGameEnd(scoreRef.current, { ...collectedRef.current }, false);
            return;
          }
          break;
        }
      }
    }

    const nextIngredients: Ingredient[] = [];
    for (const ing of ingredientsRef.current) {
      if (!ing.collected && checkAABB(hitbox, ing)) {
        collectedRef.current = {
          ...collectedRef.current,
          [ing.type]: collectedRef.current[ing.type] + 1,
        };
        totalCollectedRef.current++;
        spawnPickupBurst(particlesRef.current, ing.x + ing.width / 2, ing.y + ing.height / 2, INGREDIENT_COLORS[ing.type]);
        if (totalCollectedRef.current >= INGREDIENTS_TO_WIN) {
          activeRef.current = false;
          onGameEnd(scoreRef.current, { ...collectedRef.current }, true);
          return;
        }
      } else {
        nextIngredients.push(ing);
      }
    }
    ingredientsRef.current = nextIngredients;

    // ── Update particles ──────────────────────────────────────────────────────
    particlesRef.current = particlesRef.current
      .map(pt => ({ ...pt, x: pt.x + pt.vx, y: pt.y + pt.vy, vy: pt.vy + 0.14, life: pt.life - 1 }))
      .filter(pt => pt.life > 0);

    // Running dust (every 5 frames while grounded)
    if (p.isGrounded && frame % 5 === 0) {
      spawnDust(particlesRef.current, p.x, GROUND_Y);
    }

    // ── HUD update (throttled to every 10 frames) ─────────────────────────────
    hudTickRef.current++;
    if (hudTickRef.current % 10 === 0) {
      setHudData({
        score: scoreRef.current,
        lives: playerRef.current.lives,
        juiceMeter: calcJuiceMeter(totalCollectedRef.current, INGREDIENTS_TO_WIN),
        collected: { ...collectedRef.current },
      });
    }

    // ╔═══════════════════════════════════════════════════════════════════════╗
    // ║  RENDER                                                               ║
    // ╚═══════════════════════════════════════════════════════════════════════╝
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Screen shake — decay and apply as translate offset
    shakeRef.current *= 0.82;
    const ox = shakeRef.current > 0.5 ? (Math.random() - 0.5) * shakeRef.current : 0;
    const oy = shakeRef.current > 0.5 ? (Math.random() - 0.5) * shakeRef.current * 0.4 : 0;

    ctx.save();
    ctx.translate(ox, oy);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    sky.addColorStop(0, '#d9f0d6');
    sky.addColorStop(0.55, '#eef7eb');
    sky.addColorStop(1, '#f8f5ef');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Parallax clouds — each layer moves at its own speed
    cloudsRef.current = cloudsRef.current.map(cloud => {
      const x = cloud.x - speed * cloud.spd;
      const r = cloud.w;
      ctx.fillStyle = 'rgba(255,255,255,0.74)';
      ctx.beginPath();
      ctx.ellipse(x,                cloud.y,     r,           r * 0.30, 0, 0, Math.PI * 2);
      ctx.ellipse(x - r * 0.38,     cloud.y + 5, r * 0.58,    r * 0.22, 0, 0, Math.PI * 2);
      ctx.ellipse(x + r * 0.38,     cloud.y + 4, r * 0.52,    r * 0.20, 0, 0, Math.PI * 2);
      ctx.fill();
      return { ...cloud, x: x < -(r + 20) ? CANVAS_W + r + 20 : x };
    });

    // Ground
    ctx.fillStyle = '#c5e0bf';
    ctx.fillRect(0, GROUND_Y, CANVAS_W, 3);
    ctx.fillStyle = '#e8f5e4';
    ctx.fillRect(0, GROUND_Y + 3, CANVAS_W, CANVAS_H - GROUND_Y - 3);

    // Ground speed-lines (parallax dashes that show how fast the world moves)
    ctx.fillStyle = '#b2d4ac';
    for (let i = 0; i < 10; i++) {
      const dashX = ((frame * speed * 0.55) + i * 88) % (CANVAS_W + 80) - 40;
      ctx.fillRect(dashX, GROUND_Y + 9, 40 + (i % 3) * 14, 2);
    }

    // ── Particles (behind entities) ───────────────────────────────────────────
    for (const pt of particlesRef.current) {
      const alpha = (pt.life / pt.maxLife) * 0.88;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size * (pt.life / pt.maxLife), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Obstacles ─────────────────────────────────────────────────────────────
    ctx.font = '30px serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    for (const obs of obstaclesRef.current) {
      ctx.fillText(obs.emoji, obs.x, obs.y + obs.height / 2);
    }

    // ── Ingredients — bob + scale pulse ───────────────────────────────────────
    for (const ing of ingredientsRef.current) {
      const bob = Math.sin(frame * 0.07 + ing.id * 1.1) * 5;
      const pulse = 1 + Math.sin(frame * 0.1 + ing.id * 0.8) * 0.06;
      const cx = ing.x + ing.width / 2;
      const cy = ing.y + ing.height / 2 + bob;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(pulse, pulse);
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ing.emoji, 0, 0);
      ctx.restore();
    }

    // ── Player — squash/stretch spring + hurt flicker ─────────────────────────
    const player = playerRef.current;
    const visible = !player.isHurt || Math.floor(frame / 4) % 2 === 0;
    if (visible) {
      const sq = squashRef.current;
      // Volume-preserving: wider when squashed, narrower when stretched
      const scaleX = 1 / Math.sqrt(sq);
      const scaleY = sq;
      const cx = player.x + player.width / 2;
      const cy = player.y + player.height / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scaleX, scaleY);
      ctx.font = '36px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧃', 0, 0);
      ctx.restore();
    }

    ctx.restore(); // end screen shake transform
  }, [checkAABB, shrinkRect, onGameEnd]);

  useGameLoop(tick, true);

  return (
    <div
      className="relative w-full select-none"
      onTouchStart={(e) => { e.preventDefault(); jumpHeldRef.current = true; triggerJump(); }}
      onTouchEnd={() => { jumpHeldRef.current = false; }}
      onMouseDown={() => { jumpHeldRef.current = true; triggerJump(); }}
      onMouseUp={() => { jumpHeldRef.current = false; }}
      style={{ cursor: 'pointer' }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full block"
        style={{ touchAction: 'none' }}
      />
      <GameHUD {...hudData} />
    </div>
  );
}
