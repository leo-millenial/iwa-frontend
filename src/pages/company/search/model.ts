import { sample } from "effector";

import { routes } from "@/shared/routing";
import { chainAuthenticated } from "@/shared/viewer";

export const currentRoute = routes.company.search;

export const authenticatedRoute = chainAuthenticated(currentRoute, {
  otherwise: routes.auth.signIn.open,
});

/*
  1. Страница открылась -> запросить список vacancy
  2. Поиск введен -> отправить запрос с фильтрами на поиск vacancy с debounce
 */

sample({
  clock: currentRoute.opened,
  // target: fetchVacancies.start,
});
