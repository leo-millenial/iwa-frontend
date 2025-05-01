import { createQuery } from "@farfetched/core";
import { attach, createEffect, sample } from "effector";

import { $headers } from "@/shared/tokens";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";

const getVacancyByIdFx = createEffect<
  { headers: Record<string, string>; vacancyId: string },
  IVacancy
>(async ({ headers, vacancyId }) => {
  const url = `/api/vacancy/${vacancyId}`;

  if (!vacancyId) {
    throw new Error("ID вакансии не указан");
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Ошибка при получении вакансии: ${response.status}`);
  }

  const data = await response.json();
  return data;
});

export const getVacancyByIdQuery = createQuery({
  effect: attach({
    source: $headers,
    mapParams: (vacancyId: string, headers: Record<string, string>) => ({
      headers,
      vacancyId,
    }),
    effect: getVacancyByIdFx,
  }),
});

sample({
  clock: getVacancyByIdQuery.finished.failure,
  fn: (response) => console.log("Vacancy created failure", response),
});
