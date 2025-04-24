import { Link } from "atomic-router-react";

import { routes } from "@/shared/routing";

export const LogoLink = () => {
  return (
    <Link to={routes.home} className="text-2xl font-bold cursor-pointer">
      {import.meta.env.VITE_APP_NAME}
    </Link>
  );
};
