import { Link } from "atomic-router-react";
import { useUnit } from "effector-react";
import { Loader2 } from "lucide-react";

import { routes } from "@/shared/routing";
import { UserRole } from "@/shared/types/user.interface.ts";
import { Button } from "@/shared/ui/button.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { LogoLink } from "@/shared/ui/logo-link.tsx";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group.tsx";

import {
  $confirmPassword,
  $email,
  $error,
  $password,
  $pending,
  $role,
  AuthRegistrationStartPageError,
  confirmPasswordChanged,
  emailChanged,
  nextClicked,
  passwordChanged,
  roleChanged,
} from "./model";
import { ErrorMessage } from "./ui/error-message.tsx";

export const AuthRegistrationPage = () => {
  const [email, password, confirmPassword, role, error, pending] = useUnit([
    $email,
    $password,
    $confirmPassword,
    $role,
    $error,
    $pending,
  ]);

  const [
    handleConfirmPasswordChanged,
    handleEmailChanged,
    handlePasswordChanged,
    handleRoleChanged,
    handleNextClick,
  ] = useUnit([confirmPasswordChanged, emailChanged, passwordChanged, roleChanged, nextClicked]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-10">
        <LogoLink />
      </header>

      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('images/blue-background.jpg')",
          }}
        />

        <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center p-4">
          <div className="w-full max-w-md p-6 space-y-6 bg-card rounded-lg shadow-md">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Регистрация</h1>
              <p className="text-sm text-muted-foreground">шаг 1 из 4</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base">Тип аккаунта</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => handleRoleChanged(value as UserRole)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={UserRole.Jobseeker} id="jobseeker" />
                    <Label htmlFor="jobseeker">Соискатель</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={UserRole.Company} id="employer" />
                    <Label htmlFor="employer">Работодатель</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Введите email"
                  value={email}
                  onChange={(e) => handleEmailChanged(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => handlePasswordChanged(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтверждение пароля</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChanged(e.target.value)}
                />
              </div>

              <Button disabled={pending} onClick={() => handleNextClick()} className="w-full">
                {pending && <Loader2 className="animate-spin" />}
                Далее
              </Button>

              <div className="text-center">
                <Link to={routes.auth.signIn}>
                  <Button variant="link" className="text-sm">
                    Есть аккаунт?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <ErrorMessage message={getErrorMessage(error)} />
        </div>
      </div>
    </div>
  );
};

export const getErrorMessage = (error: AuthRegistrationStartPageError): string | null => {
  if (!error) return null;

  const errorMessages: Record<Exclude<AuthRegistrationStartPageError, null>, string> = {
    INVALID_EMAIL: "Введите корректный email адрес",
    PASSWORD_TOO_SHORT: "Пароль должен содержать не менее 8 символов",
    PASSWORD_NO_UPPERCASE: "Пароль должен содержать хотя бы одну заглавную букву",
    PASSWORD_NO_LOWERCASE: "Пароль должен содержать хотя бы одну строчную букву",
    PASSWORD_NO_DIGIT: "Пароль должен содержать хотя бы одну цифру",
    PASSWORDS_DO_NOT_MATCH: "Пароли не совпадают",
    EMAIL_ALREADY_EXISTS: "Пользователь с таким email уже существует",
  };

  return errorMessages[error];
};
