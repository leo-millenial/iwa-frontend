import { currentRoute } from "./model.ts";
import { HelpPage } from "./ui.tsx";

export default {
  view: HelpPage,
  route: currentRoute,
};
