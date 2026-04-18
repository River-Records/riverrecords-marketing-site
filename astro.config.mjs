import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';

export default defineConfig({
  output: 'static',
  site: 'https://www.riverrecords.ai',
  integrations: [sitemap(), vue()],
});
