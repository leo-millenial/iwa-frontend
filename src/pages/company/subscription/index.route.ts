import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { CompanySubscriptionPage } from "./ui.tsx";

export default createRouteView({
  view: CompanySubscriptionPage,
  route: currentRoute,
});
