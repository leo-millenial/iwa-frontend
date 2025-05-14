import { createMutation } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { API_BASE_URL } from "@/shared/config/api.ts";
import { $headers } from "@/shared/tokens";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";

const updateVacancyFx = createEffect<
  { headers: Record<string, string>; data: Partial<IVacancy>; companyId: string; id: string },
  IVacancy
>(async ({ headers, data, companyId, id }) => {
  const url = new URL(`/api/vacancy/by-company/${companyId}/vacancy/${id}`, API_BASE_URL);

  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при обновлении вакансии");
  }

  const responseData = await response.json();
  return responseData;
});

export const updateVacancyMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (
      params: { data: Partial<IVacancy>; companyId: string; id: string },
      headers: Record<string, string>,
    ) => ({
      headers,
      data: params.data,
      companyId: params.companyId,
      id: params.id,
    }),
    effect: updateVacancyFx,
  }),
});
