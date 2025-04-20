import { Link } from "atomic-router-react";

import { routes } from "@/shared/routing";
import { Button } from "@/shared/ui/button.tsx";
import { LogoLink } from "@/shared/ui/logo-link.tsx";

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-10">
        <LogoLink />
        <div className="flex gap-4">
          <Link to={routes.auth.registration}>
            <Button variant="outline">Зарегистрироваться</Button>
          </Link>

          <Link to={routes.auth.signIn}>
            <Button>Войти</Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('images/blue-backgraund.jpg')",
          }}
        />
      </div>
    </div>
  );
};
