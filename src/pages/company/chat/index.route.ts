import { createRouteView } from "@argon-router/react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { currentRoute } from "./model";
import { CompanyChatPage } from "./ui.tsx";

export default createRouteView({
  view: CompanyChatPage,
  route: currentRoute,
  layout: LayoutCompany,
});
