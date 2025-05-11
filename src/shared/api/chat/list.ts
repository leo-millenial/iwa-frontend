import { createQuery } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";
import { ChatStatus, IChat } from "@/shared/types/chat.types.ts";

const fetchChatListFx = createEffect<
  { headers: Record<string, string>; status?: ChatStatus },
  IChat[]
>(async ({ headers, status }) => {
  const url = new URL("/api/chat/list", window.location.origin);
  if (status) url.searchParams.set("status", status);

  const response = await fetch(url.toString(), {
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Не удалось загрузить список чатов");
  }

  return await response.json();
});

export const chatListQuery = createQuery({
  effect: attach({
    source: $headers,
    mapParams: (status: ChatStatus | undefined, headers) => ({
      headers,
      status,
    }),
    effect: fetchChatListFx,
  }),
});
