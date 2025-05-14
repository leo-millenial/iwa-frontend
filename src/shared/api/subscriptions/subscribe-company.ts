import { createMutation } from "@farfetched/core";
import { attach, createEffect, sample } from "effector";

import { API_BASE_URL } from "@/shared/config/api.ts";
import { $headers } from "@/shared/tokens";

interface ISubscription {
  companyId: string;
  planId: string;
}

interface CreateSubscriptionResponse {
  paymentUrl: string;
}

const createSubscriptionFx = createEffect<
  { headers: Record<string, string>; data: ISubscription },
  CreateSubscriptionResponse
>(async ({ headers, data }) => {
  const url = new URL("/api/subscriptions/create", API_BASE_URL);

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
    throw new Error(errorData.message || "Ошибка при создании подписки");
  }

  const responseData: CreateSubscriptionResponse = await response.json();
  return responseData;
});

export const createSubscriptionMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (data: ISubscription, headers: Record<string, string>) => ({
      headers,
      data,
    }),
    effect: createSubscriptionFx,
  }),
});

sample({
  clock: createSubscriptionMutation.finished.failure,
  fn: (response) => console.log("Subscription creation failure", response),
});
