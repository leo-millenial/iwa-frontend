import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

export const SignInPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-10">
        <div className="text-2xl font-bold cursor-pointer">{import.meta.env.VITE_APP_NAME}</div>
      </header>

      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('images/blue-backgraund.jpg')",
          }}
        />

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-md p-8">
            <Card className="w-full shadow-lg">
              <CardHeader className="space-y-3">
                <CardTitle className="text-3xl font-bold">Вход</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="login" className="text-sm font-medium">
                      Логин
                    </label>
                    <Input id="login" placeholder="Введите логин" className="h-11" />
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
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="pt-4">
                <Button className="w-full h-11 text-base font-medium">Войти</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
