import { createRouteView } from "@argon-router/react";

import { currentRoute } from "./model";
import { CompanyVacancyCreatePage } from "./ui.tsx";

export default createRouteView({
  view: CompanyVacancyCreatePage,
  route: currentRoute,
});
