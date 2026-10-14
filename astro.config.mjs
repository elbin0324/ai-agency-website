// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site. For a custom domain later: site = the domain, base = '/'.
// Nothing else should need to change (every link goes through url() in src/lib/url.ts).
// https://astro.build/config
export default defineConfig({
  site: 'https://elbin0324.github.io',
  base: '/ai-agency-website',
  trailingSlash: 'ignore',

  vite: {
    plugins: [tailwindcss()],
    // "@/…" -> src/… (mirrors the tsconfig "paths" entry, which editors and astro check read).
    resolve: {
      alias: [{ find: /^@\//, replacement: fileURLToPath(new URL('./src/', import.meta.url)) }]
    }
  },

  // /dev/ pages are internal test pages: keep them out of the sitemap.
  integrations: [sitemap({ filter: (page) => !/\/dev\//.test(new URL(page).pathname) })]
});
