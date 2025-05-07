import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { CompanySearchPage } from "./ui.tsx";

export default createRouteView({
  view: CompanySearchPage,
  route: currentRoute,
});
