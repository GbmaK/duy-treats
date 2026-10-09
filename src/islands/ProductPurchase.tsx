import { useEffect, useRef, useState } from 'react';
import AddToCartButton from './AddToCartButton';

interface Props {
  productId: string;
  name: string;
  variants?: string[];
  defaultVariant?: string;
  disabled?: boolean;
}

export default function ProductPurchase({
  productId,
  name,
  variants = [],
  defaultVariant,
  disabled = false,
}: Props) {
  const [variant, setVariant] = useState<string>(defaultVariant ?? variants[0] ?? '');
  const [qty, setQty] = useState(1);
  const hasVariants = variants.length > 1;
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const step = (delta: number) => {
    setQty((current) => Math.min(99, Math.max(1, current + delta)));
  };

  return (
    <div className="space-y-6">
      {hasVariants && (
        <fieldset>
          <legend className="text-sm font-semibold text-ink">Formato</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {variants.map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-pill border px-4 py-2 text-sm font-semibold transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:text-brand-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
                  variant === option ? 'border-brand bg-brand-soft text-brand-ink' : 'border-line text-ink-muted hover:bg-surface-muted'
                }`}
              >
                <input
                  type="radio"
                  name={`variant-${productId}`}
                  value={option}
                  checked={variant === option}
                  onChange={() => setVariant(option)}
                  className="sr-only"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-ink">Cantidad</span>
        <div className="inline-flex items-center rounded-pill border border-line">
          <button
            type="button"
            aria-label="Quitar una unidad"
            className="flex h-10 w-10 items-center justify-center rounded-pill text-lg text-ink-muted transition-colors hover:bg-surface-muted disabled:opacity-40"
            onClick={() => step(-1)}
            disabled={qty <= 1}
          >
            −
          </button>
          <span className="min-w-10 text-center text-sm font-semibold text-ink" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Agregar una unidad"
            className="flex h-10 w-10 items-center justify-center rounded-pill text-lg text-ink-muted transition-colors hover:bg-surface-muted"
            onClick={() => step(1)}
          >
            +
          </button>
        </div>
      </div>

      <AddToCartButton
        productId={productId}
        name={variant ? `${name} · ${variant}` : name}
        disabled={disabled}
        fullWidth
      />
    </div>
  );
}
