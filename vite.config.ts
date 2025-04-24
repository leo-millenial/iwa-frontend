// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

import { HeyApiPlugin } from "./vite-plugin-heyapi";

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: ["patronum/babel-preset", "atomic-router/babel-preset"],
        plugins: [
          [
            "effector/babel-plugin",
            {
              factories: ["patronum"],
            },
          ],
        ],
      },
    }),
    tailwindcss(),
    HeyApiPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
