import { createRouteView } from "@argon-router/react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { currentRoute } from "./model";
import { CompanyVacancyViewPage } from "./ui.tsx";

export default createRouteView({
  view: CompanyVacancyViewPage,
  route: currentRoute,
  layout: LayoutCompany,
});
