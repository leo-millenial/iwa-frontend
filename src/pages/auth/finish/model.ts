import { createEvent, createStore, sample } from "effector";
import { and, interval, reset } from "patronum";

import { getMeQuery } from "@/shared/api/user";
import { routes } from "@/shared/routing";
import { UserRole } from "@/shared/types/user.interface";

export const currentRoute = routes.auth.finish;

export const startCountdown = createEvent();
export const stopCountdown = createEvent();

export const $countdownSeconds = createStore(4);
export const $countdownFinished = createStore(false);
export const $queryFinished = createStore(false);

const { tick } = interval({
  timeout: 1_000,
  start: startCountdown,
  stop: stopCountdown,
});

$countdownSeconds.on(tick, (seconds) => Math.max(0, seconds - 1));

sample({
  source: $countdownSeconds,
  filter: (seconds) => seconds === 0,
  fn: () => true,
  target: [$countdownFinished, stopCountdown],
});

sample({
  clock: currentRoute.opened,
  target: [getMeQuery.start, startCountdown],
});

$queryFinished.on(getMeQuery.finished.success, () => true);

const $readyToRedirect = and($countdownFinished, $queryFinished);

sample({
  clock: $readyToRedirect,
  source: getMeQuery.finished.success,
  filter: ({ result }) => result.user?.role === UserRole.Jobseeker && Boolean(result.jobseeker),
  fn: ({ result }) => ({ params: { jobseekerId: result.jobseeker!._id } }),
  target: routes.jobseeker.profile.open,
});

sample({
  clock: $readyToRedirect,
  source: getMeQuery.finished.success,
  filter: ({ result }) => result.user?.role === UserRole.Company && Boolean(result.company),
  fn: ({ result }) => ({ params: { companyId: result.company!._id } }),
  target: routes.company.profile.open,
});

sample({
  clock: getMeQuery.finished.failure,
  fn: () => ({}),
  target: routes.home.open,
});

reset({
  clock: currentRoute.closed,
  target: [$countdownSeconds, $countdownFinished, $queryFinished],
});
