import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tanstackStart({
      server: {
        entry: "server",
      },
    }),
    netlify(),
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});