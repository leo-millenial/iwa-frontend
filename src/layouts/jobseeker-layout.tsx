import { Link } from "@argon-router/react";
import { useUnit } from "effector-react";
import { LogOut, MessageSquare, Plus, User } from "lucide-react";

import { routes } from "@/shared/routing";
import { Button } from "@/shared/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu.tsx";
import { LogoLink } from "@/shared/ui/logo-link.tsx";
import { $viewer, viewerLoggedOut } from "@/shared/viewer";

export const LayoutJobseeker = ({ children }: { children: React.ReactNode }) => {
  const viewer = useUnit($viewer);
  const handleLoggedOut = useUnit(viewerLoggedOut);

  const viewerName = viewer?.user.firstName || "";
  const jobseekerId = viewer?.jobseeker?._id || "";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-20 border-b sticky top-0">
        <div className="flex items-center gap-8">
          <LogoLink to={routes.jobseeker.profile} params={{ jobseekerId }} />

          {/* Навигация */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to={routes.help}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Помощь
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            className="flex items-center gap-2 w-full"
            to={routes.jobseeker.resume.create}
            params={{ jobseekerId }}
          >
            <Button size="sm" className="hidden sm:flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Добавить резюме</span>
            </Button>
          </Link>

          {/* Иконки */}
          {/*<Button variant="ghost" size="icon" className="rounded-full">*/}
          {/*  <Search className="h-5 w-5" />*/}
          {/*</Button>*/}

          <Button variant="ghost" size="icon" className="rounded-full">
            <MessageSquare className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">{viewerName}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer  ">
                <Link
                  className="flex items-center gap-2 w-full"
                  to={routes.jobseeker.profile}
                  params={{ jobseekerId }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Профиль</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2 text-destructive"
                onClick={() => handleLoggedOut()}
              >
                <LogOut className="h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 relative overflow-auto">
        {/* Контент страницы */}
        <div className="relative z-10 min-h-full p-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm p-4 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
