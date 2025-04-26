import { createMutation } from "@farfetched/core";
import { zodContract } from "@farfetched/zod";
import { createEffect, createEvent, sample } from "effector";
import { z } from "zod";

import { setToken } from "@/shared/tokens";

// Схема для ответа от refresh endpoint
const refreshTokenResponseSchema = z.object({
  access_token: z.string(),
});

// Эффект для обновления токена
const refreshTokenFx = createEffect(async () => {
  console.log("Refreshing token...");

  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include", // Важно для отправки httpOnly куки
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Token refresh error:", response.status);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Получаем данные из тела ответа
  const data = await response.json();
  console.log("Refresh token response:", data);

  // Проверяем наличие access_token
  if (!data.access_token) {
    throw new Error("Access token is missing in the refresh response");
  }

  return {
    access_token: data.access_token,
  };
});

export const refreshTokenMutation = createMutation({
  effect: refreshTokenFx,
  contract: zodContract(refreshTokenResponseSchema),
});

sample({
  clock: refreshTokenMutation.finished.success,
  fn: ({ result }) => {
    console.log("refreshTokenMutation success:", result);
    return { access_token: result.access_token };
  },
  target: setToken,
});

// Событие для запуска обновления токена
export const refreshTokenRequested = createEvent();

// Связываем событие с мутацией
sample({
  clock: refreshTokenRequested,
  target: refreshTokenMutation.start,
});
