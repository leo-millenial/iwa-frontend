import { createStore, sample } from "effector";

import { getResumeByIdQuery } from "@/shared/api/resume/get-by-id.ts";
import { routes } from "@/shared/routing";
import { IResume } from "@/shared/types/resume.interface.ts";

export const currentRoute = routes.jobseeker.resume.view;

export const $resume = createStore<IResume | null>(null);

$resume.on(getResumeByIdQuery.finished.success, (_, { result }) => result);

sample({
  clock: currentRoute.opened,
  source: currentRoute.$params,
  fn: ({ resumeId }) => resumeId,
  target: getResumeByIdQuery.start,
});
