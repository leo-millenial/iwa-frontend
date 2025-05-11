// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения в зависимости от режима
  const env = loadEnv(mode, process.cwd(), "");

  // Определяем API URL в зависимости от режима, с приоритетом из переменных окружения
  const apiUrl =
    env.VITE_API_URL ||
    (mode === "production" ? "https://iwa-dev-api.duckdns.org" : "http://localhost:3000");

  return {
    plugins: [
      react({
        babel: {
          babelrc: true,
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: mode === "production",
        },
      },
    },
    // Добавляем переменные окружения для клиентского кода
    define: {
      "import.meta.env.API_URL": JSON.stringify(apiUrl),
    },
  };
});
