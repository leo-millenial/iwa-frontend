import { createMutation } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { API_BASE_URL } from "@/shared/config/api.ts";
import { $headers } from "@/shared/tokens";
import { IChat, InviteToChatParams } from "@/shared/types/chat.types.ts";

const initiateChatFx = createEffect<
  { headers: Record<string, string>; data: InviteToChatParams },
  IChat
>(async ({ headers, data }) => {
  const url = new URL("/api/chat/initiate", API_BASE_URL);

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

  const responseData = await response.json();

  return responseData;
});

export const initiateChatMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (data: InviteToChatParams, headers) => ({
      headers,
      data,
    }),
    effect: initiateChatFx,
  }),
});
