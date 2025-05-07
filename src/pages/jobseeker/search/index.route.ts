import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { JobseekerSearchPage } from "./ui.tsx";

export default createRouteView({
  view: JobseekerSearchPage,
  route: currentRoute,
});
