import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { JobseekerResumeViewPage } from "./ui.tsx";

export default createRouteView({
  view: JobseekerResumeViewPage,
  route: currentRoute,
});
