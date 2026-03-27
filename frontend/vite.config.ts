import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  resolve: {
    alias: {
      // permite importar de ../../src/compositions direto
      "@compositions": path.resolve(__dirname, "../src/compositions"),
      "@utils":        path.resolve(__dirname, "../src/utils"),
      "@components":   path.resolve(__dirname, "../src/components"),
    },
  },
});
