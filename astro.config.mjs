import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';

export default defineConfig({
  output: 'static',
  site: 'https://www.riverrecords.ai',
  integrations: [
    // /product-overview/ is the print source for the Elion product PDF. It restates
    // /pricing/ and would split that page's signal, so it is noindex and kept out of
    // the sitemap rather than being a page we ask Google to rank.
    sitemap({ filter: (page) => !page.includes('/product-overview/') }),
    vue(),
  ],
});
