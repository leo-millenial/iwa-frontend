import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model.ts";
import { AuthRegistrationConfirmPhonePage } from "./ui.tsx";

export default createRouteView({
  view: AuthRegistrationConfirmPhonePage,
  route: currentRoute,
});
