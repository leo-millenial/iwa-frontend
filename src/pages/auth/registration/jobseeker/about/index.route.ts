import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model.ts";
import { AuthRegistrationJobseekerAboutPage } from "./ui.tsx";

export default createRouteView({
  view: AuthRegistrationJobseekerAboutPage,
  route: currentRoute,
});
