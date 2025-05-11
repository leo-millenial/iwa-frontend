import { createRouteView } from "@argon-router/react";

import { LayoutJobseeker } from "@/layouts/jobseeker-layout.tsx";

import { currentRoute } from "./model";
import { CompanyChatPage } from "./ui.tsx";

export default createRouteView({
  view: CompanyChatPage,
  route: currentRoute,
  layout: LayoutJobseeker,
});
