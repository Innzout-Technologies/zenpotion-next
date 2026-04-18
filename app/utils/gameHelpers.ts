import type { IngredientType } from '../components/game/Ingredients';

export interface ProductRecommendation {
  name: string;
  size: string;     // e.g. "60ml"
  tagline: string;
  benefits: string[];
  color: string;
  slug: string;
}

const PRODUCT_MAP: Record<string, ProductRecommendation> = {
  orange: {
    name: 'ZenPotion Citrus Shot',
    size: '60ml',
    tagline: 'Vitamin C immunity shot — fresh-pressed orange',
    benefits: ['Boosts immunity', 'Glowing skin', 'Natural energy lift'],
    color: '#f97316',
    slug: 'citrus-shot',
  },
  lemon: {
    name: 'ZenPotion Lemon Detox Shot',
    size: '60ml',
    tagline: 'Alkalising detox shot — zesty & refreshing',
    benefits: ['Aids detoxification', 'Alkalises the body', 'Digestive support'],
    color: '#eab308',
    slug: 'lemon-detox-shot',
  },
  ginger: {
    name: 'ZenPotion Ginger Power Shot',
    size: '60ml',
    tagline: 'Super-charged immunity shot — the original wellness hero',
    benefits: ['Anti-inflammatory', 'Gut health + digestion', 'Warming natural energy'],
    color: '#d97706',
    slug: 'ginger-power-shot',
  },
  amla: {
    name: 'ZenPotion Amla Shield Shot',
    size: '60ml',
    tagline: 'Antioxidant-rich ancient Ayurvedic tonic',
    benefits: ['Antioxidant powerhouse', 'Hair & skin health', 'Immunity shield'],
    color: '#16a34a',
    slug: 'amla-shield-shot',
  },
  beetroot: {
    name: 'ZenPotion Beet Energy Shot',
    size: '60ml',
    tagline: 'Natural nitrate shot for stamina and vitality',
    benefits: ['Boosts stamina', 'Supports blood health', 'Pre-workout energy'],
    color: '#be185d',
    slug: 'beet-energy-shot',
  },
  default: {
    name: 'ZenPotion Original Shot',
    size: '60ml',
    tagline: 'Clean daily wellness — zero sugar, real ingredients',
    benefits: ['Zero added sugar', 'Natural ingredients', 'Daily vitality'],
    color: '#5a7a4e',
    slug: 'original-shot',
  },
};

export function getProductRecommendation(
  collected: Record<IngredientType, number>
): ProductRecommendation {
  const entries = Object.entries(collected) as [IngredientType, number][];
  const dominant = entries.sort((a, b) => b[1] - a[1])[0];
  if (!dominant || dominant[1] === 0) return PRODUCT_MAP.default;
  return PRODUCT_MAP[dominant[0]] ?? PRODUCT_MAP.default;
}

export function calcJuiceMeter(collected: number, goal = 15): number {
  return Math.min(100, Math.round((collected / goal) * 100));
}

export function formatScore(score: number): string {
  return String(score).padStart(5, '0');
}
