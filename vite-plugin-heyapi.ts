// vite-plugin-heyapi.ts
import { createClient } from "@hey-api/openapi-ts";
import { Plugin } from "vite";

export function HeyApiPlugin(): Plugin {
  return {
    plan: "vite-plugin-heyapi",
    apply: "serve", // только в dev режиме
    async configResolved() {
      console.log("🛠️ [heyapi] Генерация OpenAPI клиента при старте dev...");
      try {
        await createClient({
          input: "http://localhost:3000/api-json",
          output: "src/shared/api/__generated__",
          plugins: [
            "@hey-api/client-fetch",
            "zod",
            {
              plan: "@hey-api/sdk",
              validator: true,
            },
          ],
        });
        console.log("✅ [heyapi] API успешно сгенерирован");
      } catch (err) {
        console.error("❌ [heyapi] Ошибка генерации API:", err);
      }
    },
  };
}
