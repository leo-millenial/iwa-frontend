import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { HomePage } from "./ui.tsx";

export default createRouteView({
  view: HomePage,
  route: currentRoute,
});
