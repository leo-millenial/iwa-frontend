import { createEvent, createStore, sample } from "effector";
import { and, not } from "patronum";
import { z } from "zod";

import {
  $completedStep,
  $sessionId,
  RegistrationStep,
  registrationResponseSucceed,
} from "@/pages/auth/registration/model.ts";

import { step3Mutation } from "@/shared/api/registration";
import { routes } from "@/shared/routing";
import { PhoneError } from "@/shared/ui/phone-input.tsx";

export const currentRoute = routes.auth.registrationFlow.phone;

const phoneSchema = z
  .string()
  .min(1, { message: "PHONE_REQUIRED" })
  .regex(/^(\+7|7|8)?[\s-]?\(?[9][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/, {
    message: "PHONE_INVALID_FORMAT",
  });

export const nextClicked = createEvent();
export const phoneChanged = createEvent<string>();

export const $phone = createStore("");
export const $error = createStore<PhoneError>(null);
export const $pending = step3Mutation.$pending;

export const $sessionLoaded = $sessionId.map((id) => Boolean(id));
const $canProceed = and($sessionLoaded, not($error));

export const $normalizedPhone = $phone.map((raw) => raw.replace(/\D/g, ""));

$phone.on(phoneChanged, (_, phone) => phone);

sample({
  clock: nextClicked,
  source: $normalizedPhone,
  fn: (phone) => {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return result.error.errors[0].message as PhoneError;
    }
    return null;
  },
  target: $error,
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
  target: routes.auth.registrationFlow.confirmPhone.open,
});

sample({
  clock: phoneChanged,
  target: $error.reinit,
});

sample({
  clock: step3Mutation.finished.failure,
  target: routes.auth.registration.open,
});
