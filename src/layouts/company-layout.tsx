import { Link } from "atomic-router-react";
import { MessageSquare, Plus, Search, User } from "lucide-react";

import { routes } from "@/shared/routing";
import { Button } from "@/shared/ui/button.tsx";

export const LayoutCompany = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-20 border-b sticky top-0">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold cursor-pointer">{import.meta.env.VITE_APP_NAME}</div>

          {/* Навигация */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to={routes.company.search}
              params={{ companyId: "123" }}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Поиск
            </Link>
            <Link
              to={routes.company.vacancies}
              params={{ companyId: "123" }}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Вакансии
            </Link>
            <Link
              to={routes.company.subscription}
              params={{ companyId: "123" }}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Подписка
            </Link>
            <Link
              to={routes.company.help}
              params={{ companyId: "123" }}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Помощь
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Кнопка добавления вакансии */}
          <Button size="sm" className="hidden sm:flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Добавить вакансию</span>
          </Button>

          {/* Иконки */}
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>

          {/* Название компании */}
          <div className="hidden md:block text-sm font-medium truncate max-w-[150px]">
            Название компании
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-auto">
        {/* Фоновое изображение */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('images/blue-backgraund.jpg')",
          }}
        />

        {/* Контент страницы */}
        <div className="relative z-10 min-h-full p-4">{children}</div>
      </main>
    </div>
  );
};
