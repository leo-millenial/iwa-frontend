import { invoke } from "@withease/factories";
import { createEvent, createStore, sample } from "effector";

import { loginByPhoneMutation } from "@/shared/api/auth";
import { getMeQuery } from "@/shared/api/user";
import { createPhoneValidation } from "@/shared/lib/phone";
import { showErrorToast } from "@/shared/lib/toast";
import { routes } from "@/shared/routing";
import { UserRole } from "@/shared/types/user.interface.ts";

export const currentRoute = routes.auth.signIn;

export const formSubmitted = createEvent();
export const passwordChanged = createEvent<string>();

export const $password = createStore("");
export const $pending = getMeQuery.$pending;
export const $error = createStore<string | null>(null);

const { phoneChanged, $normalizedPhone } = invoke(createPhoneValidation);

$password.on(passwordChanged, (_, value) => value);

$error.reset(phoneChanged, passwordChanged);

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
  clock: loginByPhoneMutation.finished.failure,
  fn: ({ error }) => {
    if (typeof error === "object" && error !== null && "message" in error) {
      try {
        if (typeof error.message === "string" && error.message.includes('{"message":')) {
          const errorData = JSON.parse(error.message.substring(error.message.indexOf("{")));
          return errorData.message || "Неверный номер телефона или пароль";
        }
      } catch (e) {
        console.error("Failed to parse error message", e);
      }
      return error.message as string;
    }
    return "Ошибка проверки авторизации";
  },
  target: $error,
});

sample({
  clock: loginByPhoneMutation.$failed,
  source: $error,
  fn: (message) => ({
    message: "Ошибка!",
    description: message,
  }),
  target: showErrorToast,
});

sample({
  clock: getMeQuery.finished.success,
  filter: ({ result }) =>
    Boolean(result.user && result.user.role === UserRole.Jobseeker && result.jobseeker),
  fn: ({ result }) => ({ params: { jobseekerId: result.jobseeker!._id } }),
  target: routes.jobseeker.search.open,
});

sample({
  clock: getMeQuery.finished.success,
  filter: ({ result }) =>
    Boolean(result.user && result.user.role === UserRole.Company && result.company),
  fn: ({ result }) => ({ params: { companyId: result.company!._id } }),
  target: routes.company.search.open,
});

sample({
  clock: getMeQuery.finished.failure,
  fn: (r) => console.log("GetMe query failed", r),
});

export { $normalizedPhone, phoneChanged };
