export type AccentColor = 'yellow' | 'cyan' | 'green' | 'purple' | 'orange' | 'pink';

export interface Category {
  slug: string;
  name: string;
  description: string;
  accent: AccentColor;
}

export type Availability = 'in-stock' | 'out-of-stock' | 'unknown';

export type ProductTag = 'nuevo' | 'oferta' | 'mas-vendido';

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  categorySlug: string;
  description: string;
  /**
   * Ruta pública de la foto (ej. "/products/churu-atun-pollo.jpg").
   * Vacío = se dibuja el tile placeholder con el patrón de gatos.
   */
  image?: string;
  /** Precio en CLP. DATOS DE DEMOSTRACIÓN hasta confirmar con la tienda. */
  price: number;
  compareAtPrice?: number;
  variantLabel?: string;
  /** Formatos/sabores seleccionables en la ficha. */
  variants?: string[];
  tags: ProductTag[];
  availability: Availability;
}
