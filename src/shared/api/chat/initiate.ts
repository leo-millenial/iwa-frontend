import { createMutation } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";
import { IChat, InitiateChatRequest } from "@/shared/types/chat.types.ts";

const initiateChatFx = createEffect<
  { headers: Record<string, string>; data: InitiateChatRequest },
  IChat
>(async ({ headers, data }) => {
  const url = new URL("/api/chat/initiate", window.location.origin);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при инициации чата");
  }

  return await response.json();
});

export const initiateChatMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (data: InitiateChatRequest, headers) => ({
      headers,
      data,
    }),
    effect: initiateChatFx,
  }),
});
