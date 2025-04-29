import { createMutation } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";

const createVacancyFx = createEffect<{ headers: Record<string, string>; data: IVacancy }, IVacancy>(
  async ({ headers, data }) => {
    const url = new URL("/api/vacancy/create", window.location.origin);

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
      throw new Error(errorData.message || "Ошибка при создании вакансии");
    }

    const responseData = await response.json();
    return responseData as IVacancy;
  },
);

export const createVacancyMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (data: IVacancy, headers: Record<string, string>) => ({
      headers,
      data,
    }),
    effect: createVacancyFx,
  }),
});
