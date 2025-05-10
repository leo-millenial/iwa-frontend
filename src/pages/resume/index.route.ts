import { createRouteView } from "@argon-router/react";

import { LayoutAnonymous } from "@/layouts/anonymous-layout.tsx";

import { currentRoute } from "./model.ts";
import { ResumePage } from "./ui.tsx";

export default createRouteView({
  view: ResumePage,
  route: currentRoute,
  layout: LayoutAnonymous,
});
