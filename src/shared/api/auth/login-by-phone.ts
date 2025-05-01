import { createMutation } from "@farfetched/core";
import { zodContract } from "@farfetched/zod";
import { createEffect, sample } from "effector";
import { z } from "zod";

import { setToken } from "@/shared/tokens";

interface LoginByPhoneParams {
  phone: string;
  password: string;
}

// Схема для ответа - refresh_token необязательный, так как он может быть только в куки
const loginByPhoneResponseSchema = z.object({
  access_token: z.string(),
});

const loginByPhoneFx = createEffect(async (params: LoginByPhoneParams) => {
  const response = await fetch("/api/auth/login-by-phone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Access token is missing in the response");
  }

  return {
    access_token: data.access_token,
  };
});

export const loginByPhoneMutation = createMutation({
  effect: loginByPhoneFx,
  contract: zodContract(loginByPhoneResponseSchema),
});

sample({
  clock: loginByPhoneMutation.finished.success,
  fn: ({ result }) => {
    return { access_token: result.access_token };
  },
  target: setToken,
});
