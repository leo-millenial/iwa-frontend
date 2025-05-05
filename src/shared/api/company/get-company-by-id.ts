import { createQuery } from "@farfetched/core";
import { attach, createEffect, sample } from "effector";

import { $headers } from "@/shared/tokens";
import { ICompany } from "@/shared/types/company.interface";

const getCompanyByIdFx = createEffect<
  { headers: Record<string, string>; companyId: string },
  ICompany
>(async ({ headers, companyId }) => {
  const url = `/api/companies/${companyId}`;

  if (!companyId) {
    throw new Error("ID компании не указан");
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Ошибка при получении информации о компании: ${response.status}`);
  }

  const data = (await response.json()) as ICompany;
  return data;
});

export const getCompanyByIdQuery = createQuery({
  effect: attach({
    source: $headers,
    mapParams: (companyId: string, headers: Record<string, string>) => ({
      headers,
      companyId,
    }),
    effect: getCompanyByIdFx,
  }),
});

sample({
  clock: getCompanyByIdQuery.finished.failure,
  fn: (response) => console.log("Company fetch failure", response),
});
