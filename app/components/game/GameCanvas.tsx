'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { createPlayer } from './Player';
import type { PlayerState } from './Player';
import {
  GRAVITY_RISE, GRAVITY_HOLD, GRAVITY_FALL, TERMINAL_VELOCITY,
  JUMP_FORCE, JUMP_VX, PLAYER_MAX_FORWARD, RETURN_SPEED,
  JUMP_BUFFER_FRAMES, HURT_FRAMES,
  GINGER_POWER_FRAMES, GINGER_JUICE_BONUS, INGREDIENTS_TO_WIN,
  getSpeedForScore, getObstacleGap, getIngredientGap,
} from './Physics';
import { createObstacle, updateObstacles } from './Obstacles';
import type { Obstacle } from './Obstacles';
import { createIngredient, updateIngredients } from './Ingredients';
import type { Ingredient, IngredientType } from './Ingredients';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useCollision } from '../../hooks/useCollision';
import { calcJuiceMeter } from '../../utils/gameHelpers';
import GameHUD from './GameHUD';

const CANVAS_W = 800;
const CANVAS_H = 300;
const GROUND_Y  = CANVAS_H - 55;
const WARN_DIST = 210;

// ─── Particle system ──────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string; size: number;
}

function burst(list: Particle[], x: number, y: number, color: string, count = 8, speed = 2.5) {
  for (let i = 0; i < count; i++) {
    const a = (Math.PI * 2 / count) * i + Math.random() * 0.4;
    const s = speed * (0.6 + Math.random() * 0.8);
    list.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s - 1.2,
      life: 20 + Math.random()*14, maxLife: 34, color, size: 2.5+Math.random()*3 });
  }
}

function dust(list: Particle[], x: number, y: number) {
  list.push({ x: x+Math.random()*8-4, y, vx: -0.3-Math.random()*0.7, vy: -Math.random()*0.6,
    life: 10+Math.random()*7, maxLife: 17, color: '#b8d9b2', size: 1.5+Math.random()*2 });
}

function hitBurst(list: Particle[], x: number, y: number) {
  burst(list, x, y, '#ef4444', 6, 3);
  burst(list, x, y, '#fbbf24', 4, 2);
}

function gingerBurst(list: Particle[], x: number, y: number) {
  burst(list, x, y, '#fbbf24', 12, 4);
  burst(list, x, y, '#f59e0b', 8, 2.5);
}

function drinkBurst(list: Particle[], x: number, y: number) {
  burst(list, x, y, '#22c55e', 18, 5.5);
  burst(list, x, y, '#86efac', 12, 3.5);
  burst(list, x, y, '#ffffff', 8,  4.5);
}

const ING_COLORS: Record<IngredientType, string> = {
  orange: '#f97316', lemon: '#eab308', ginger: '#f59e0b',
  amla: '#22c55e', beetroot: '#be185d',
};

// ─── Plenish-style shot bottle drawing ───────────────────────────────────────
/**
 * Wide white ribbed cap → very short neck → quick shoulder → squat body.
 * Matches Plenish 60ml shot bottle proportions.
 */
