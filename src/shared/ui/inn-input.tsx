import * as React from "react";
import { maskitoNumberOptionsGenerator } from "@maskito/kit";
import { useMaskito } from "@maskito/react";

import { Input } from "@/shared/ui/input";

// Создаем опции для маски ИНН с использованием maskitoNumberOptionsGenerator
const innMaskOptions = maskitoNumberOptionsGenerator({
  decimalZeroPadding: false,
  precision: 0,
  min: 0,
  max: 999999999999,
  thousandSeparator: "",
  decimalSeparator: "",
});

export type InnInputProps = Omit<React.ComponentProps<typeof Input>, "onChange"> & {
  onChange?: (value: string) => void;
};

export const InnInput = React.forwardRef<HTMLInputElement, InnInputProps>(
  ({ onChange, ...props }, forwardedRef) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const maskedInputRef = useMaskito({ options: innMaskOptions });

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

    // Дополнительная валидация для ИНН (10 или 12 цифр)
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      let value = input.value;

      // Если длина больше 10 и меньше 12, обрезаем до 10
      if (value.length > 10 && value.length < 12) {
        value = value.slice(0, 10);
        input.value = value;
      }

      onChange?.(value);
    };

    return (
      <Input
        ref={setRefs}
        type="text"
        inputMode="numeric"
        placeholder="10 или 12 цифр"
        onInput={handleInput}
        maxLength={12}
        {...props}
      />
    );
  },
);

InnInput.displayName = "InnInput";

export type InnError = "INN_REQUIRED" | "INN_INVALID_FORMAT" | null;

export const getInnErrorMessage = (error: InnError): string | null => {
  if (!error) return null;

  const errorMessages: Record<Exclude<InnError, null>, string> = {
    INN_REQUIRED: "ИНН обязателен для заполнения",
    INN_INVALID_FORMAT: "ИНН должен содержать 10 цифр для юр. лиц или 12 цифр для ИП",
  };

  return errorMessages[error];
};
