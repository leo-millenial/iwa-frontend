import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { JobseekerResumeCreatePage } from "./ui";

export default createRouteView({
  view: JobseekerResumeCreatePage,
  route: currentRoute,
});
