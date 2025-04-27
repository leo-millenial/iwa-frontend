import { useUnit } from "effector-react";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { LogoLink } from "@/shared/ui/logo-link.tsx";
import { PhoneInput } from "@/shared/ui/phone-input.tsx";

import { $password, $pending, formSubmitted, passwordChanged, phoneChanged } from "./model.ts";

export const AuthSignInPage = () => {
  const [handleSubmitForm, handlePasswordChange, handlePhoneChange] = useUnit([
    formSubmitted,
    passwordChanged,
    phoneChanged,
  ]);

  const [password, pending] = useUnit([$password, $pending]);

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

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md p-8">
            <Card className="w-full shadow-lg">
              <CardHeader className="space-y-2">
                <CardTitle className="text-3xl font-bold">Вход</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Телефон
                    </label>
                    <PhoneInput id="phone" onChange={(value) => handlePhoneChange(value)} />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="password" className="text-sm font-medium">
                      Пароль
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Введите пароль"
                      className="h-11"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  disabled={pending}
                  onClick={() => handleSubmitForm()}
                  type="submit"
                  className="w-full h-11 text-base font-medium"
                >
                  {pending && <Loader2 className="animate-spin" />}
                  Войти
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
