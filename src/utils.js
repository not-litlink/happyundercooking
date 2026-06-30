export function distance2D(a, b) {
  const dx = a[0] - b[0];
  const dz = a[2] - b[2];
  return Math.hypot(dx, dz);
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function near(a, b, range = 1.05) {
  return distance2D(a, b) <= range;
}

export function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function easeInQuad(value) {
  return value * value;
}

export function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}
