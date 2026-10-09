# Duy Treats — Storefront

Vista visual del storefront de **Duy Treats** (Puerto Montt, Región de Los Lagos),
construida con Astro + TypeScript estricto + Tailwind CSS v4. Datos de
demostración basados en el catálogo real observado en Instagram (`@duytreats`).

> ⚠️ **No publicar tal cual**: los precios y el stock son ficticios y deben
> confirmarse con la tienda. Los avisos "datos de demostración" deben quitarse
> al publicar.

## Stack

- **Astro 5** — storefront estático, islas sólo donde hay interacción real.
- **TypeScript estricto** — sin `any`, `noUncheckedIndexedAccess`.
- **Tailwind CSS v4** — design tokens vía `@theme` en `src/styles/global.css`.
- **React (islas)** — carrito, drawer, selección de formato/cantidad.
- **nanostores** — estado compartido entre islas (carrito).
- **@fontsource** — Plus Jakarta Sans (UI) + Poppins (titulares), self-hosted.

## Comandos

```bash
npm install      # ya instalado
npm run dev      # servidor de desarrollo (http://localhost:4321)
npm run build    # build de producción
npm run preview  # preview del build
npm run check    # typecheck + chequeos de Astro
```

## Estructura

```
src/
├── components/
│   ├── layout/     # AnnouncementBar, Header, Footer
│   ├── home/       # Hero, CategorySection, FeaturedProducts, PromoBanner, Benefits, InstagramSection
│   ├── product/    # ProductCard, ProductGrid, ProductGallery
│   └── ui/         # Button, Badge, SectionHeading, ImagePlaceholder, CatPattern
├── data/           # products.ts, categories.ts  ← DATOS DE DEMOSTRACIÓN
├── islands/        # CartButton, CartIsland, AddToCartButton, ProductPurchase (React)
├── layouts/        # StoreLayout.astro
├── lib/            # format.ts (CLP), accents.ts (mapas de clases)
├── pages/          # index, productos, productos/[slug], categorias, categorias/[slug], 404
├── stores/         # cart.ts (nanostores)
└── styles/         # global.css (design tokens)
```

## Rutas

| Ruta | Contenido |
|---|---|
| `/` | Homepage: hero con parallax, categorías, destacados, promo, beneficios, Instagram |
| `/productos` | Catálogo completo |
| `/productos/[slug]` | Ficha de producto (galería, formato, cantidad, relacionados) |
| `/categorias` | Índice de categorías |
| `/categorias/[slug]` | Productos por categoría |
| `/404` | Página de error |

## Decisiones de diseño (resumen)

- **Astro sobre Next**: catálogo público indexable con pocas islas interactivas;
  Next arrastraría React a todo el sitio.
- **Magenta `#E00053`** reservado a marca y CTA primario; acentos de color
  (amarillo/cian/verde/morado/naranjo) mapeados a categorías, con contraste
  verificado AA (tokens `-ink` sobre `-soft`; nunca texto claro sobre amarillo).
- **Patrón de gatos** como recurso de marca: hero (parallax sutil), fondo de
  tiles, bloque promo y footer — siempre a baja opacidad.
- **Parallax**: capas marcadas con `data-parallax`, desplazamiento por rAF,
  desactivado con `prefers-reduced-motion` y en viewports < 768px.
- **Franja de acento superior** en tarjetas: eco de los tiles de Instagram.
- **Placeholders de imagen**: tiles con patrón de gatos + franja de categoría,
  claramente reemplazables (ver abajo).

## Sistema de parallax

Declarativo: envolver una capa **decorativa** con `.parallax-layer` +
`data-parallax="<velocidad>"`. Nunca envolver contenido funcional.

| Ubicación | Velocidad | Qué se mueve |
|---|---|---|
| Hero — blob lejano | 0.04 | Manchas magenta/amarillo desenfocadas |
| Hero — patrón | 0.10 | Patrón de gatos |
| Hero — tarjeta producto | 0.06 | Tile de producto |
| Hero — tarjetita flotante | 0.18 | Mini card con precio |
| Banda divisoria | 0.15 | Patrón en tira diagonal |
| Tarjetas (categoría/producto) | 0.05 | Patrón interior (contenido fijo) |
| Bloque promo | 0.08 / 0.12 | Patrón lejano + manchas cercanas |
| Instagram / Footer | 0.06 | Deriva lenta del patrón |

**Rendimiento** (`src/scripts/parallax.ts`):
- Un único loop rAF; en cada frame primero se **leen** todas las métricas y
  luego se **escriben** los transforms (sin layout thrashing).
- Se mide el contenedor, nunca la capa transformada (sin realimentación).
- Capas fuera del viewport se saltan; offset acotado a ±48px.
- Se desactiva con `prefers-reduced-motion`, viewport <768px, puntero no
  fino (táctil) o `save-data`; `will-change` sólo vía `.has-parallax`.
- Pausa al ocultar la pestaña (`visibilitychange`).

## Pendiente para publicar

1. **Fotos de producto**: subir a `public/products/` y setear `image` en
   `src/data/products.ts` (mientras el campo esté vacío se dibuja el tile
   placeholder).
2. **Precios, stock y promociones reales**: confirmar con la tienda y actualizar
   `src/data/products.ts`; quitar avisos de "demostración" (AnnouncementBar,
   footer, páginas).
3. **Datos comerciales**: zonas y costos de reparto/retiro, canal de contacto
   oficial (WhatsApp/teléfono/correo) — hoy marcados con `TODO` en Footer y ficha
   de producto.
4. **Dominio real**: actualizar `site` en `astro.config.mjs` (afecta canonical,
   sitemap y OG). Añadir `og:image` cuando existan las fotos.
5. **Búsqueda**: el botón del header está `aria-disabled` a propósito; habilitar
   al construir el catálogo con filtros.

## Siguiente fase (no incluida)

- Carrito persistente (localStorage/API) y checkout.
- Backend .NET (Minimal API + PostgreSQL) y reemplazo de los datos mock por
  llamadas REST (la capa `src/data/` es el único punto a sustituir).
- `/admin` para gestión de productos, precios, inventario y pedidos.
