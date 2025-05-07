import { invoke } from "@withease/factories";
import { createEvent, sample } from "effector";
import { and, not } from "patronum";

import {
  $completedStep,
  $sessionId,
  RegistrationStep,
  registrationResponseSucceed,
} from "@/pages/auth/registration/model.ts";

import { step3Mutation } from "@/shared/api/registration";
import { createPhoneValidation } from "@/shared/lib/phone/phone-validation";
import { routes } from "@/shared/routing";

export const currentRoute = routes.auth.registrationFlow.phone;

export const nextClicked = createEvent();

const { phoneChanged, validatePhone, $error, $normalizedPhone } = invoke(createPhoneValidation);

export const $pending = step3Mutation.$pending;
export const $sessionLoaded = $sessionId.map((id) => Boolean(id));
const $canProceed = and($sessionLoaded, not($error), $normalizedPhone);

sample({
  clock: nextClicked,
  target: validatePhone,
});

sample({
  clock: nextClicked,
  source: { phone: $normalizedPhone, sessionId: $sessionId },
  filter: $canProceed,
  target: step3Mutation.start,
});

sample({
  clock: step3Mutation.finished.success,
  fn: ({ result }) => ({
    currentStep: result.currentStep,
    sessionId: result.sessionId,
  }),
  target: registrationResponseSucceed,
});

sample({
  clock: $completedStep,
  filter: (step) => step === RegistrationStep.SmsSendSucceed,
  fn: () => ({}),
  target: routes.auth.registrationFlow.confirmPhone.open,
});

sample({
  clock: step3Mutation.finished.failure,
  fn: () => ({}),
  target: routes.auth.registration.open,
});

export { phoneChanged, $error, $normalizedPhone };
