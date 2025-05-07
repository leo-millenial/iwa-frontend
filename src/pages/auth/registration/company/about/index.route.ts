import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { AuthRegistrationCompanyAboutPage } from "./ui.tsx";

export default createRouteView({
  view: AuthRegistrationCompanyAboutPage,
  route: currentRoute,
});
