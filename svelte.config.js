// svelte.config.js
import adapter from 'svelte-adapter-bun';
import { sveltePreprocess } from "svelte-preprocess";
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
  preprocess: sveltePreprocess({
    typescript: true,
  }),
};

export default config;
