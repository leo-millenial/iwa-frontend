import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { CompanyVacancyEditPage } from "./ui.tsx";

export default createRouteView({
  view: CompanyVacancyEditPage,
  route: currentRoute,
});
