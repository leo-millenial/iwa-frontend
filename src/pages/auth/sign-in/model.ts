import { invoke } from "@withease/factories";
import { createEvent, createStore, sample } from "effector";

import { loginByPhoneMutation } from "@/shared/api/auth";
import { getMeQuery } from "@/shared/api/user";
import { createPhoneValidation } from "@/shared/lib/phone";
import { routes } from "@/shared/routing";
import { UserRole } from "@/shared/types/user.interface.ts";

export const currentRoute = routes.auth.signIn;

export const formSubmitted = createEvent();
export const passwordChanged = createEvent<string>();

export const $password = createStore("");
export const $pending = getMeQuery.$pending;

const { phoneChanged, $normalizedPhone } = invoke(createPhoneValidation);

$password.on(passwordChanged, (_, value) => value);

sample({
  clock: formSubmitted,
  source: { phone: $normalizedPhone, password: $password },
  target: loginByPhoneMutation.start,
});

sample({
  clock: loginByPhoneMutation.finished.success,
  target: getMeQuery.start,
});

sample({
  clock: getMeQuery.finished.success,
  filter: ({ result }) =>
    Boolean(result.user && result.user.role === UserRole.Jobseeker && result.jobseeker),
  fn: ({ result }) => ({ jobseekerId: result.jobseeker!._id }),
  target: routes.jobseeker.search.open,
});

sample({
  clock: getMeQuery.finished.success,
  filter: ({ result }) =>
    Boolean(result.user && result.user.role === UserRole.Company && result.company),
  fn: ({ result }) => ({ companyId: result.company!._id }),
  target: routes.company.search.open,
});

sample({
  clock: getMeQuery.finished.failure,
  fn: (r) => console.log("GetMe query failed", r),
});

export { $normalizedPhone, phoneChanged };
