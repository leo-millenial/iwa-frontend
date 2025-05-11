import { createQuery } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";
import { IChat } from "@/shared/types/chat.types.ts";

const fetchChatByIdFx = createEffect<{ headers: Record<string, string>; chatId: string }, IChat>(
  async ({ headers, chatId }) => {
    const url = new URL(`/api/chat/${chatId}`, window.location.origin);

    const response = await fetch(url.toString(), {
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Не удалось получить чат");
    }

    return await response.json();
  },
);

export const chatByIdQuery = createQuery({
  effect: attach({
    source: $headers,
    mapParams: (chatId: string, headers) => ({
      headers,
      chatId,
    }),
    effect: fetchChatByIdFx,
  }),
});
