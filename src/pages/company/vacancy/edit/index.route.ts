import { createRouteView } from "@argon-router/react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { currentRoute } from "./model";
import { CompanyVacancyEditPage } from "./ui.tsx";

export default createRouteView({
  view: CompanyVacancyEditPage,
  route: currentRoute,
  layout: LayoutCompany,
});
