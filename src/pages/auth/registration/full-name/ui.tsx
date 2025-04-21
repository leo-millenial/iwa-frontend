import { useUnit } from "effector-react";

import {
  $error,
  $firstName,
  $lastName,
  FullNameError,
  firstNameChanged,
  lastNameChanged,
  nextClicked,
} from "@/pages/auth/registration/full-name/model.ts";
import { ErrorMessage } from "@/pages/auth/registration/ui/error-message.tsx";

import { Button } from "@/shared/ui/button.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { LogoLink } from "@/shared/ui/logo-link.tsx";

export const AuthRegistrationFullNamePage = () => {
  const [firstName, lastName, error] = useUnit([$firstName, $lastName, $error]);
  const [firstNameChangedHandle, lastNameChangedHandle, nextClickedHandle] = useUnit([
    firstNameChanged,
    lastNameChanged,
    nextClicked,
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-10">
        <LogoLink />
      </header>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 space-y-6 bg-card rounded-lg shadow-md">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Регистрация</h1>
            <p className="text-sm text-muted-foreground">шаг 2 из 4</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя</Label>
              <Input
                id="firstName"
                placeholder="Введите имя"
                value={firstName}
                onChange={(e) => firstNameChangedHandle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия</Label>
              <Input
                id="lastName"
                placeholder="Введите фамилию"
                value={lastName}
                onChange={(e) => lastNameChangedHandle(e.target.value)}
              />
            </div>

            <ErrorMessage message={getErrorMessage(error)} />

            <Button className="w-full" onClick={() => nextClickedHandle()}>
              Далее
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getErrorMessage = (error: FullNameError): string | null => {
  if (!error) return null;

  const errorMessages: Record<Exclude<FullNameError, null>, string> = {
    FIRST_NAME_REQUIRED: "Имя обязательно для заполнения",
    FIRST_NAME_TOO_SHORT: "Имя должно содержать минимум 2 символа",
    FIRST_NAME_TOO_LONG: "Имя не должно превышать 50 символов",
    LAST_NAME_REQUIRED: "Фамилия обязательна для заполнения",
    LAST_NAME_TOO_SHORT: "Фамилия должна содержать минимум 2 символа",
    LAST_NAME_TOO_LONG: "Фамилия не должна превышать 50 символов",
  };

  return errorMessages[error];
};
