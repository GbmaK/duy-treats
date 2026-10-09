import { useEffect, useRef, useState } from 'react';
import { addToCart } from '../stores/cart';

interface Props {
  productId: string;
  name: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function AddToCartButton({ productId, name, disabled = false, fullWidth = false }: Props) {
  const [added, setAdded] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-surface-muted px-5 text-sm font-semibold text-ink-muted ${
          fullWidth ? 'w-full' : ''
        }`}
      >
        Agotado
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          addToCart(productId, name);
          setAdded(true);
          if (timer.current !== null) window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setAdded(false), 1500);
        }}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-pill border px-5 text-sm font-semibold transition-colors ${
          added
            ? 'border-brand bg-brand-soft text-brand-ink'
            : 'border-line bg-surface text-ink hover:bg-surface-muted'
        } ${fullWidth ? 'w-full' : ''}`}
      >
        {added ? '¡Agregado!' : 'Agregar al carrito'}
      </button>
      <span role="status" className="sr-only">
        {added ? `${name} agregado al carrito` : ''}
      </span>
    </>
  );
}
