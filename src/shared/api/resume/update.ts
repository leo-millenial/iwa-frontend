import { createMutation } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";
import { IResume } from "@/shared/types/resume.interface.ts";

const updateResumeFx = createEffect<
  { headers: Record<string, string>; id: string; data: Partial<IResume> },
  { resume: IResume }
>(async ({ headers, id, data }) => {
  const url = new URL(`/api/resume/update/${id}`, window.location.origin);

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
    throw new Error(errorData.message || "Ошибка при обновлении резюме");
  }

  return await response.json();
});

export const updateResumeMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (
      params: { id: string; data: Partial<IResume> },
      headers: Record<string, string>,
    ) => ({
      headers,
      id: params.id,
      data: params.data,
    }),
    effect: updateResumeFx,
  }),
});
