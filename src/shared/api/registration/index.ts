import { createMutation } from "@farfetched/core";
import { createEffect } from "effector";
import { z } from "zod";

// Типы для запросов и ответов
export const zAuthTokens = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

type RegistrationStep1Data = {
  email: string;
  role: string;
};

type RegistrationStep2Data = {
  sessionId: string;
  firstName: string;
  lastName: string;
};

type RegistrationStep3Data = {
  sessionId: string;
  companyName: string;
  companySize: string;
};

type RegistrationSendSmsData = {
  sessionId: string;
  phone: string;
};

type RegistrationVerifySmsData = {
  sessionId: string;
  code: string;
};

type RegistrationStep5Data = {
  sessionId: string;
  password: string;
};

type RegistrationResponse = {
  sessionId: string;
};

type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

// Эффекты
const startRegistrationFx = createEffect(async (data: RegistrationStep1Data) => {
  const url = new URL("/api/registration/start", window.location.origin);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при начале регистрации");
  }

  return (await response.json()) as RegistrationResponse;
});

const step2Fx = createEffect(async (data: RegistrationStep2Data) => {
  const url = new URL("/api/registration/step2", window.location.origin);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при выполнении шага 2");
  }

  return (await response.json()) as RegistrationResponse;
});

const step3Fx = createEffect(async (data: RegistrationStep3Data) => {
  const url = new URL("/api/registration/step3", window.location.origin);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при выполнении шага 3");
  }

  return (await response.json()) as RegistrationResponse;
});

const sendSmsFx = createEffect(async (data: RegistrationSendSmsData) => {
  const url = new URL("/api/registration/send-sms", window.location.origin);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при отправке SMS");
  }

  return await response.json();
});

const verifySmsFx = createEffect(async (data: RegistrationVerifySmsData) => {
  const url = new URL("/api/registration/verify-sms", window.location.origin);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при проверке SMS кода");
  }

  return (await response.json()) as RegistrationResponse;
});

const step5Fx = createEffect(async (data: RegistrationStep5Data) => {
  const url = new URL("/api/registration/step5", window.location.origin);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при выполнении шага 5");
  }

  return (await response.json()) as RegistrationResponse;
});

const completeRegistrationFx = createEffect(async (params: { sessionId: string }) => {
  const url = new URL("/api/registration/complete", window.location.origin);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при завершении регистрации");
  }

  return (await response.json()) as AuthTokens;
});

// Мутации
export const startRegistrationMutation = createMutation({
  effect: startRegistrationFx,
});

export const step2Mutation = createMutation({
  effect: step2Fx,
});

export const step3Mutation = createMutation({
  effect: step3Fx,
});

export const sendSmsMutation = createMutation({
  effect: sendSmsFx,
});

export const verifySmsMutation = createMutation({
  effect: verifySmsFx,
});

export const step5Mutation = createMutation({
  effect: step5Fx,
});

export const completeRegistrationMutation = createMutation({
  effect: completeRegistrationFx,
});
