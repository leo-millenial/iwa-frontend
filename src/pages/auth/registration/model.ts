import { createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/local";
import { not } from "patronum";
import { z } from "zod";

import { startRegistrationMutation } from "@/shared/api/registration";
import { appStarted } from "@/shared/init";
import { routes } from "@/shared/routing";
import { UserRole } from "@/shared/types/user.interface.ts";

export const currentRoute = routes.auth.registration;

export type AuthRegistrationStartPageError =
  | null
  | "INVALID_EMAIL"
  | "PASSWORD_TOO_SHORT"
  | "PASSWORD_NO_UPPERCASE"
  | "PASSWORD_NO_LOWERCASE"
  | "PASSWORD_NO_DIGIT"
  | "PASSWORDS_DO_NOT_MATCH";

export enum RegistrationStep {
  Initial = 0,
  EmailSucceed,
  FullNameSucceed,
  SmsSendSucceed,
  SmsVerifySucceed,
  SendDataSucceed,
}

const SESSION_STORAGE_KEY = "registration_session_id";

export const nextClicked = createEvent();
export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const confirmPasswordChanged = createEvent<string>();
export const roleChanged = createEvent<UserRole>();
export const registrationResponseSucceed = createEvent<{
  currentStep: number;
  sessionId: string;
}>();

export const setError = createEvent<AuthRegistrationStartPageError>();
export const pickupSessionId = createEvent<string>();

export const $role = createStore<UserRole>(UserRole.Company);
export const $email = createStore("");
export const $password = createStore("");
export const $confirmPassword = createStore("");
export const $completedStep = createStore<RegistrationStep>(RegistrationStep.Initial);
export const $sessionId = createStore("");
export const $error = createStore<AuthRegistrationStartPageError>(null);
export const $pending = startRegistrationMutation.$pending;

$email.on(emailChanged, (_, email) => email);
$password.on(passwordChanged, (_, password) => password);
$confirmPassword.on(confirmPasswordChanged, (_, confirmPassword) => confirmPassword);
$role.on(roleChanged, (_, role) => role);
$error.on(setError, (_, error) => error);
$completedStep.on(registrationResponseSucceed, (_, { currentStep }) => currentStep);
$sessionId.on(registrationResponseSucceed, (_, { sessionId }) => sessionId);
$sessionId.on(pickupSessionId, (_, sessionId) => sessionId);

$error.reset([emailChanged, passwordChanged, confirmPasswordChanged]);

const emailSchema = z.string().min(1, "Email обязателен").email("Введите корректный email");

sample({
  clock: nextClicked,
  source: { email: $email, password: $password, confirmPassword: $confirmPassword },
  fn: ({ email, password, confirmPassword }) => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      return "INVALID_EMAIL" as const;
    }

    if (password.length < 8) {
      return "PASSWORD_TOO_SHORT" as const;
    }

    if (!/[A-Z]/.test(password)) {
      return "PASSWORD_NO_UPPERCASE" as const;
    }

    if (!/[a-z]/.test(password)) {
      return "PASSWORD_NO_LOWERCASE" as const;
    }

    if (!/[0-9]/.test(password)) {
      return "PASSWORD_NO_DIGIT" as const;
    }

    if (password !== confirmPassword) {
      return "PASSWORDS_DO_NOT_MATCH" as const;
    }

    return null;
  },
  target: setError,
});

sample({
  clock: nextClicked,
  source: { role: $role, email: $email, password: $password },
  filter: not($error),
  target: startRegistrationMutation.start,
});

sample({
  clock: startRegistrationMutation.finished.success,
  fn: ({ result }) => ({
    currentStep: result.currentStep,
    sessionId: result.sessionId,
  }),
  target: registrationResponseSucceed,
});

sample({
  clock: $completedStep,
  filter: (step) => step === RegistrationStep.EmailSucceed,
  target: routes.auth.registrationFlow.fullName.open,
});

persist({
  store: $sessionId,
  key: SESSION_STORAGE_KEY,
  pickup: pickupSessionId,
});

sample({
  clock: appStarted,
  fn: () => {
    const savedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    return savedSessionId ? JSON.parse(savedSessionId) : "";
  },
  target: pickupSessionId,
});
