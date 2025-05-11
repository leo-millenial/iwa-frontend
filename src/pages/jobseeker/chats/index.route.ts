import { createRouteView } from "@argon-router/react";

import { LayoutJobseeker } from "@/layouts/jobseeker-layout.tsx";

import { currentRoute } from "./model";
import { ChatsPage } from "./ui.tsx";

export default createRouteView({
  view: ChatsPage,
  route: currentRoute,
  layout: LayoutJobseeker,
});
