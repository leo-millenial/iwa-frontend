import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model.ts";
import { AuthRegistrationJobseekerProfilePage } from "./ui.tsx";

export default createRouteView({
  view: AuthRegistrationJobseekerProfilePage,
  route: currentRoute,
});
