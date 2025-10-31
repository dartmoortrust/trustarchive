// svelte.config.js
import adapter from "@sveltejs/adapter-node";
import { sveltePreprocess } from "svelte-preprocess";
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    experimental: {
      remoteFunctions: true,
    },
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
