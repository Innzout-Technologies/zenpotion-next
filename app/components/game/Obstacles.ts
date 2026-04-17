export type ObstacleType = 'sugar' | 'junk' | 'soda';

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  emoji: string;
  label: string;
}

interface ObstacleConfig {
  emoji: string;
  label: string;
  width: number;
  height: number;
}

const CONFIGS: Record<ObstacleType, ObstacleConfig> = {
  sugar: { emoji: '🍬', label: 'Sugar', width: 36, height: 36 },
  junk:  { emoji: '🍕', label: 'Junk Food', width: 40, height: 40 },
  soda:  { emoji: '🥤', label: 'Soda', width: 34, height: 48 },
};

const TYPES: ObstacleType[] = ['sugar', 'junk', 'soda'];

let _nextId = 0;

export function createObstacle(canvasWidth: number, groundY: number): Obstacle {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const cfg = CONFIGS[type];
  return {
    id: _nextId++,
    x: canvasWidth + 20,
    y: groundY - cfg.height,
    width: cfg.width,
    height: cfg.height,
    type,
    emoji: cfg.emoji,
    label: cfg.label,
  };
}

export function updateObstacles(obstacles: Obstacle[], speed: number): Obstacle[] {
  return obstacles
    .map(obs => ({ ...obs, x: obs.x - speed }))
    .filter(obs => obs.x + obs.width > -40);
}
