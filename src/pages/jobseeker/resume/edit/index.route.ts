import { createRouteView } from "@argon-router/react";

import { LayoutJobseeker } from "@/layouts/jobseeker-layout.tsx";

import { currentRoute } from "./model";
import { JobseekerResumeEditPage } from "./ui.tsx";

export default createRouteView({
  view: JobseekerResumeEditPage,
  route: currentRoute,
  layout: LayoutJobseeker,
});
