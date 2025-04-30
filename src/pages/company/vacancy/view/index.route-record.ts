import { RouteInstance, RouteParams } from "atomic-router";
import { createRouteView } from "atomic-router-react";

import { PageLoader } from "@/shared/ui/page-loader.tsx";

import { authenticatedRoute, currentRoute } from "./model";
import { CompanyVacancyViewPage } from "./ui.tsx";

const AuthenticationView = createRouteView({
  route: authenticatedRoute as unknown as RouteInstance<RouteParams>,
  view: CompanyVacancyViewPage,
  otherwise: PageLoader,
});

export default {
  view: AuthenticationView,
  route: currentRoute,
};
