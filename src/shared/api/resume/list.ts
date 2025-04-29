import { createQuery } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";
import { IResume, ResumeSearchParams } from "@/shared/types/resume.interface.ts";

// Создаем эффект для запроса списка резюме
const getResumeListFx = createEffect<
  { headers: Record<string, string>; params?: ResumeSearchParams },
  IResume[]
>(async ({ headers, params }) => {
  // Формируем URL с параметрами запроса
  const url = new URL("/api/resume/list", window.location.origin);

  // Добавляем параметры в URL, если они определены
  if (params) {
    if (params.query) url.searchParams.append("query", params.query);
    if (params.city) url.searchParams.append("city", params.city);
    if (params.experience) url.searchParams.append("experience", params.experience);
    if (params.employmentTypes && params.employmentTypes.length > 0) {
      // Вместо добавления каждого типа отдельно, передаем массив как JSON-строку
      url.searchParams.append("employmentTypes", JSON.stringify(params.employmentTypes));
    }
    if (params.salaryMin) url.searchParams.append("salaryMin", params.salaryMin.toString());
    if (params.salaryMax) url.searchParams.append("salaryMax", params.salaryMax.toString());
    if (params.skills) url.searchParams.append("skills", params.skills);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  const data = await response.json();

  return data as IResume[];
});

export const getResumeListQuery = createQuery({
  effect: attach({
    source: $headers,
    mapParams: (params: ResumeSearchParams | undefined, headers: Record<string, string>) => ({
      headers,
      params,
    }),
    effect: getResumeListFx,
  }),
});
