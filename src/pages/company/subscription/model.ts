import { createEvent, createStore, sample } from "effector";

import { createSubscriptionMutation, getSubscriptionsAllQuery } from "@/shared/api/subscriptions";
import { routes } from "@/shared/routing";
import { ICompanySubscription, ISubscription } from "@/shared/types/subscription.interface.ts";
import { $viewer } from "@/shared/viewer";

export const currentRoute = routes.company.subscription;

export const subscriptionClicked = createEvent<{ planId: string }>();
export const subscriptionCancelCkicked = createEvent();
export const $subscriptions = createStore<ISubscription[]>([]);
// const $pending = or(createSubscriptionMutation.$pending, getSubscriptionsAllQuery.$pending);

export const $latestSubscription = $viewer.map((viewer) => {
  if (
    !viewer ||
    !viewer.company ||
    !viewer.company.subscriptions ||
    viewer.company.subscriptions.length === 0
  ) {
    return null;
  }

  return viewer.company.subscriptions.reduce(
    (latest, current) => {
      if (!latest || (current.endDate && current.endDate > latest.endDate)) {
        return current;
      }
      return latest;
    },
    null as ICompanySubscription | null,
  );
});

sample({
  clock: currentRoute.opened,
  fn: () => ({}),
  target: getSubscriptionsAllQuery.start,
});

sample({
  clock: getSubscriptionsAllQuery.finished.success,
  fn: ({ result }) => result,
  target: $subscriptions,
});

sample({
  clock: subscriptionClicked,
  source: currentRoute.$params,
  fn: ({ companyId }, { planId }) => ({ planId, companyId }),
  target: createSubscriptionMutation.start,
});

sample({
  clock: createSubscriptionMutation.finished.success,
  fn: ({ result }) => console.log("Success", result),
});
