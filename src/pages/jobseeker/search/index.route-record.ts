import { RouteInstance, RouteParams } from "atomic-router";
import { createRouteView } from "atomic-router-react";

import { PageLoader } from "@/shared/ui/page-loader.tsx";

import { authenticatedRoute, currentRoute } from "./model";
import { JobseekerSearchPage } from "./ui.tsx";

const typedAuthenticatedRoute = authenticatedRoute as unknown as RouteInstance<RouteParams>;

const AuthenticationView = createRouteView({
  route: typedAuthenticatedRoute,
  view: JobseekerSearchPage,
  otherwise: PageLoader,
});

export default {
  view: AuthenticationView,
  route: currentRoute,
};
