import react from "@vitejs/plugin-react";

/** @type {import('vite').UserConfig} */
export default {
  plugins: [react()],
  server: {
    strictPort: true,
    port: 3000,
  },
};
