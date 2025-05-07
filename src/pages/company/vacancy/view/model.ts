import { createEvent, createStore, sample } from "effector";

import { deleteVacancyMutation, getVacancyByIdQuery } from "@/shared/api/vacancy";
import { routes } from "@/shared/routing";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";

export const currentRoute = routes.company.vacancy.view;

export const editClicked = createEvent();
// export const authenticatedRoute = chainAuthenticated(currentRoute, {
//   otherwise: routes.auth.signIn.open, todo
// });

export const $vacancy = createStore<IVacancy | null>(null);
$vacancy.on(getVacancyByIdQuery.finished.success, (_, { result }) => result);

sample({
  clock: currentRoute.opened,
  source: currentRoute.$params,
  fn: ({ vacancyId }) => vacancyId,
  target: getVacancyByIdQuery.start,
});

sample({
  clock: deleteVacancyMutation.$succeeded,
  source: currentRoute.$params,
  fn: ({ companyId, vacancyId }) => ({ params: { companyId, vacancyId } }),
  target: routes.company.vacancies.open,
});

sample({
  clock: editClicked,
  source: currentRoute.$params,
  fn: ({ companyId, vacancyId }) => ({ params: { companyId, vacancyId } }),
  target: routes.company.vacancy.edit.open,
});
