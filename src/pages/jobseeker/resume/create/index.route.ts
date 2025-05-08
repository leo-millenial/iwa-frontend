import { createRouteView } from "@argon-router/react";

import { LayoutJobseeker } from "@/layouts/jobseeker-layout.tsx";

import { currentRoute } from "./model";
import { JobseekerResumeCreatePage } from "./ui";

export default createRouteView({
  view: JobseekerResumeCreatePage,
  route: currentRoute,
  layout: LayoutJobseeker,
});
