import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model.ts";
import { JobseekerProfilePage } from "./ui.tsx";

export default createRouteView({
  view: JobseekerProfilePage,
  route: currentRoute,
});
