import { RouteInstance, RouteParams } from "atomic-router";
import { createRouteView } from "atomic-router-react";

import { CompanyVacanciesPage } from "@/pages/company/vacancies/ui.tsx";

import { PageLoader } from "@/shared/ui/page-loader.tsx";

import { authenticatedRoute, currentRoute } from "./model";

const AuthenticationView = createRouteView({
  route: authenticatedRoute as unknown as RouteInstance<RouteParams>,
  view: CompanyVacanciesPage,
  otherwise: PageLoader,
});

export default {
  view: AuthenticationView,
  route: currentRoute,
};
