import { createFactory } from "@withease/factories";
import { attach, createEvent, createStore, sample } from "effector";
import { z } from "zod";

import { PhoneError } from "@/shared/ui/phone-input";

export const phoneSchema = z
  .string()
  .min(1, { message: "PHONE_REQUIRED" })
  .regex(/^(\+7|7|8)?[\s-]?\(?[9][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/, {
    message: "PHONE_INVALID_FORMAT",
  });

// Создаем фабрику без обязательных параметров
export const createPhoneValidation = createFactory(() => {
  // Функция нормализации телефона по умолчанию
  const normalizePhone = (p: string) => p.replace(/\D/g, "");

  // Создаем события и сторы внутри фабрики
  const validatePhone = createEvent<void>();
  const phoneChanged = createEvent<string>();
  const $phone = createStore("");
  const $error = createStore<PhoneError>(null);
  const $normalizedPhone = $phone.map(normalizePhone);

  // Обновляем стор телефона при изменении
  $phone.on(phoneChanged, (_, phone) => phone);

  // Создаем эффект для валидации телефона с помощью attach
  const validatePhoneEffect = attach({
    source: $normalizedPhone,
    effect: (phone: string) => {
      const result = phoneSchema.safeParse(phone);
      if (!result.success) {
        return result.error.errors[0].message as PhoneError;
      }
      return null;
    },
  });

  // Запускаем эффект валидации
  sample({
    clock: validatePhone,
    target: validatePhoneEffect,
  });

  // Обновляем стор ошибки результатом валидации
  sample({
    clock: validatePhoneEffect.doneData,
    target: $error,
  });

  // Сброс ошибки при изменении телефона
  sample({
    clock: $phone,
    target: $error.reinit,
  });

  return {
    // События
    validatePhone,
    phoneChanged,

    // Сторы
    $phone,
    $error,
    $normalizedPhone,
  };
});
