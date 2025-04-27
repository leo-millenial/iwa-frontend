import { createEvent, createStore, sample } from "effector";
import { interval, reset } from "patronum";

import { getMeQuery } from "@/shared/api/user";
import { routes } from "@/shared/routing";
import { UserRole } from "@/shared/types/user.interface.ts";

export const currentRoute = routes.auth.finish;

export const startCountdown = createEvent();
export const stopCountdown = createEvent();

export const $countdownSeconds = createStore(4);
export const $countdownFinished = createStore(false);
export const $queryFinished = createStore(false);

const { tick } = interval({
  timeout: 1_000, // 1 секунда
  start: startCountdown,
  stop: stopCountdown,
});

$countdownSeconds.on(tick, (count) => Math.max(0, count - 1));

sample({
  source: $countdownSeconds,
  filter: (count) => count === 0,
  fn: () => true,
  target: [$countdownFinished, stopCountdown],
});

sample({
  clock: currentRoute.opened,
  target: [getMeQuery.start, startCountdown],
});

$queryFinished.on(getMeQuery.finished.success, () => true);

const $readyToRedirect = createStore(false)
  .on($countdownFinished, (_, countdownFinished) => countdownFinished && $queryFinished.getState())
  .on($queryFinished, (_, queryFinished) => queryFinished && $countdownFinished.getState());

sample({
  clock: $readyToRedirect,
  source: getMeQuery.finished.success,
  filter: (response, ready) =>
    ready &&
    Boolean(
      response.result.user &&
        response.result.user.role === UserRole.Jobseeker &&
        response.result.jobseeker,
    ),
  fn: ({ result }) => ({ jobseekerId: result.jobseeker!._id }),
  target: routes.jobseeker.search.open,
});

sample({
  clock: $readyToRedirect,
  source: getMeQuery.finished.success,
  filter: (response, ready) =>
    ready &&
    Boolean(
      response.result.user &&
        response.result.user.role === UserRole.Company &&
        response.result.company,
    ),
  fn: ({ result }) => ({ companyId: result.company!._id }),
  target: routes.company.search.open,
});

reset({
  clock: currentRoute.closed,
  target: [$countdownSeconds, $countdownFinished, $queryFinished, $readyToRedirect],
});
