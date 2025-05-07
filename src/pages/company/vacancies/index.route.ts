import { createRouteView } from "@argon-router/react";

import { CompanyVacanciesPage } from "@/pages/company/vacancies/ui.tsx";

import { currentRoute } from "./model";

export default createRouteView({
  view: CompanyVacanciesPage,
  route: currentRoute,
});
