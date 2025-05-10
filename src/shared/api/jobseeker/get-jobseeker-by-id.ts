import { createQuery } from "@farfetched/core";
import { attach, createEffect, sample } from "effector";

import { $headers } from "@/shared/tokens";
import { IJobseeker } from "@/shared/types/jobseeker.interface";

const getJobseekerByIdFx = createEffect<
  { headers: Record<string, string>; jobseekerId: string },
  IJobseeker
>(async ({ headers, jobseekerId }) => {
  const url = `/api/jobseeker/${jobseekerId}`;

  if (!jobseekerId) {
    throw new Error("ID соискателя не указан");
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Ошибка при получении информации о соискателе: ${response.status}`);
  }

  const data = (await response.json()) as IJobseeker;
  return data;
});

export const getJobseekerByIdQuery = createQuery({
  effect: attach({
    source: $headers,
    mapParams: (jobseekerId: string, headers: Record<string, string>) => ({
      headers,
      jobseekerId,
    }),
    effect: getJobseekerByIdFx,
  }),
});

sample({
  clock: getJobseekerByIdQuery.finished.failure,
  fn: (response) => console.log("Jobseeker fetch failure", response),
});
