import { Route } from "@argon-router/core";
import { Link } from "@argon-router/react";

import { routes } from "@/shared/routing";

type LogoLinkProps<Params> = {
  to?: Route<Params>;
} & (Params extends void ? { params?: never } : { params: Params });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LogoLink = ({ to = routes.home, params }: LogoLinkProps<any>) => {
  return (
    <Link to={to} params={params} className="text-2xl font-bold cursor-pointer">
      {import.meta.env.VITE_APP_NAME}
    </Link>
  );
};
