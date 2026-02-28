// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://expatlegalvietnam.com',
  output: 'static', // Static output for Kimi/Vercel/Netlify/Cloudflare Pages
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
