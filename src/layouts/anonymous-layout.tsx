import { Link } from "@argon-router/react";
import { useUnit } from "effector-react";

import { routes } from "@/shared/routing";
import { UserRole } from "@/shared/types/user.interface.ts";
import { LogoLink } from "@/shared/ui/logo-link";
import { $viewer } from "@/shared/viewer";

type LowercaseUserRole = Lowercase<UserRole>;

export const LayoutAnonymous = ({ children }: { children: React.ReactNode }) => {
  const viewer = useUnit($viewer);
  const role = viewer?.user.role;

  const logoRedirectTo =
    role === UserRole.Jobseeker ? routes.jobseeker.profile : routes.company.search;
  const roleLowerCase = role?.toLowerCase() as LowercaseUserRole | undefined;
  const roleIdKey = `${roleLowerCase}Id`;
  const roleId = role === UserRole.Jobseeker ? viewer?.jobseeker?._id : viewer?.company?._id;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-20 border-b sticky top-0">
        <div className="flex items-center gap-8">
          {role ? <LogoLink to={logoRedirectTo} params={{ [roleIdKey]: roleId }} /> : <LogoLink />}

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
