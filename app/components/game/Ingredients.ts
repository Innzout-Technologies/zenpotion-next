export type IngredientType = 'orange' | 'ginger' | 'amla';

export interface Ingredient {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: IngredientType;
  emoji: string;
  label: string;
  collected: boolean;
}

interface IngredientConfig {
  emoji: string;
  label: string;
}

const CONFIGS: Record<IngredientType, IngredientConfig> = {
  orange: { emoji: '🍊', label: 'Orange' },
  ginger: { emoji: '🌱', label: 'Ginger' },
  amla:   { emoji: '💚', label: 'Amla' },
};

const TYPES: IngredientType[] = ['orange', 'ginger', 'amla'];

let _nextId = 0;

export function createIngredient(canvasWidth: number, groundY: number): Ingredient {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const cfg = CONFIGS[type];
  // 40% chance to float above ground, 60% chance to be at ground level
  const y = Math.random() < 0.4
    ? groundY - 80 - Math.random() * 50
    : groundY - 52;
  return {
    id: _nextId++,
    x: canvasWidth + 20,
    y,
    width: 36,
    height: 36,
    type,
    emoji: cfg.emoji,
    label: cfg.label,
    collected: false,
  };
}

export function updateIngredients(ingredients: Ingredient[], speed: number): Ingredient[] {
  return ingredients
    .map(ing => ({ ...ing, x: ing.x - speed }))
    .filter(ing => ing.x + ing.width > -40);
}
