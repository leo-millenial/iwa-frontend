import { createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/session";
import { and, not } from "patronum";
import { z } from "zod";

import {
  $completedStep,
  $sessionId,
  RegistrationStep,
  registrationResponseSucceed,
} from "@/pages/auth/registration/model.ts";

import { step2Mutation } from "@/shared/api/registration";
import { routes } from "@/shared/routing";

export type FullNameError =
  | null
  | "FIRST_NAME_REQUIRED"
  | "FIRST_NAME_TOO_SHORT"
  | "FIRST_NAME_TOO_LONG"
  | "LAST_NAME_REQUIRED"
  | "LAST_NAME_TOO_SHORT"
  | "LAST_NAME_TOO_LONG";

export const FIRST_NAME_SESSION_KEY = "registration_firstName";
export const LAST_NAME_SESSION_KEY = "registration_lastName";

export const currentRoute = routes.auth.registrationFlow.fullName;
export const nextClicked = createEvent();

export const firstNameChanged = createEvent<string>();
export const lastNameChanged = createEvent<string>();

export const $firstName = createStore("");
export const $lastName = createStore("");
export const $error = createStore<FullNameError>(null);
export const $pending = step2Mutation.$pending;

$firstName.on(firstNameChanged, (_, firstName) => firstName);
$lastName.on(lastNameChanged, (_, lastName) => lastName);

persist({
  key: FIRST_NAME_SESSION_KEY,
  store: $firstName,
});

persist({
  key: LAST_NAME_SESSION_KEY,
  store: $lastName,
});

$error.reset([firstNameChanged, lastNameChanged]);

const firstNameSchema = z
  .string()
  .min(1, "Имя обязательно")
  .min(2, "Имя должно содержать минимум 2 символа")
  .max(50, "Имя не должно превышать 50 символов");

const lastNameSchema = z
  .string()
  .min(1, "Фамилия обязательна")
  .min(2, "Фамилия должна содержать минимум 2 символа")
  .max(50, "Фамилия не должна превышать 50 символов");

sample({
  clock: nextClicked,
  source: { firstName: $firstName, lastName: $lastName },
  fn: ({ firstName, lastName }) => {
    const firstNameResult = firstNameSchema.safeParse(firstName);
    if (!firstNameResult.success) {
      const error = firstNameResult.error.errors[0];
      if (error.message === "Имя обязательно") {
        return "FIRST_NAME_REQUIRED" as const;
      }
      if (error.message === "Имя должно содержать минимум 2 символа") {
        return "FIRST_NAME_TOO_SHORT" as const;
      }
      if (error.message === "Имя не должно превышать 50 символов") {
        return "FIRST_NAME_TOO_LONG" as const;
      }
    }

    const lastNameResult = lastNameSchema.safeParse(lastName);
    if (!lastNameResult.success) {
      const error = lastNameResult.error.errors[0];
      if (error.message === "Фамилия обязательна") {
        return "LAST_NAME_REQUIRED" as const;
      }
      if (error.message === "Фамилия должна содержать минимум 2 символа") {
        return "LAST_NAME_TOO_SHORT" as const;
      }
      if (error.message === "Фамилия не должна превышать 50 символов") {
        return "LAST_NAME_TOO_LONG" as const;
      }
    }

    return null;
  },
  target: $error,
});
sample({
  clock: nextClicked,
  source: { firstName: $firstName, lastName: $lastName, sessionId: $sessionId },
  filter: and($sessionId, not($error)),
  target: step2Mutation.start,
});

sample({
  clock: nextClicked,
  filter: not($sessionId),
  target: routes.auth.registration.open,
});

sample({
  clock: step2Mutation.finished.success,
  fn: ({ result }) => ({
    currentStep: result.currentStep,
    sessionId: result.sessionId,
  }),
  target: registrationResponseSucceed,
});

sample({
  clock: $completedStep,
  filter: (step) => step === RegistrationStep.FullNameSucceed,
  fn: () => ({}),
  target: routes.auth.registrationFlow.phone.open,
});

sample({
  clock: currentRoute.closed,
  target: $error.reinit,
});
