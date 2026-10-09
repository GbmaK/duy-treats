import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import {
  cartLines,
  cartSubtotal,
  closeCart,
  flashMessage,
  isCartOpen,
  removeFromCart,
  setQuantity,
} from '../stores/cart';
import { formatPrice } from '../lib/format';
import { ACCENT_BAR } from '../lib/accents';
import { categories } from '../data/categories';
import type { AccentColor } from '../types/catalog';

function accentOf(categorySlug: string): AccentColor {
  return categories.find((category) => category.slug === categorySlug)?.accent ?? 'cyan';
}

function LineThumb({ categorySlug }: { categorySlug: string }) {
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
      <span className={`absolute inset-x-0 top-0 h-1 ${ACCENT_BAR[accentOf(categorySlug)]}`} aria-hidden="true" />
    </div>
  );
}

export default function CartIsland() {
  const open = useStore(isCartOpen);
  const lines = useStore(cartLines);
  const subtotal = useStore(cartSubtotal);
  const flash = useStore(flashMessage);
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [checkoutNote, setCheckoutNote] = useState(false);

  // Tecla Escape para cerrar
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Bloqueo de scroll de fondo + foco al abrir
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Trampa de foco simple dentro del drawer
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Toast: se limpia solo
  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => flashMessage.set(null), 2600);
    return () => window.clearTimeout(timer);
  }, [flash]);

  return (
    <>
      {/* Toast de feedback */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4" aria-live="polite">
        {flash && (
          <p className="rounded-pill bg-ink px-4 py-2 text-sm font-medium text-white shadow-pop">
            {flash}
          </p>
        )}
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <button
            type="button"
            aria-label="Cerrar carrito"
            className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-sm"
            onClick={closeCart}
          />

          <div
            ref={panel}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-pop"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 id="cart-title" className="font-display text-lg font-bold text-ink">
                Tu carrito
              </h2>
              <button
                ref={closeButton}
                type="button"
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-pill text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
                <span className="sr-only">Cerrar</span>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="font-display text-lg font-semibold text-ink">Tu carrito está vacío</p>
                <p className="text-sm text-ink-muted">
                  Explora el catálogo y agrega los favoritos de tu michi.
                </p>
                <a
                  href="/productos"
                  onClick={closeCart}
                  className="inline-flex h-11 items-center rounded-pill bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                >
                  Ver productos
                </a>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {lines.map(({ product, qty, lineTotal }) => (
                    <li key={product.id} className="flex gap-4 py-4">
                      <LineThumb categorySlug={product.categorySlug} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-snug text-ink">{product.name}</p>
                        {product.variantLabel && (
                          <p className="mt-0.5 text-xs text-ink-muted">{product.variantLabel}</p>
                        )}
                        <p className="mt-1 text-sm font-semibold text-ink">{formatPrice(lineTotal)}</p>

                        <div className="mt-2 flex items-center gap-3">
                          <div className="inline-flex items-center rounded-pill border border-line">
                            <button
                              type="button"
                              aria-label={`Quitar una unidad de ${product.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-pill text-ink-muted hover:bg-surface-muted"
                              onClick={() => setQuantity(product.id, qty - 1)}
                            >
                              −
                            </button>
                            <span className="min-w-8 text-center text-sm font-semibold" aria-live="polite">
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Agregar una unidad de ${product.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-pill text-ink-muted hover:bg-surface-muted"
                              onClick={() => setQuantity(product.id, qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="text-xs font-medium text-danger hover:underline"
                            onClick={() => removeFromCart(product.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line px-5 py-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-ink-muted">Subtotal estimado</span>
                    <span className="font-display text-xl font-bold text-ink" data-testid="cart-subtotal">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">
                    Sin despacho ni impuestos: el total final se calcula al confirmar la compra.
                  </p>
                  <button
                    type="button"
                    className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-pill bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                    onClick={() => setCheckoutNote(true)}
                  >
                    Continuar
                  </button>
                  {checkoutNote && (
                    <p className="mt-2 text-center text-xs text-ink-muted">
                      El checkout se habilitará en la siguiente etapa del proyecto.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
