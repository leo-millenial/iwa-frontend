import { useUnit } from "effector-react";

import { $countdownSeconds } from "@/pages/auth/finish/model.ts";

import { LogoLink } from "@/shared/ui/logo-link.tsx";

export const AuthRegistrationFinishPage = () => {
  const countdown = useUnit($countdownSeconds);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-10">
        <LogoLink />
      </header>

      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 space-y-6 bg-card rounded-lg shadow-md text-center">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Вы успешно зарегистрировались!</h1>
              <p className="text-sm text-muted-foreground">
                перенаправим вас на главную страницу через {countdown} секунд
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
