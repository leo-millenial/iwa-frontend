import { createRouter } from "@argon-router/core";
import { createRouterControls } from "@argon-router/core";
import { sample } from "effector";
import { createBrowserHistory } from "history";

import { appStarted } from "../init";
import { routesMap } from "./routes";

export { routes } from "./routes";

export const router = createRouter({
  routes: routesMap,
});

export const controls = createRouterControls();

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: [router.setHistory, controls.setHistory],
});
