import { createQuery } from "@farfetched/core";
import { attach, createEffect, sample } from "effector";

import { $headers } from "@/shared/tokens";
import { IResume } from "@/shared/types/resume.interface.ts";

const getResumeByIdFx = createEffect<
  { headers: Record<string, string>; resumeId: string },
  IResume
>(async ({ headers, resumeId }) => {
  const url = `/api/resume/${resumeId}`;

  if (!resumeId) {
    throw new Error("ID резюме не указан");
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Ошибка при получении резюме: ${response.status}`);
  }

  const data = await response.json();
  return data;
});

export const getResumeByIdQuery = createQuery({
  effect: attach({
    source: $headers,
    mapParams: (resumeId: string, headers: Record<string, string>) => ({
      headers,
      resumeId,
    }),
    effect: getResumeByIdFx,
  }),
});

sample({
  clock: getResumeByIdQuery.finished.failure,
  fn: (response) => console.log("Resume fetch failure", response),
});
