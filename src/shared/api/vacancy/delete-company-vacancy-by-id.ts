import { createMutation } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";

const deleteVacancyFx = createEffect<
  { headers: Record<string, string>; companyId: string; id: string },
  void
>(async ({ headers, companyId, id }) => {
  const url = new URL(`/api/vacancy/delete/${id}`, window.location.origin);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ companyId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при удалении вакансии");
  }
});

export const deleteVacancyMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (params: { companyId: string; id: string }, headers: Record<string, string>) => ({
      headers,
      companyId: params.companyId,
      id: params.id,
    }),
    effect: deleteVacancyFx,
  }),
});
