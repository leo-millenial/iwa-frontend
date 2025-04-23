import { useMaskito } from "@maskito/react";
import { useUnit } from "effector-react";
import { Loader2 } from "lucide-react";

import { ErrorMessage } from "@/pages/auth/registration/ui/error-message.tsx";

import { Button } from "@/shared/ui/button.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { LogoLink } from "@/shared/ui/logo-link.tsx";

import { getPhoneErrorMessage, options } from "./lib/phone.ts";
import { $error, $pending, nextClicked, phoneChanged } from "./model.ts";

export const AuthRegistrationPhonePage = () => {
  const [error, pending] = useUnit([$error, $pending]);
  const [phoneChangedHandle, nextClickedHandle] = useUnit([phoneChanged, nextClicked]);

  const maskedInputRef = useMaskito({ options });

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
              <p className="text-sm text-muted-foreground">шаг 3 из 4</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  ref={maskedInputRef}
                  placeholder="+7"
                  onInput={(e) => {
                    const input = e.currentTarget as HTMLInputElement;
                    phoneChangedHandle(input.value);
                  }}
                />
              </div>

              <Button disabled={pending} className="w-full" onClick={() => nextClickedHandle()}>
                {pending && <Loader2 className="animate-spin" />}
                Далее
              </Button>
            </div>
          </div>
          <ErrorMessage message={getPhoneErrorMessage(error)} />
        </div>
      </div>
    </div>
  );
};
