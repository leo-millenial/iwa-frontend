import { createQuery } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";

const getVacanciesByCompanyIdFx = createEffect<
  { headers: Record<string, string>; companyId: string },
  IVacancy[]
>(async ({ headers, companyId }) => {
  const url = `/api/vacancy/by-company/${companyId}`;

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Ошибка при получении вакансий: ${response.status}`);
  }

  const data = await response.json();
  return data;
});

export const getVacanciesByCompanyIdQuery = createQuery({
  effect: attach({
    source: $headers,
    mapParams: (companyId: string, headers: Record<string, string>) => ({
      headers,
      companyId,
    }),
    effect: getVacanciesByCompanyIdFx,
  }),
});
