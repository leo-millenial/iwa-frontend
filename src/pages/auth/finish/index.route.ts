import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model.ts";
import { AuthRegistrationFinishPage } from "./ui.tsx";

export default createRouteView({
  view: AuthRegistrationFinishPage,
  route: currentRoute,
});
