import { useStore } from '@nanostores/react';
import { cartCount, openCart } from '../stores/cart';

export default function CartButton() {
  const count = useStore(cartCount);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}
      className="relative flex h-10 items-center gap-2 rounded-pill px-3 text-ink transition-colors hover:bg-surface-muted"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.8h-9A2 2 0 0 1 5.5 18L4 7Z" strokeLinejoin="round" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" strokeLinecap="round" />
      </svg>
      <span className="hidden text-sm font-semibold sm:inline">Carrito</span>
      {count > 0 && (
        <span
          data-testid="cart-count"
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-pill bg-brand px-1 text-xs font-bold text-white"
        >
          {count}
        </span>
      )}
    </button>
  );
}
