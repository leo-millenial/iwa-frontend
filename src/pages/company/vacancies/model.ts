import { createEvent, createStore, sample } from "effector";

import { deleteVacancyMutation, getVacanciesByCompanyIdQuery } from "@/shared/api/vacancy";
import { routes } from "@/shared/routing";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";

export const currentRoute = routes.company.vacancies;
// export const authenticatedRoute = chainAuthenticated(currentRoute, {
//   otherwise: routes.auth.signIn.open,
// });

export const viewVacancyClicked = createEvent<{ vacancyId: string }>();
export const editVacancyClicked = createEvent<{ vacancyId: string }>();
export const createVacancyClicked = createEvent();

export const $error = createStore<string | null>(null);
export const $pending = getVacanciesByCompanyIdQuery.$pending;
export const $vacancies = createStore<IVacancy[]>([]);

$vacancies.on(getVacanciesByCompanyIdQuery.finished.success, (_, { result }) => result);

sample({
  clock: [currentRoute.opened, deleteVacancyMutation.$succeeded],
  source: currentRoute.$params,
  fn: ({ companyId }) => companyId,
  target: getVacanciesByCompanyIdQuery.start,
});

sample({
  clock: viewVacancyClicked,
  source: currentRoute.$params,
  fn: ({ companyId }, { vacancyId }) => ({ params: { companyId, vacancyId } }),
  target: routes.company.vacancy.view.open,
});

sample({
  clock: editVacancyClicked,
  source: currentRoute.$params,
  fn: ({ companyId }, { vacancyId }) => ({ params: { companyId, vacancyId } }),
  target: routes.company.vacancy.edit.open,
});

sample({
  clock: createVacancyClicked,
  source: currentRoute.$params,
  fn: ({ companyId }) => ({ params: { companyId } }),
  target: routes.company.vacancy.create.open,
});

sample({
  clock: getVacanciesByCompanyIdQuery.finished.failure,
  fn: () => "Ошибка загрузки вакансий",
  target: $error,
});
