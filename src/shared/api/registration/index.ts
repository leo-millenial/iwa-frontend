import { createMutation } from "@farfetched/core";
import { zodContract } from "@farfetched/zod";
import { createEffect } from "effector";
import { z } from "zod";

import {
  registrationControllerCompleteRegistration,
  registrationControllerProcessStep2,
  registrationControllerProcessStep3,
  registrationControllerProcessStep5,
  registrationControllerSendSmsCode,
  registrationControllerStartRegistration,
  registrationControllerVerifySmsCode,
} from "@/shared/api/__generated__/sdk.gen";
import {
  zRegistrationControllerStartRegistrationResponse,
  zRegistrationSendSmsDto,
  zRegistrationStep1Dto,
  zRegistrationStep2Dto,
  zRegistrationStep3Dto,
  zRegistrationStep5Dto,
  zRegistrationVerifySmsDto,
} from "@/shared/api/__generated__/zod.gen";

const startRegistrationFx = createEffect(async (data: z.infer<typeof zRegistrationStep1Dto>) => {
  const res = await registrationControllerStartRegistration({ body: data });
  return res.data;
});

export const startRegistrationMutation = createMutation({
  effect: startRegistrationFx,
  contract: zodContract(zRegistrationControllerStartRegistrationResponse),
});

const step2Fx = createEffect(async (data: z.infer<typeof zRegistrationStep2Dto>) => {
  const res = await registrationControllerProcessStep2({ body: data });
  return res.data;
});

export const step2Mutation = createMutation({
  effect: step2Fx,
  contract: zodContract(zRegistrationControllerStartRegistrationResponse),
});

const step3Fx = createEffect(async (data: z.infer<typeof zRegistrationStep3Dto>) => {
  const res = await registrationControllerProcessStep3({ body: data });
  return res.data;
});

export const step3Mutation = createMutation({
  effect: step3Fx,
  contract: zodContract(zRegistrationControllerStartRegistrationResponse),
});

const sendSmsFx = createEffect(async (data: z.infer<typeof zRegistrationSendSmsDto>) => {
  const res = await registrationControllerSendSmsCode({ body: data });
  return res.data;
});

export const sendSmsMutation = createMutation({
  effect: sendSmsFx,
  contract: zodContract(zRegistrationSendSmsDto),
});

const verifySmsFx = createEffect(async (data: z.infer<typeof zRegistrationVerifySmsDto>) => {
  const res = await registrationControllerVerifySmsCode({ body: data });
  return res.data;
});

export const verifySmsMutation = createMutation({
  effect: verifySmsFx,
  contract: zodContract(zRegistrationVerifySmsDto),
});

const step5Fx = createEffect(async (data: z.infer<typeof zRegistrationStep5Dto>) => {
  const res = await registrationControllerProcessStep5({ body: data });
  return res.data;
});

export const step5Mutation = createMutation({
  effect: step5Fx,
  contract: zodContract(zRegistrationStep5Dto),
});

export const zAuthTokens = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

const completeRegistrationFx = createEffect(async (params: { sessionId: string }) => {
  const res = await registrationControllerCompleteRegistration({ body: params });
  return res.data;
});

export const completeRegistrationMutation = createMutation({
  effect: completeRegistrationFx,
  contract: zodContract(zAuthTokens),
});
