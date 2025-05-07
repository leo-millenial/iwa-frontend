import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { JobseekerResumeEditPage } from "./ui.tsx";

export default createRouteView({
  view: JobseekerResumeEditPage,
  route: currentRoute,
});
