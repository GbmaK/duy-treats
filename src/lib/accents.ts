import type { AccentColor } from '../types/catalog';

/**
 * Clases estáticas por acento. Tailwind detecta literales al escanear el
 * código: nunca construir class names por interpolación.
 */
export const ACCENT_BAR: Record<AccentColor, string> = {
  yellow: 'bg-accent-yellow',
  cyan: 'bg-accent-cyan',
  green: 'bg-accent-green',
  purple: 'bg-accent-purple',
  orange: 'bg-accent-orange',
  pink: 'bg-accent-pink',
};

/** Fondo suave + texto ink: contraste verificado AA sobre claro. */
export const ACCENT_CHIP: Record<AccentColor, string> = {
  yellow: 'bg-accent-yellow-soft text-accent-yellow-ink',
  cyan: 'bg-accent-cyan-soft text-accent-cyan-ink',
  green: 'bg-accent-green-soft text-accent-green-ink',
  purple: 'bg-accent-purple-soft text-accent-purple-ink',
  orange: 'bg-accent-orange-soft text-accent-orange-ink',
  pink: 'bg-accent-pink-soft text-accent-pink-ink',
};

/** Mancha decorativa de fondo para los placeholders. */
export const ACCENT_BLOB: Record<AccentColor, string> = {
  yellow: 'bg-accent-yellow/20',
  cyan: 'bg-accent-cyan/20',
  green: 'bg-accent-green/20',
  purple: 'bg-accent-purple/20',
  orange: 'bg-accent-orange/20',
  pink: 'bg-accent-pink/20',
};
