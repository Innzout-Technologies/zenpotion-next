'use client';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Provides AABB (axis-aligned bounding box) collision utilities.
 * Returns stable function references — safe to use inside game loops.
 */
export function useCollision() {
  /**
   * Returns true if rect `a` overlaps rect `b`.
   */
  function checkAABB(a: Rect, b: Rect): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * Shrinks a rect inward by `margin` on all sides.
   * Use to create a forgiving hitbox smaller than the visual sprite.
   */
  function shrinkRect(rect: Rect, margin: number): Rect {
    return {
      x: rect.x + margin,
      y: rect.y + margin,
      width: rect.width - margin * 2,
      height: rect.height - margin * 2,
    };
  }

  return { checkAABB, shrinkRect };
}
