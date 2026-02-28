// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://expatlegalvietnam.com',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi', 'ko', 'zh', 'fr', 'de', 'es', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
