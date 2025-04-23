import { createEvent, createStore, sample } from "effector";
import { and, not } from "patronum";

import {
  $completedStep,
  $role,
  $sessionId,
  RegistrationStep,
  registrationResponseSucceed,
} from "@/pages/auth/registration/model.ts";

import { sendSmsMutation, verifySmsMutation } from "@/shared/api/registration";
import { routes } from "@/shared/routing";
import { UserRole } from "@/shared/types/user.interface.ts";

export const currentRoute = routes.auth.registrationFlow.confirmPhone;

export const confirmClicked = createEvent();
export const codeChanged = createEvent<string>();
export const verificationSucceeded = createEvent<UserRole>();

export const $code = createStore("");

$code.on(codeChanged, (_, code) => code);

sample({
  clock: currentRoute.opened,
  source: { sessionId: $sessionId },
  filter: and(not(sendSmsMutation.$pending), $sessionId),
  target: sendSmsMutation.start,
});

sample({
  clock: confirmClicked,
  source: { code: $code, sessionId: $sessionId },
  target: verifySmsMutation.start,
});

sample({
  clock: verifySmsMutation.finished.success,
  fn: ({ result }) => ({
    currentStep: result.currentStep,
    sessionId: result.sessionId,
  }),
  target: registrationResponseSucceed,
});

sample({
  clock: $completedStep,
  source: $role,
  filter: (_, step) => step === RegistrationStep.SmsVerifySucceed,
  target: verificationSucceeded,
});

sample({
  clock: verificationSucceeded,
  source: $role,
  filter: (role) => role === UserRole.Company,
  target: routes.auth.registrationFlow.company.about.open,
});

sample({
  clock: verificationSucceeded,
  source: $role,
  filter: (role) => role === UserRole.Jobseeker,
  target: routes.auth.registrationFlow.jobseeker.about.open,
});
