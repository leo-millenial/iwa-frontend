import { createRouteView } from "@argon-router/react";

import { AuthRegistrationPage } from "./index.tsx";
import { currentRoute } from "./model";

export default createRouteView({
  view: AuthRegistrationPage,
  route: currentRoute,
});
