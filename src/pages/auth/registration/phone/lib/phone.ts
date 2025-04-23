import type { MaskitoOptions } from "@maskito/core";
import { maskitoAddOnFocusPlugin, maskitoRemoveOnBlurPlugin } from "@maskito/kit";
import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import { getCountryCallingCode } from "libphonenumber-js/core";
import metadata from "libphonenumber-js/metadata.full.json";

import { PhoneError } from "../model.ts";

const countryIsoCode = "RU";
const code = getCountryCallingCode(countryIsoCode, metadata);
const prefix = `+${code} `;

export const getPhoneErrorMessage = (error: PhoneError): string | null => {
  if (!error) return null;

  const errorMessages: Record<Exclude<PhoneError, null>, string> = {
    PHONE_REQUIRED: "Номер телефона обязателен для заполнения",
    PHONE_INVALID_FORMAT: "Введите корректный российский номер телефона",
  };

  return errorMessages[error];
};

const phoneOptions = maskitoPhoneOptionsGenerator({
  metadata,
  countryIsoCode,
});

export const options = {
  ...phoneOptions,
  plugins: [
    ...phoneOptions.plugins,
    maskitoAddOnFocusPlugin(prefix),
    maskitoRemoveOnBlurPlugin(prefix),
  ],
} satisfies MaskitoOptions;
