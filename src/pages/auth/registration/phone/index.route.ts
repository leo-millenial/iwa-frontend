import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model.ts";
import { AuthRegistrationPhonePage } from "./ui.tsx";

export default createRouteView({
  view: AuthRegistrationPhonePage,
  route: currentRoute,
});
