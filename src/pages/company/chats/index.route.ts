import { createRouteView } from "@argon-router/react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { currentRoute } from "./model";
import { ChatsPage } from "./ui.tsx";

export default createRouteView({
  view: ChatsPage,
  route: currentRoute,
  layout: LayoutCompany,
});
