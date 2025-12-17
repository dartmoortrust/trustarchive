// svelte.config.js
import adapter from "@sveltejs/adapter-node";
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
