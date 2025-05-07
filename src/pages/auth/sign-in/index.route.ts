import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { AuthSignInPage } from "./ui.tsx";

export default createRouteView({
  view: AuthSignInPage,
  route: currentRoute,
});
