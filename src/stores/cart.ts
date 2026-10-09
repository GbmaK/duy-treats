import { atom, computed, map } from 'nanostores';
import type { Product } from '../types/catalog';
import { products } from '../data/products';

export type CartQuantities = Record<string, number>;

/** Cantidades por productId. Estado compartido por todas las islas React. */
export const cartItems = map<CartQuantities>({});
export const isCartOpen = atom(false);
/** Mensaje breve de feedback ("agregado al carrito"), auto-limpieza en el componente. */
export const flashMessage = atom<string | null>(null);

export function addToCart(productId: string, name: string, qty = 1): void {
  const current = cartItems.get()[productId] ?? 0;
  cartItems.setKey(productId, current + qty);
  flashMessage.set(`Agregaste ${name} al carrito`);
}

export function setQuantity(productId: string, qty: number): void {
  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }
  cartItems.setKey(productId, qty);
}

export function removeFromCart(productId: string): void {
  const next: CartQuantities = { ...cartItems.get() };
  delete next[productId];
  cartItems.set(next);
}

export function openCart(): void {
  isCartOpen.set(true);
}

export function closeCart(): void {
  isCartOpen.set(false);
}

export const cartCount = computed(cartItems, (items) =>
  Object.values(items).reduce((total, qty) => total + qty, 0),
);

export interface CartLine {
  product: Product;
  qty: number;
  lineTotal: number;
}

export const cartLines = computed(cartItems, (items): CartLine[] =>
  products
    .filter((product) => (items[product.id] ?? 0) > 0)
    .map((product) => {
      const qty = items[product.id] ?? 0;
      return { product, qty, lineTotal: product.price * qty };
    }),
);

export const cartSubtotal = computed(cartLines, (lines) =>
  lines.reduce((total, line) => total + line.lineTotal, 0),
);
