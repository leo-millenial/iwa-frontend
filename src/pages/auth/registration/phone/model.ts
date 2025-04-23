import { createEffect, createEvent, createStore, sample } from "effector";
import { debug } from "patronum";
import { z } from "zod";

import {
  $completedStep,
  $sessionId,
  RegistrationStep,
  registrationResponseSucceed,
} from "@/pages/auth/registration/model.ts";

import { step3Mutation } from "@/shared/api/registration";
import { routes } from "@/shared/routing";

export const currentRoute = routes.auth.registrationFlow.phone;

export type PhoneError = "PHONE_REQUIRED" | "PHONE_INVALID_FORMAT" | null;

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

const getSessionIdFx = createEffect(() => {
  // Пытаемся получить sessionId из localStorage
  const sessionId = localStorage.getItem("sessionId");
  console.log("GET SESSION ID FROM STORAGE: ", sessionId);
  return sessionId;
});

sample({
  clock: nextClicked,
  source: $sessionId,
  filter: (sessionId) => !sessionId,
  target: getSessionIdFx,
});

sample({
  clock: getSessionIdFx.doneData,
  filter: Boolean,
  target: $sessionId,
});

debug({ $sessionLoaded });
debug({ $sessionId });
debug({ nextClicked });

$sessionId.watch((id) => {
  console.log("SESSION ID ", id);
  console.log("TYPEOF SESSION ID ", typeof id);
});

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
  source: { phone: $normalizedPhone, sessionId: $sessionId, error: $error },
  filter: ({ sessionId, error }) => {
    console.log("FILTER - SESSION ID: ", sessionId);
    console.log("FILTER - ERROR: ", error);
    console.log("FILTER - SESSION ID EXISTS: ", Boolean(sessionId));
    console.log("FILTER - NO ERROR: ", !error);
    const canProceed = Boolean(sessionId) && !error;
    console.log("FILTER RESULT: ", canProceed);
    return canProceed;
  },
  fn: ({ phone, sessionId }) => {
    console.log("PHONE ", phone);
    console.log("SESSION ID ", sessionId);
    return { phone, sessionId };
  },
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
