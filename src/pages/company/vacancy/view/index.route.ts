import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { CompanyVacancyViewPage } from "./ui.tsx";

export default createRouteView({
  view: CompanyVacancyViewPage,
  route: currentRoute,
});
