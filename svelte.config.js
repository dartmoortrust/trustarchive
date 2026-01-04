// svelte.config.js
import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    experimental: {
      remoteFunctions: true,
    },
    adapter: adapter({}),
  },

  compilerOptions: {
    experimental: {
      async: true,
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
