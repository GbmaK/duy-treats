import type { Category } from '../types/catalog';

/**
 * Categorías alineadas a lo que se ve en el Instagram de Duy Treats.
 * El acento de color mapea la franja superior de los tiles de IG.
 */
export const categories: Category[] = [
  {
    slug: 'churu-cat',
    name: 'Churu Cat',
    description: 'Snacks cremosos para gatos: atún, pollo, queso y más.',
    accent: 'yellow',
  },
  {
    slug: 'churu-dog',
    name: 'Churu Dog',
    description: 'Los mismos snacks cremosos, en sabores para perros.',
    accent: 'green',
  },
  {
    slug: 'mega-churu',
    name: 'MEGA Churu',
    description: 'Formato grande para los que quieren más.',
    accent: 'orange',
  },
  {
    slug: 'arena-aglutinante',
    name: 'Arena aglutinante',
    description: 'Arena para gatos: patitas limpias y control de olores.',
    accent: 'purple',
  },
  {
    slug: 'toallitas-humedas',
    name: 'Toallitas húmedas',
    description: 'Higiene diaria: desodorizantes y antibacteriales.',
    accent: 'cyan',
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
