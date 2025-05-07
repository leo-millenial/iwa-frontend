import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model.ts";
import { HelpPage } from "./ui.tsx";

export default createRouteView({
  view: HelpPage,
  route: currentRoute,
});
