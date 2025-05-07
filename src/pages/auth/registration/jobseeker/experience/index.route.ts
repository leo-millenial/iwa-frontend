import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model.ts";
import { AuthRegistrationJobseekerExperiencePage } from "./ui.tsx";

export default createRouteView({
  view: AuthRegistrationJobseekerExperiencePage,
  route: currentRoute,
});