function drawBottle(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  w: number, h: number,
  tilt: number,
  sx: number, sy: number,
  powered: boolean, frame: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.scale(sx, sy);

  const hw = w / 2;
  const hh = h / 2;

  // Plenish proportions: dominant cap, minimal neck, squat body
  const capH      = h * 0.30;  // large ribbed cap
  const neckH     = h * 0.10;  // very short neck
  const shoulderH = h * 0.14;  // quick outward taper

  const hCapW  = hw * 0.95;  // cap nearly full visual width
  const hNeckW = hw * 0.60;  // neck ~60% of half-width

  const topY            = -hh;
  const capBottomY      = topY + capH;
  const neckBottomY     = capBottomY + neckH;
  const shoulderBottomY = neckBottomY + shoulderH;
  const bodyBottomY     = hh;

  // Ginger aura
  if (powered) {
    const pulse = 22 + Math.sin(frame * 0.22) * 6;
    const aura = ctx.createRadialGradient(0, 0, 6, 0, 0, pulse);
    aura.addColorStop(0, 'rgba(251,191,36,0.60)');
    aura.addColorStop(1, 'rgba(251,191,36,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Body + shoulder ───────────────────────────────────────────────────────
  function bottleBody() {
    ctx.beginPath();
    ctx.moveTo(-hNeckW, neckBottomY);
    ctx.bezierCurveTo(
      -hNeckW, neckBottomY + shoulderH * 0.6,
      -hw,     neckBottomY + shoulderH * 0.9,
      -hw,     shoulderBottomY
    );
    ctx.lineTo(-hw, bodyBottomY - 2.5);
    ctx.arcTo(-hw, bodyBottomY, -hw + 2.5, bodyBottomY, 2.5);
    ctx.lineTo(hw - 2.5, bodyBottomY);
    ctx.arcTo(hw, bodyBottomY, hw, bodyBottomY - 2.5, 2.5);
    ctx.lineTo(hw, shoulderBottomY);
    ctx.bezierCurveTo(
      hw,     neckBottomY + shoulderH * 0.9,
      hNeckW, neckBottomY + shoulderH * 0.6,
      hNeckW, neckBottomY
    );
    ctx.closePath();
  }

  bottleBody();
  const bodyGrad = ctx.createLinearGradient(-hw, shoulderBottomY, hw * 0.5, bodyBottomY);
  if (powered) {
    bodyGrad.addColorStop(0,   '#fef9e7');
    bodyGrad.addColorStop(0.4, '#fcd34d');
    bodyGrad.addColorStop(1,   '#b45309');
  } else {
    bodyGrad.addColorStop(0,    '#e8f5e4');
    bodyGrad.addColorStop(0.35, '#a8d5a2');
    bodyGrad.addColorStop(0.80, '#5a7a4e');
    bodyGrad.addColorStop(1,    '#3a5a3a');
  }
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Body left gloss strip
  ctx.save();
  bottleBody();
  ctx.clip();
  ctx.globalAlpha = 0.20;
  const gloss = ctx.createLinearGradient(-hw, shoulderBottomY, 0, bodyBottomY);
  gloss.addColorStop(0, '#ffffff');
  gloss.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gloss;
  ctx.fillRect(-hw, neckBottomY, hw * 0.50, h);
  ctx.restore();

  // ── Neck (clear plastic — juice color shows through) ──────────────────────
  const neckGrad = ctx.createLinearGradient(-hNeckW, 0, hNeckW, 0);
  if (powered) {
    neckGrad.addColorStop(0, '#c97a06'); neckGrad.addColorStop(0.5, '#fde68a'); neckGrad.addColorStop(1, '#c97a06');
  } else {
    neckGrad.addColorStop(0, '#4a6a42'); neckGrad.addColorStop(0.5, '#8fc98a'); neckGrad.addColorStop(1, '#4a6a42');
  }
  ctx.fillStyle = neckGrad;
  ctx.fillRect(-hNeckW, capBottomY, hNeckW * 2, neckH + 1);

  // ── Label ─────────────────────────────────────────────────────────────────
  const lblCY = (shoulderBottomY + bodyBottomY) / 2;
  const lblH  = (bodyBottomY - shoulderBottomY) * 0.62;
  ctx.fillStyle = 'rgba(255,255,255,0.90)';
  ctx.fillRect(-hw + 1.5, lblCY - lblH / 2, (hw - 1.5) * 2, lblH);

  ctx.fillStyle = powered ? '#92400e' : '#1a2e1a';
  ctx.font = `bold ${Math.round(w * 0.40)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ZP', 0, lblCY - lblH * 0.18);

  ctx.fillStyle = powered ? '#b45309' : '#5a7a4e';
  ctx.font = `${Math.round(w * 0.21)}px sans-serif`;
  ctx.fillText('60ml', 0, lblCY + lblH * 0.30);

  // ── Wide ribbed plastic cap ────────────────────────────────────────────────
  const cr = 2.5;
  // Base fill
  ctx.fillStyle = powered ? '#fef3c7' : '#f0eeec';
  ctx.beginPath();
  ctx.moveTo(-hCapW + cr, topY);
  ctx.arcTo(hCapW, topY, hCapW, topY + cr, cr);
  ctx.lineTo(hCapW, capBottomY);
  ctx.lineTo(-hCapW, capBottomY);
  ctx.lineTo(-hCapW, topY + cr);
  ctx.arcTo(-hCapW, topY, -hCapW + cr, topY, cr);
  ctx.closePath();
  ctx.fill();

  // Cap gradient overlay (top-bright, bottom-shadow for 3D dome effect)
  const capGrad = ctx.createLinearGradient(0, topY, 0, capBottomY);
  if (powered) {
    capGrad.addColorStop(0,   'rgba(255,253,230,0.9)');
    capGrad.addColorStop(0.6, 'rgba(251,191,36,0.15)');
    capGrad.addColorStop(1,   'rgba(120,53,15,0.25)');
  } else {
    capGrad.addColorStop(0,   'rgba(255,255,255,0.88)');
    capGrad.addColorStop(0.5, 'rgba(220,218,214,0.1)');
    capGrad.addColorStop(1,   'rgba(140,136,130,0.30)');
  }
  ctx.fillStyle = capGrad;
  ctx.beginPath();
  ctx.moveTo(-hCapW + cr, topY);
  ctx.arcTo(hCapW, topY, hCapW, topY + cr, cr);
  ctx.lineTo(hCapW, capBottomY);
  ctx.lineTo(-hCapW, capBottomY);
  ctx.lineTo(-hCapW, topY + cr);
  ctx.arcTo(-hCapW, topY, -hCapW + cr, topY, cr);
  ctx.closePath();
  ctx.fill();

  // Horizontal rib lines
  ctx.strokeStyle = powered ? 'rgba(160,110,10,0.18)' : 'rgba(0,0,0,0.07)';
  ctx.lineWidth = 0.6;
  for (let i = 1; i <= 3; i++) {
    const ry = topY + capH * (i / 4);
    ctx.beginPath();
    ctx.moveTo(-hCapW + 1, ry);
    ctx.lineTo(hCapW - 1, ry);
    ctx.stroke();
  }

  // Cap-to-neck seam (thin dark ring)
  ctx.fillStyle = powered ? 'rgba(120,53,15,0.35)' : 'rgba(0,0,0,0.14)';
  ctx.fillRect(-hCapW, capBottomY - 1, hCapW * 2, 1.8);

  ctx.restore();
}

// ─── Arc predictor ────────────────────────────────────────────────────────────
function simulateArc(y: number, vy: number, vx: number, held: boolean, steps: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const groundTarget = GROUND_Y - 50;
  let sx = 0;
  let sy = y, svy = vy, svx = vx;
  for (let i = 0; i < steps; i++) {
    const rising = svy < 0;
    const g = rising && held ? GRAVITY_HOLD : rising ? GRAVITY_RISE : GRAVITY_FALL;
    svy = Math.min(svy + g, TERMINAL_VELOCITY);
    sy += svy;
    sx += svx;
    svx *= 0.97;
    if (sy >= groundTarget) { pts.push({ x: sx, y: groundTarget }); break; }
    pts.push({ x: sx, y: sy });
  }
  return pts;
}

// ─── Component ────────────────────────────────────────────────────────────────
interface GameCanvasProps {
  onGameEnd: (score: number, collected: Record<IngredientType, number>, won: boolean, drinks: number) => void;
}

const EMPTY_COLLECTED: Record<IngredientType, number> = {
  orange: 0, lemon: 0, ginger: 0, amla: 0, beetroot: 0,
};

export default function GameCanvas({ onGameEnd }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const playerRef         = useRef<PlayerState>(createPlayer(GROUND_Y));
  const obstaclesRef      = useRef<Obstacle[]>([]);
  const ingredientsRef    = useRef<Ingredient[]>([]);
  const particlesRef      = useRef<Particle[]>([]);
  const speedRef          = useRef(1.8);
  const frameRef          = useRef(0);
  const scoreRef          = useRef(0);
  const collectedRef      = useRef<Record<IngredientType, number>>({ ...EMPTY_COLLECTED });
  const totalRef          = useRef(0);       // juice-meter fills in current round
  const drinksRef         = useRef(0);       // completed drink cycles
  const activeRef         = useRef(true);

  // Input
  const jumpHeldRef   = useRef(false);
  const jumpBufferRef = useRef(0);

  // Visual FX
  const shakeRef      = useRef(0);
  const squashRef     = useRef(1.0);
  const squashVelRef  = useRef(0.0);

  // Power timers
  const gingerTimerRef = useRef(0);
  const gingerFlashRef = useRef(0);
  const drinkFlashRef  = useRef(0);

  // Spawning
  const distObstRef = useRef(getObstacleGap(0));
  const distIngRef  = useRef(getIngredientGap(0));

  // Clouds
  const cloudsRef = useRef([
    { x: 70,  y: 26, w: 65, spd: 0.18 },
    { x: 260, y: 44, w: 50, spd: 0.23 },
    { x: 450, y: 20, w: 72, spd: 0.14 },
    { x: 640, y: 50, w: 48, spd: 0.26 },
    { x: 760, y: 34, w: 58, spd: 0.20 },
  ]);

  const hudTickRef = useRef(0);
  const [hudData, setHudData] = useState({
    score: 0, lives: 3, juiceMeter: 0, gingerTimer: 0,
    collected: { ...EMPTY_COLLECTED }, drinks: 0,
  });

  const { checkAABB, shrinkRect } = useCollision();

  // ── Input ────────────────────────────────────────────────────────────────────
  const triggerJump = useCallback(() => { jumpBufferRef.current = JUMP_BUFFER_FRAMES; }, []);

  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'ArrowUp') return;
      e.preventDefault(); jumpHeldRef.current = true;
      if (!e.repeat) triggerJump();
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') jumpHeldRef.current = false;
    };
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, [triggerJump]);

  // ── Tick ─────────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !activeRef.current) return;

    frameRef.current++;
    const frame = frameRef.current;

    // Time-based score drives difficulty; drink bonuses added for display only
    const timeScore = Math.floor(frame / 6);
    scoreRef.current = timeScore + drinksRef.current * 500;

    speedRef.current = getSpeedForScore(timeScore);
    const speed = speedRef.current;

    // Tick timers
    if (gingerTimerRef.current > 0) gingerTimerRef.current--;
    if (gingerFlashRef.current > 0) gingerFlashRef.current--;
    if (drinkFlashRef.current  > 0) drinkFlashRef.current--;
    const isPowered = gingerTimerRef.current > 0;

    // ── Player ────────────────────────────────────────────────────────────────
    let p = playerRef.current;
    const wasGrounded = p.isGrounded;

    if (jumpBufferRef.current > 0 && p.isGrounded) {
      jumpBufferRef.current = 0;
      squashVelRef.current = 0.26;
      p = { ...p, vy: JUMP_FORCE, vx: JUMP_VX, isGrounded: false };
    }
    jumpBufferRef.current = Math.max(0, jumpBufferRef.current - 1);

    const rising = p.vy < 0;
    const g = rising && jumpHeldRef.current ? GRAVITY_HOLD : rising ? GRAVITY_RISE : GRAVITY_FALL;
    const newVy = Math.min(p.vy + g, TERMINAL_VELOCITY);

    const groundTarget = GROUND_Y - p.height;
    let newY = p.y + newVy;
    let finalVy = newVy;
    let grounded = false;

    if (newY >= groundTarget) {
      newY = groundTarget;
      finalVy = 0;
      grounded = true;
      if (!wasGrounded) squashVelRef.current = -(Math.abs(p.vy) * 0.030 + 0.15);
    }

    let newX = p.x;
    let newVx = p.vx;
    if (!grounded) {
      newX = Math.min(p.x + p.vx, p.baseX + PLAYER_MAX_FORWARD);
      newVx = p.vx * 0.97;
    } else {
      if (p.x > p.baseX) newX = Math.max(p.baseX, p.x - RETURN_SPEED);
      newVx = 0;
    }

    const newHurtTimer = Math.max(0, p.hurtTimer - 1);
    p = { ...p, x: newX, vx: newVx, y: newY, vy: finalVy,
          isGrounded: grounded, hurtTimer: newHurtTimer, isHurt: newHurtTimer > 0 };
    playerRef.current = p;

    squashVelRef.current += (1 - squashRef.current) * 0.28;
    squashRef.current    += squashVelRef.current;
    squashVelRef.current *= 0.68;
    squashRef.current = Math.max(0.65, Math.min(1.38, squashRef.current));

    // ── Spawn ─────────────────────────────────────────────────────────────────
    distObstRef.current -= speed;
    distIngRef.current  -= speed;
    if (distObstRef.current <= 0) {
      obstaclesRef.current = [...obstaclesRef.current, createObstacle(CANVAS_W, GROUND_Y)];
      distObstRef.current = getObstacleGap(timeScore);
    }
    if (distIngRef.current <= 0) {
      ingredientsRef.current = [...ingredientsRef.current, createIngredient(CANVAS_W, GROUND_Y)];
      distIngRef.current = getIngredientGap(timeScore);
    }

    // ── Move ──────────────────────────────────────────────────────────────────
    obstaclesRef.current   = updateObstacles(obstaclesRef.current, speed);
    ingredientsRef.current = updateIngredients(ingredientsRef.current, speed);

    // ── Collision ─────────────────────────────────────────────────────────────
    const playerHitbox = shrinkRect(p, isPowered ? 7 : 5);

    if (!p.isHurt) {
      for (const obs of obstaclesRef.current) {
        if (checkAABB(playerHitbox, shrinkRect(obs, 6))) {
          const newLives = p.lives - 1;
          playerRef.current = { ...playerRef.current, lives: newLives, isHurt: true, hurtTimer: HURT_FRAMES };
          obstaclesRef.current = obstaclesRef.current.filter(o => o.id !== obs.id);
          shakeRef.current = 8;
          hitBurst(particlesRef.current, p.x + p.width / 2, p.y + p.height / 2);
          if (newLives <= 0) {
            activeRef.current = false;
            onGameEnd(
              scoreRef.current,
              { ...collectedRef.current },
              drinksRef.current > 0,   // won = completed at least one drink
              drinksRef.current,
            );
            return;
          }
          break;
        }
      }
    }

    const nextIng: Ingredient[] = [];
    for (const ing of ingredientsRef.current) {
      if (!ing.collected && checkAABB(playerHitbox, ing)) {
        collectedRef.current = {
          ...collectedRef.current,
          [ing.type]: collectedRef.current[ing.type] + 1,
        };

        if (ing.isSuper) {
          gingerTimerRef.current = GINGER_POWER_FRAMES;
          gingerFlashRef.current = 70;
          gingerBurst(particlesRef.current, p.x + p.width / 2, p.y + p.height / 2);
          totalRef.current += 1 + GINGER_JUICE_BONUS;
          shakeRef.current = 3;
        } else {
          burst(particlesRef.current, ing.x + ing.width / 2, ing.y + ing.height / 2, ING_COLORS[ing.type]);
          totalRef.current++;
        }

        // Drink complete — reset meter and continue playing
        if (totalRef.current >= INGREDIENTS_TO_WIN) {
          drinksRef.current++;
          totalRef.current = 0;
          collectedRef.current = { ...EMPTY_COLLECTED };
          drinkFlashRef.current = 90;
          shakeRef.current = 6;
          drinkBurst(particlesRef.current, p.x + p.width / 2, p.y + p.height / 2);
        }
      } else {
        nextIng.push(ing);
      }
    }
    ingredientsRef.current = nextIng;

    // ── Particles ─────────────────────────────────────────────────────────────
    particlesRef.current = particlesRef.current
      .map(pt => ({ ...pt, x: pt.x+pt.vx, y: pt.y+pt.vy, vy: pt.vy+0.13, life: pt.life-1 }))
      .filter(pt => pt.life > 0);
    if (p.isGrounded && frame % 5 === 0) dust(particlesRef.current, p.x, GROUND_Y);

    // ── HUD ───────────────────────────────────────────────────────────────────
    if (++hudTickRef.current % 10 === 0) {
      setHudData({
        score:      scoreRef.current,
        lives:      playerRef.current.lives,
        juiceMeter: calcJuiceMeter(totalRef.current, INGREDIENTS_TO_WIN),
        gingerTimer: gingerTimerRef.current,
        collected:  { ...collectedRef.current },
        drinks:     drinksRef.current,
      });
    }

    // ╔═══════════════════════════════════════════════════════════════════════╗
    // ║  RENDER                                                               ║
    // ╚═══════════════════════════════════════════════════════════════════════╝
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    shakeRef.current *= 0.80;
    const ox = shakeRef.current > 0.5 ? (Math.random() - 0.5) * shakeRef.current : 0;
    const oy = shakeRef.current > 0.5 ? (Math.random() - 0.5) * shakeRef.current * 0.4 : 0;
    ctx.save();
    ctx.translate(ox, oy);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    if (isPowered) {
      sky.addColorStop(0, '#fef9c3');
      sky.addColorStop(0.6, '#fef3c7');
      sky.addColorStop(1, '#fffbeb');
    } else {
      sky.addColorStop(0, '#d9f0d6');
      sky.addColorStop(0.55, '#eef7eb');
      sky.addColorStop(1, '#f8f5ef');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Parallax clouds — three overlapping circles per cloud
    cloudsRef.current = cloudsRef.current.map(cloud => {
      const x = cloud.x - speed * cloud.spd;
      const r = cloud.w;
      ctx.fillStyle = isPowered ? 'rgba(255,251,235,0.80)' : 'rgba(255,255,255,0.74)';
      ctx.beginPath();
      ctx.arc(x,            cloud.y,     r,        0, Math.PI * 2);
      ctx.arc(x - r * 0.38, cloud.y + 5, r * 0.58, 0, Math.PI * 2);
      ctx.arc(x + r * 0.38, cloud.y + 4, r * 0.52, 0, Math.PI * 2);
      ctx.fill();
      return { ...cloud, x: x < -(r + 20) ? CANVAS_W + r + 20 : x };
    });

    // Ground
    ctx.fillStyle = isPowered ? '#d97706' : '#c5e0bf';
    ctx.fillRect(0, GROUND_Y, CANVAS_W, 3);
    ctx.fillStyle = isPowered ? '#fef3c7' : '#e8f5e4';
    ctx.fillRect(0, GROUND_Y + 3, CANVAS_W, CANVAS_H - GROUND_Y - 3);

    // Ground speed dashes
    ctx.fillStyle = isPowered ? '#fbbf24' : '#b2d4ac';
    for (let i = 0; i < 10; i++) {
      const dashX = ((frame * speed * 0.55) + i * 88) % (CANVAS_W + 80) - 40;
      ctx.fillRect(dashX, GROUND_Y + 9, 40 + (i % 3) * 14, 2);
    }

    // Obstacle warning glow
    for (const obs of obstaclesRef.current) {
      const dist = obs.x - (p.x + p.width);
      if (dist > 0 && dist < WARN_DIST) {
        const t = 1 - dist / WARN_DIST;
        const gx = obs.x + obs.width / 2;
        const gy = obs.y + obs.height / 2;
        const grd = ctx.createRadialGradient(gx, gy, 4, gx, gy, 38);
        grd.addColorStop(0, `rgba(251,146,60,${0.5 * t})`);
        grd.addColorStop(1, 'rgba(251,146,60,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(obs.x - 18, obs.y - 18, obs.width + 36, obs.height + 36);
      }
    }

    // Particles
    for (const pt of particlesRef.current) {
      const a = (pt.life / pt.maxLife) * 0.88;
      ctx.globalAlpha = a;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size * (pt.life / pt.maxLife), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Obstacles
    ctx.font = '30px serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    for (const obs of obstaclesRef.current) {
      ctx.fillText(obs.emoji, obs.x, obs.y + obs.height / 2);
    }

    // Ingredients — bob + pulse, ginger gets a halo
    for (const ing of ingredientsRef.current) {
      const bob = Math.sin(frame * 0.07 + ing.id * 1.1) * 5;
      const pulse = ing.isSuper
        ? 1 + Math.sin(frame * 0.14) * 0.14
        : 1 + Math.sin(frame * 0.10 + ing.id * 0.8) * 0.06;

      if (ing.isSuper) {
        const gx = ing.x + ing.width / 2;
        const gy = ing.y + ing.height / 2 + bob;
        const halo = ctx.createRadialGradient(gx, gy, 6, gx, gy, 26);
        halo.addColorStop(0, 'rgba(251,191,36,0.55)');
        halo.addColorStop(1, 'rgba(251,191,36,0)');
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(gx, gy, 26, 0, Math.PI * 2); ctx.fill();
      }

      ctx.save();
      ctx.translate(ing.x + ing.width / 2, ing.y + ing.height / 2 + bob);
      ctx.scale(pulse, pulse);
      ctx.font = ing.isSuper ? '32px serif' : '26px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ing.emoji, 0, 0);
      ctx.restore();
    }

    // Landing shadow + arc trajectory
    if (!p.isGrounded) {
      const heightAbove = GROUND_Y - (p.y + p.height);
      const prox = Math.max(0, 1 - heightAbove / 120);
      ctx.save();
      ctx.globalAlpha = 0.08 + prox * 0.18;
      ctx.fillStyle = '#1a2e1a';
      ctx.beginPath();
      ctx.ellipse(p.x + p.width / 2, GROUND_Y + 2, 14 + prox * 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const arcPts = simulateArc(p.y, p.vy, p.vx, jumpHeldRef.current, 45);
      ctx.fillStyle = isPowered ? '#d97706' : '#5a7a4e';
      const baseCX = p.x + p.width / 2;
      for (let i = 1; i < arcPts.length; i += 3) {
        ctx.globalAlpha = (1 - i / arcPts.length) * 0.30;
        ctx.beginPath();
        ctx.arc(baseCX + arcPts[i].x, arcPts[i].y + p.height / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // ── Shot bottle player ────────────────────────────────────────────────────
    const player = playerRef.current;
    const visible = !player.isHurt || Math.floor(frame / 4) % 2 === 0;
    if (visible) {
      const sq = squashRef.current;
      const tilt = player.isGrounded
        ? 0
        : Math.atan2(player.vy, (speed + player.vx) * 4) * 0.28;
      drawBottle(
        ctx,
        player.x + player.width / 2,
        player.y + player.height / 2,
        player.width,
        player.height,
        tilt,
        1 / Math.sqrt(sq),
        sq,
        isPowered,
        frame,
      );
    }

    // ── Ginger power flash ────────────────────────────────────────────────────
    if (gingerFlashRef.current > 0) {
      const t = gingerFlashRef.current;
      const alpha = Math.min(1, (70 - t) / 10, t / 10);
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.translate(CANVAS_W / 2, CANVAS_H / 2 - 30);
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 4;
      ctx.strokeText('⚡ GINGER POWER!', 0, 0);
      ctx.fillStyle = '#d97706';
      ctx.fillText('⚡ GINGER POWER!', 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    // ── Drink complete flash ──────────────────────────────────────────────────
    if (drinkFlashRef.current > 0) {
      const t = drinkFlashRef.current;
      const alpha = Math.min(1, (90 - t) / 12, t / 12);
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.translate(CANVAS_W / 2, CANVAS_H / 2 - 30);
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#dcfce7';
      ctx.lineWidth = 5;
      ctx.strokeText(`🍶 DRINK #${drinksRef.current} COMPLETE!  +500`, 0, 0);
      ctx.fillStyle = '#15803d';
      ctx.fillText(`🍶 DRINK #${drinksRef.current} COMPLETE!  +500`, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    ctx.restore(); // end shake transform
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
      <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H}
        className="w-full block" style={{ touchAction: 'none' }} />
      <GameHUD {...hudData} />
    </div>
  );
}
