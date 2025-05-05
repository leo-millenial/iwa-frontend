import { createMutation } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";
import { ICompany } from "@/shared/types/company.interface.ts";

type UpdateCompanyResponse = {
  success: boolean;
  company: ICompany;
};

const updateCompanyFx = createEffect<
  { headers: Record<string, string>; data: Partial<ICompany>; id: string },
  UpdateCompanyResponse,
  Error
>(async ({ headers, data, id }) => {
  const url = new URL(`/api/companies/update/${id}`, window.location.origin);

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
    throw new Error(errorData.message || "Ошибка при обновлении компании");
  }

  const responseData = (await response.json()) as UpdateCompanyResponse;
  return responseData;
});

export const updateCompanyMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (
      params: { data: Partial<ICompany>; id: string },
      headers: Record<string, string>,
    ) => ({
      headers,
      data: params.data,
      id: params.id,
    }),
    effect: updateCompanyFx,
  }),
});
