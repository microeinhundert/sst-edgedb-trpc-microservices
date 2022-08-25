import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

/** @type {import('vite').UserConfig} */
export default {
  plugins: [
    react(),
    visualizer({
      emitFile: true,
      file: "stats.html",
    }),
  ],
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
  server: {
    strictPort: true,
    port: 3000,
  },
};
