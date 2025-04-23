import { useUnit } from "effector-react";
import { useEffect, useRef, useState } from "react";

import {
  $code,
  codeChanged,
  confirmClicked,
} from "@/pages/auth/registration/confirm-phone/model.ts";

import { Button } from "@/shared/ui/button.tsx";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/ui/input-otp";
import { Label } from "@/shared/ui/label.tsx";
import { LogoLink } from "@/shared/ui/logo-link.tsx";

export const AuthRegistrationConfirmPhonePage = () => {
  const [countdown, setCountdown] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [codeSent, setCodeSent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const code = useUnit($code);
  const [handleConfirmClick, handleCodeChange] = useUnit([confirmClicked, codeChanged]);

  useEffect(() => {
    let timer: number | undefined;

    if (countdown > 0 && isDisabled) {
      timer = window.setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && isDisabled && codeSent) {
      setIsDisabled(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, isDisabled, codeSent]);

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

  const handleResendCode = () => {
    setCountdown(60);
    setIsDisabled(true);
    setCodeSent(true);
  };

  const handleConfirm = () => {
    handleConfirmClick();
    setCountdown(60);
    setIsDisabled(true);
    setCodeSent(true);
  };

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
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full"
                  variant="default"
                  disabled={code.length !== 6}
                  onClick={handleConfirm}
                >
                  Подтвердить
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  disabled={isDisabled}
                  onClick={handleResendCode}
                >
                  {codeSent && isDisabled
                    ? `Отправить код повторно (${countdown}с)`
                    : "Отправить код повторно"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
