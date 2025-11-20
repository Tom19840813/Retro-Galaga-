import { Rect, Vector2 } from '../types';

export const checkCollision = (a: Rect, b: Rect): boolean => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};

export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

export const distance = (a: Vector2, b: Vector2): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Quadratic Bezier curve for smooth enemy paths
// p0: start, p1: control point, p2: end, t: 0 to 1
export const getBezierPoint = (p0: Vector2, p1: Vector2, p2: Vector2, t: number): Vector2 => {
  const oneMinusT = 1 - t;
  const x = oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x;
  const y = oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y;
  return { x, y };
};

export const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};