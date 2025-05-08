import { createRouteView } from "@argon-router/react";

import { LayoutJobseeker } from "@/layouts/jobseeker-layout.tsx";

import { currentRoute } from "./model";
import { JobseekerResumeViewPage } from "./ui.tsx";

export default createRouteView({
  view: JobseekerResumeViewPage,
  route: currentRoute,
  layout: LayoutJobseeker,
});
