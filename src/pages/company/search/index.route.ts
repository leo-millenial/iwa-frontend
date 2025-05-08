import { createRouteView } from "@argon-router/react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { currentRoute } from "./model";
import { CompanySearchPage } from "./ui.tsx";

export default createRouteView({
  view: CompanySearchPage,
  route: currentRoute,
  layout: LayoutCompany,
});
