import { createEvent, createStore, sample } from "effector";
import { and, interval, reset } from "patronum";

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

// События для управления кодом подтверждения
export const codeChanged = createEvent<string>();
export const confirmClicked = createEvent();
export const sendSmsAgainClicked = createEvent();
export const verificationSucceeded = createEvent<UserRole>();

// Основные сторы
export const $code = createStore("");
export const $codeErrorMessage = createStore<string | null>(null);
export const $codeSent = createStore(false);

// Сторы для управления повторной отправкой SMS
export const $resendTimeout = createStore(60); // 60 секунд таймер
export const $canResend = createStore(false);

// События для управления таймером
export const startResendTimer = createEvent();
export const stopResendTimer = createEvent();

// Интервал для таймера
const { tick } = interval({
  timeout: 1_000,
  start: startResendTimer,
  stop: stopResendTimer,
});

$code.on(codeChanged, (_, code) => code);

// Сбрасываем сообщение об ошибке при изменении кода
sample({
  clock: codeChanged,
  target: $codeErrorMessage.reinit,
});

// Событие для инициализации отправки SMS
export const initSendSms = createEvent<string>();

// Запускаем отправку SMS при открытии страницы
sample({
  clock: currentRoute.opened,
  source: $sessionId,
  filter: Boolean,
  fn: (sessionId) => ({ sessionId }),
  target: sendSmsMutation.start,
});

// Запускаем таймер при открытии страницы
sample({
  clock: currentRoute.opened,
  target: startResendTimer,
});

// Устанавливаем флаг отправки кода при успешной отправке
sample({
  clock: sendSmsMutation.finished.success,
  fn: () => true,
  target: $codeSent,
});

// Отправляем код на проверку при нажатии кнопки подтверждения
sample({
  clock: confirmClicked,
  source: { code: $code, sessionId: $sessionId },
  filter: (source) => source.code.length === 6 && Boolean(source.sessionId),
  target: verifySmsMutation.start,
});

// Обрабатываем ошибки при проверке кода
sample({
  clock: verifySmsMutation.finished.failure,
  fn: ({ error }) => {
    // Проверяем наличие свойства message у объекта error
    if (typeof error === "object" && error !== null && "message" in error) {
      return error.message as string;
    }
    return "Ошибка проверки кода";
  },
  target: $codeErrorMessage,
});

// Обрабатываем успешную проверку кода
sample({
  clock: verifySmsMutation.finished.success,
  fn: ({ result }) => ({
    currentStep: result.currentStep,
    sessionId: result.sessionId,
  }),
  target: registrationResponseSucceed,
});

// Логика таймера для повторной отправки SMS
sample({
  clock: tick,
  source: $resendTimeout,
  filter: (timeout) => timeout > 0,
  fn: (timeout) => timeout - 1,
  target: $resendTimeout,
});

// Когда таймер достигает нуля, разрешаем повторную отправку
sample({
  clock: $resendTimeout,
  filter: (timeout) => timeout === 0,
  fn: () => true,
  target: $canResend,
});

// Останавливаем таймер, когда он достигает нуля
sample({
  clock: $resendTimeout,
  filter: (timeout) => timeout === 0,
  target: stopResendTimer,
});

// При запуске таймера сбрасываем возможность повторной отправки
sample({
  clock: startResendTimer,
  fn: () => false,
  target: $canResend,
});

// При запуске таймера сбрасываем значение таймера
sample({
  clock: startResendTimer,
  fn: () => 60,
  target: $resendTimeout,
});

// Подготавливаем данные для повторной отправки SMS
sample({
  clock: sendSmsAgainClicked,
  source: $sessionId,
  filter: and($sessionId, $canResend),
  fn: (sessionId) => ({ sessionId }),
  target: sendSmsMutation.start,
});

// Запускаем таймер при повторной отправке SMS
sample({
  clock: sendSmsAgainClicked,
  filter: $canResend,
  target: startResendTimer,
});

// Обрабатываем ошибки при отправке SMS
sample({
  clock: sendSmsMutation.finished.failure,
  fn: ({ error }) => {
    // Проверяем наличие свойства message у объекта error
    if (typeof error === "object" && error !== null && "message" in error) {
      return error.message as string;
    }
    return "Ошибка отправки SMS";
  },
  target: $codeErrorMessage,
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
  target: routes.auth.registrationFlow.jobseeker.profile.open,
});

// Сбрасываем состояние при уходе со страницы
reset({
  clock: currentRoute.closed,
  target: [$code, $codeErrorMessage],
});
