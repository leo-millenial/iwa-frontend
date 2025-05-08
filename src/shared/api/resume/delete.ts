import { createMutation } from "@farfetched/core";
import { attach, createEffect } from "effector";

import { $headers } from "@/shared/tokens";

const deleteResumeFx = createEffect<{ headers: Record<string, string>; id: string }, void>(
  async ({ headers, id }) => {
    const url = new URL(`/api/resume/delete/${id}`, window.location.origin);

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при удалении резюме");
    }
  },
);

export const deleteResumeMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (params: { id: string }, headers: Record<string, string>) => ({
      headers,
      id: params.id,
    }),
    effect: deleteResumeFx,
  }),
});
