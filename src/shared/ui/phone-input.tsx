import * as React from "react";
import type { MaskitoOptions } from "@maskito/core";
import { maskitoAddOnFocusPlugin, maskitoRemoveOnBlurPlugin } from "@maskito/kit";
import { maskitoPhoneOptionsGenerator } from "@maskito/phone";
import { useMaskito } from "@maskito/react";
import { getCountryCallingCode } from "libphonenumber-js/core";
import type { CountryCode } from "libphonenumber-js/core";
import metadata from "libphonenumber-js/metadata.full.json";

import { Input } from "@/shared/ui/input.tsx";

export type PhoneInputProps = Omit<React.ComponentProps<typeof Input>, "onChange"> & {
  onChange?: (value: string) => void;
  countryIsoCode?: CountryCode;
};

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onChange, countryIsoCode = "RU", ...props }, forwardedRef) => {
    const code = getCountryCallingCode(countryIsoCode, metadata);
    const prefix = `+${code} `;

    const phoneOptions = maskitoPhoneOptionsGenerator({
      metadata,
      countryIsoCode,
    });

    const options = {
      ...phoneOptions,
      plugins: [
        ...phoneOptions.plugins,
        maskitoAddOnFocusPlugin(prefix),
        maskitoRemoveOnBlurPlugin(prefix),
      ],
    } satisfies MaskitoOptions;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const maskedInputRef = useMaskito({ options });

    // Объединяем refs
    React.useImperativeHandle(forwardedRef, () => inputRef.current!);

    // Объединяем ref для маскирования с ref для доступа к input
    const setRefs = React.useCallback(
      (element: HTMLInputElement | null) => {
        inputRef.current = element;
        maskedInputRef(element);
      },
      [maskedInputRef],
    );

    return (
      <Input
        ref={setRefs}
        placeholder={prefix}
        type="tel"
        onInput={(e) => {
          const input = e.currentTarget as HTMLInputElement;
          onChange?.(input.value);
        }}
        {...props}
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export type PhoneError = "PHONE_REQUIRED" | "PHONE_INVALID_FORMAT" | null;

export const getPhoneErrorMessage = (error: PhoneError): string | null => {
  if (!error) return null;

  const errorMessages: Record<Exclude<PhoneError, null>, string> = {
    PHONE_REQUIRED: "Номер телефона обязателен для заполнения",
    PHONE_INVALID_FORMAT: "Введите корректный российский номер телефона",
  };

  return errorMessages[error];
};
