import { useUnit } from "effector-react";
import { useEffect, useRef } from "react";

import {
  $canResend,
  $code,
  $codeErrorMessage,
  $resendTimeout,
  codeChanged,
  confirmClicked,
  sendSmsAgainClicked,
} from "@/pages/auth/registration/confirm-phone/model.ts";

import { sendSmsMutation, verifySmsMutation } from "@/shared/api/registration";
import { Button } from "@/shared/ui/button.tsx";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/ui/input-otp";
import { Label } from "@/shared/ui/label.tsx";
import { LogoLink } from "@/shared/ui/logo-link.tsx";

export const AuthRegistrationConfirmPhonePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [
    code,
    codeErrorMessage,
    resendTimeout,
    canResend,
    isSmsSending,
    isVerifying,
    handleCodeChange,
    handleConfirmClick,
    handleResendClick,
  ] = useUnit([
    $code,
    $codeErrorMessage,
    $resendTimeout,
    $canResend,
    sendSmsMutation.$pending,
    verifySmsMutation.$pending,
    codeChanged,
    confirmClicked,
    sendSmsAgainClicked,
  ]);

  // Автофокус на первое поле ввода кода
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const firstInput = containerRef.current.querySelector("input");
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 space-y-6 bg-card rounded-lg shadow-md">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Подтверждение номера</h1>
              <p className="text-sm text-muted-foreground">шаг 4 из 4</p>
              <p className="text-sm text-muted-foreground mt-2">
                Введите код из SMS, отправленный на ваш номер телефона
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="otp-input">Код подтверждения</Label>
                <div className="flex justify-center" ref={containerRef}>
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(value) => handleCodeChange(value)}
                    id="otp-input"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {codeErrorMessage && (
                  <p className="text-sm text-destructive text-center">{codeErrorMessage}</p>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full"
                  variant="default"
                  disabled={code.length !== 6 || isVerifying}
                  onClick={handleConfirmClick}
                >
                  {isVerifying ? "Проверка..." : "Подтвердить"}
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  disabled={!canResend || isSmsSending}
                  onClick={handleResendClick}
                >
                  {isSmsSending
                    ? "Отправка..."
                    : canResend
                      ? "Отправить код повторно"
                      : `Отправить код повторно через ${resendTimeout}с`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
