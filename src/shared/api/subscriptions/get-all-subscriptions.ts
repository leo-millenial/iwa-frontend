import { createQuery } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";
import { ISubscription } from "@/shared/types/subscription.interface.ts";

const getSubscriptionsAllFx = createEffect<{ headers: Record<string, string> }, ISubscription[]>(
  async ({ headers }) => {
    const url = "/api/adm/subscriptions/company/all";

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Ошибка при получении подписок: ${response.status}`);
    }

    const data = await response.json();
    return data;
  },
);

export const getSubscriptionsAllQuery = createQuery({
  effect: attach({
    source: $headers,
    mapParams: (headers: Record<string, string>) => ({
      headers,
    }),
    effect: getSubscriptionsAllFx,
  }),
});
