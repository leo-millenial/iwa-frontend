import { createMutation } from "@farfetched/core";
import { attach, createEffect, sample } from "effector";

import { $headers } from "@/shared/tokens";
import { IResume } from "@/shared/types/resume.interface.ts";

interface BodyData extends Omit<IResume, "_id"> {
  jobseekerId: string;
}

const createResumeFx = createEffect<
  { headers: Record<string, string>; data: BodyData },
  Omit<IResume, "_id">
>(async ({ headers, data }) => {
  const url = new URL("/api/resume/create", window.location.origin);

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
    throw new Error(errorData.message || "Ошибка при создании резюме");
  }

  const responseData = await response.json();
  return responseData;
});

export const createResumeMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (data: IResume, headers: Record<string, string>) => ({
      headers,
      data,
    }),
    effect: createResumeFx,
  }),
});

sample({
  clock: createResumeMutation.finished.failure,
  fn: (response) => console.log("Resume creation failure", response),
});
