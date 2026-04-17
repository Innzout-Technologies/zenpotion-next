import type { IngredientType } from '../components/game/Ingredients';

export interface ProductRecommendation {
  name: string;
  tagline: string;
  benefits: string[];
  color: string;
  slug: string;
}

const PRODUCT_MAP: Record<string, ProductRecommendation> = {
  orange: {
    name: 'ZenPotion Citrus Burst',
    tagline: 'Vitamin C boost for everyday vitality',
    benefits: ['Boosts immunity', 'Glowing skin', 'Natural energy lift'],
    color: '#f97316',
    slug: 'citrus-burst',
  },
  ginger: {
    name: 'ZenPotion Ginger Zing',
    tagline: 'Spiced warmth for gut health and digestion',
    benefits: ['Aids digestion', 'Anti-inflammatory', 'Warming daily energy'],
    color: '#d97706',
    slug: 'ginger-zing',
  },
  amla: {
    name: 'ZenPotion Amla Shield',
    tagline: 'Antioxidant-rich ancient immunity tonic',
    benefits: ['Antioxidant boost', 'Hair & skin health', 'Immunity shield'],
    color: '#16a34a',
    slug: 'amla-shield',
  },
  default: {
    name: 'ZenPotion Original',
    tagline: 'Clean hydration for modern India',
    benefits: ['Zero added sugar', 'Natural ingredients', 'Daily vitality'],
    color: '#5a7a4e',
    slug: 'original',
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
