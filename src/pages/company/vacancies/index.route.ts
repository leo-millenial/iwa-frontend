import { createRouteView } from "@argon-router/react";

import { CompanyVacanciesPage } from "@/pages/company/vacancies/ui.tsx";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { currentRoute } from "./model";

export default createRouteView({
  view: CompanyVacanciesPage,
  route: currentRoute,
  layout: LayoutCompany,
});
