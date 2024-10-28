import adapter from "svelte-adapter-bun";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  vitePlugin: {
    inspector: {
      toggleKeyCombo: "shift-meta",
    },
  },
  kit: {
    csrf: false,
    adapter: adapter(),
    alias: {
      $shadcn: "./src/lib/shadcn/*",
      $ui: "./src/lib/shadcn/components/ui/*",
    },
  },
};

export default config;
