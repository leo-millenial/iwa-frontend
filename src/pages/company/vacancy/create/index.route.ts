import { createRouteView } from "@argon-router/react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { currentRoute } from "./model";
import { CompanyVacancyCreatePage } from "./ui.tsx";

export default createRouteView({
  view: CompanyVacancyCreatePage,
  route: currentRoute,
  layout: LayoutCompany,
});
