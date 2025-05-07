import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model.ts";
import { AuthRegistrationFullNamePage } from "./ui.tsx";

export default createRouteView({
  view: AuthRegistrationFullNamePage,
  route: currentRoute,
});
