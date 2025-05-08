import { createRouteView } from "@argon-router/react";

import { LayoutJobseeker } from "@/layouts/jobseeker-layout.tsx";

import { currentRoute } from "./model.ts";
import { JobseekerProfilePage } from "./ui.tsx";

export default createRouteView({
  route: currentRoute,
  view: JobseekerProfilePage,
  layout: LayoutJobseeker,
});
