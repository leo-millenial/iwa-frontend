import { Link } from "atomic-router-react";

import { routes } from "@/shared/routing";
import { Button } from "@/shared/ui/button.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { LogoLink } from "@/shared/ui/logo-link.tsx";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group.tsx";

export const AuthRegistrationPage = () => {
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
              <h1 className="text-2xl font-bold">Регистрация</h1>
              <p className="text-sm text-muted-foreground">шаг 1 из 4</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base">Тип аккаунта</Label>
                <RadioGroup defaultValue="jobseeker" className="flex space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="jobseeker" id="jobseeker" />
                    <Label htmlFor="jobseeker">Соискатель</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employer" id="employer" />
                    <Label htmlFor="employer">Работодатель</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Логин</Label>
                <Input id="username" placeholder="Введите логин" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" placeholder="Введите пароль" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтверждение пароля</Label>
                <Input id="confirm-password" type="password" placeholder="Подтвердите пароль" />
              </div>

              <Button className="w-full">Далее</Button>

              <div className="text-center">
                <Link to={routes.auth.signIn}>
                  <Button variant="link" className="text-sm">
                    Есть аккаунт?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
