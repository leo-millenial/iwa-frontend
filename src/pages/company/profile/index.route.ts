import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { CompanyProfilePage } from "./ui.tsx";

// const AuthenticationView = createRouteView({
//   route: authenticatedRoute as unknown as RouteInstance<RouteParams>,
//   view: CompanyProfilePage,
//   otherwise: PageLoader,
// });

export default createRouteView({
  view: CompanyProfilePage,
  route: currentRoute,
});
