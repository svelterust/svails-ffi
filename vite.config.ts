import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import Unfonts from "unplugin-fonts/vite";

export default defineConfig({
  server: {
    fs: {
      allow: ["fonts"],
    },
  },
  plugins: [
    sveltekit(),
    Unfonts({
      custom: {
        families: [
          {
            name: "Geist",
            src: "./fonts/Geist/*.woff2",
          },
          {
            name: "GeistMono",
            src: "./fonts/GeistMono/*.woff2",
          },
        ],
      },
    }),
  ],
});
