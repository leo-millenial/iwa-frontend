import { createMutation } from "@farfetched/core";
import { attach, createEffect, sample } from "effector";

import { $headers } from "@/shared/tokens";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";

const createVacancyFx = createEffect<
  { headers: Record<string, string>; data: IVacancy },
  Omit<IVacancy, "_id">
>(async ({ headers, data }) => {
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
  return responseData;
});

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

sample({
  clock: createVacancyMutation.finished.failure,
  fn: (response) => console.log("Vacancy created failure", response),
});
