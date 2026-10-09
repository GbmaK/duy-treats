/**
 * Sistema de parallax declarativo y de bajo costo para Duy Treats.
 *
 * Uso: envolver una capa DECORATIVA con la clase .parallax-layer y el
 * atributo data-parallax="<velocidad>" (rango recomendado 0.04–0.15).
 * El contenido funcional (textos, precios, CTAs, fotos de producto) no se
 * envuelve: sólo se mueve el decorado.
 *
 * Decisiones de rendimiento:
 * - Un único loop requestAnimationFrame para todas las capas.
 * - Dos fases por frame: primero se LEEN todas las métricas, luego se
 *   ESCRIBEN los transforms (evita layout thrashing).
 * - Se mide el contenedor (elemento padre), nunca la capa transformada,
 *   para evitar realimentación/jitter por el propio transform.
 * - Capas fuera del viewport se saltan (con margen).
 * - Offset acotado (±48px) para que nunca se vean los bordes del patrón.
 * - Se desactiva por completo con prefers-reduced-motion, viewport <768px,
 *   puntero no fino (táctil) o navegador con save-data.
 * - will-change sólo se activa vía la clase .has-parallax en <html>.
 */

interface ParallaxLayer {
  el: HTMLElement;
  /** Contenedor sin transformar que se usa como referencia de medición. */
  target: HTMLElement;
  speed: number;
}

const MAX_OFFSET_PX = 48;
const VIEWPORT_MARGIN_PX = 120;

function isSupported(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!window.matchMedia('(min-width: 768px)').matches) return false;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;

  return true;
}

function collectLayers(): ParallaxLayer[] {
  const layers: ParallaxLayer[] = [];

  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))) {
    const speed = Number.parseFloat(el.dataset.parallax ?? '');
    const target = el.parentElement;
    if (!target || !Number.isFinite(speed) || speed === 0) continue;
    layers.push({ el, target, speed });
  }

  return layers;
}

let layers: ParallaxLayer[] = [];
let frame = 0;
let watchdog = 0;
let rafBroken = false;
let listening = false;

function paint(): void {
  window.clearTimeout(watchdog);
  frame = 0;

  // Fase 1: lecturas (ninguna escritura todavía → sin reflows forzados)
  const viewportHeight = window.innerHeight;
  const pending: { el: HTMLElement; offset: number }[] = [];

  for (const layer of layers) {
    const rect = layer.target.getBoundingClientRect();
    if (rect.bottom < -VIEWPORT_MARGIN_PX || rect.top > viewportHeight + VIEWPORT_MARGIN_PX) {
      continue;
    }
    const center = rect.top + rect.height / 2;
    const raw = (center - viewportHeight / 2) * -layer.speed;
    pending.push({
      el: layer.el,
      offset: Math.max(-MAX_OFFSET_PX, Math.min(MAX_OFFSET_PX, raw)),
    });
  }

  // Fase 2: escrituras
  for (const item of pending) {
    item.el.style.transform = `translate3d(0, ${item.offset.toFixed(1)}px, 0)`;
  }
}

function schedule(): void {
  if (!listening) return;
  if (!isSupported()) {
    teardown();
    resetTransforms();
    return;
  }
  if (frame !== 0) return;

  // Camino rápido: rAF (una pintura por frame como máximo).
  // Fallback: si el entorno no ejecuta rAF (algunos navegadores embebidos o
  // pestañas en segundo plano), un watchdog pinta en síncrono y fija el modo.
  if (!rafBroken) {
    frame = requestAnimationFrame(paint);
    watchdog = window.setTimeout(() => {
      if (frame !== 0) {
        rafBroken = true;
        cancelAnimationFrame(frame);
        frame = 0;
        paint();
      }
    }, 150);
  } else {
    paint();
  }
}

function resetTransforms(): void {
  for (const layer of layers) layer.el.style.transform = '';
  document.documentElement.classList.remove('has-parallax');
}

function onVisibilityChange(): void {
  if (document.hidden) {
    window.clearTimeout(watchdog);
    if (frame !== 0) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  } else {
    schedule();
  }
}

function teardown(): void {
  if (!listening) return;
  window.clearTimeout(watchdog);
  if (frame !== 0) cancelAnimationFrame(frame);
  frame = 0;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  document.removeEventListener('visibilitychange', onVisibilityChange);
  listening = false;
}

export function initParallax(): void {
  teardown();

  if (!isSupported()) return;

  layers = collectLayers();
  if (layers.length === 0) return;

  document.documentElement.classList.add('has-parallax');
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  listening = true;

  schedule();
}
