import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// TODO: confirmar dominio real antes de publicar (afecta canonical, sitemap y OG).
export default defineConfig({
  site: 'https://duytreats.cl',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
