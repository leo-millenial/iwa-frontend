import { createRouteView } from "@argon-router/react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { currentRoute } from "./model";
import { CompanySubscriptionPage } from "./ui.tsx";

export default createRouteView({
  view: CompanySubscriptionPage,
  route: currentRoute,
  layout: LayoutCompany,
});
