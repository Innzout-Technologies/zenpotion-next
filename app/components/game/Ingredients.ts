export type IngredientType = 'orange' | 'lemon' | 'ginger' | 'amla' | 'beetroot';

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
  isSuper: boolean; // true for ginger — triggers power-up
}

interface IngredientConfig {
  emoji: string;
  label: string;
  isSuper: boolean;
}

const CONFIGS: Record<IngredientType, IngredientConfig> = {
  orange:   { emoji: '🍊', label: 'Orange',   isSuper: false },
  lemon:    { emoji: '🍋', label: 'Lemon',    isSuper: false },
  ginger:   { emoji: '⚡', label: 'Ginger',   isSuper: true  }, // lightning = super power
  amla:     { emoji: '🟢', label: 'Amla',     isSuper: false },
  beetroot: { emoji: '🔴', label: 'Beetroot', isSuper: false },
};

/**
 * Spawn weights — ginger is rarer (it's a super power) and never ground-level.
 * Array entries are [type, relativeWeight].
 */
const SPAWN_TABLE: [IngredientType, number][] = [
  ['orange',   3],
  ['lemon',    3],
  ['amla',     3],
  ['beetroot', 3],
  ['ginger',   1], // rare — 1 in 13 chance
];

const TOTAL_WEIGHT = SPAWN_TABLE.reduce((s, [, w]) => s + w, 0);

function pickType(): IngredientType {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const [type, weight] of SPAWN_TABLE) {
    roll -= weight;
    if (roll <= 0) return type;
  }
  return 'orange';
}

let _nextId = 0;

export function createIngredient(canvasWidth: number, groundY: number): Ingredient {
  const type = pickType();
  const cfg = CONFIGS[type];

  /**
   * Height placement:
   * - Ginger (super): always floating at jump-arc peak height so player must jump for it
   * - Others: 65% floating (rewards jump), 35% ground-level (passive collection)
   *
   * Floating band = 88–112 px above ground → sits at the apex of a standard tap-jump
   * so collecting it means you've also cleared any obstacle at ground level.
   */
  const forceFloat = cfg.isSuper;
  const floating = forceFloat || Math.random() < 0.65;
  const y = floating
    ? groundY - 92 - Math.random() * 20
    : groundY - 44;

  return {
    id: _nextId++,
    x: canvasWidth + 20,
    y,
    width: cfg.isSuper ? 38 : 34, // ginger is slightly larger to stand out
    height: cfg.isSuper ? 38 : 34,
    type,
    emoji: cfg.emoji,
    label: cfg.label,
    collected: false,
    isSuper: cfg.isSuper,
  };
}

export function updateIngredients(ingredients: Ingredient[], speed: number): Ingredient[] {
  return ingredients
    .map(ing => ({ ...ing, x: ing.x - speed }))
    .filter(ing => ing.x + ing.width > -40);
}
