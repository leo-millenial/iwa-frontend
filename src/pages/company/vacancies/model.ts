import { createEvent, createStore, sample } from "effector";

import { deleteVacancyMutation, getVacanciesByCompanyIdQuery } from "@/shared/api/vacancy";
import { routes } from "@/shared/routing";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";
import { chainAuthenticated } from "@/shared/viewer";

export const currentRoute = routes.company.vacancies;
export const authenticatedRoute = chainAuthenticated(currentRoute, {
  otherwise: routes.auth.signIn.open,
});

export const viewVacancyClicked = createEvent<{ vacancyId: string }>();
export const editVacancyClicked = createEvent<{ vacancyId: string }>();
export const createVacancyClicked = createEvent();

export const $error = createStore<string | null>(null);
export const $pending = getVacanciesByCompanyIdQuery.$pending;
export const $vacancies = createStore<IVacancy[]>([]);

$vacancies.on(getVacanciesByCompanyIdQuery.finished.success, (_, { result }) => result);

sample({
  clock: [authenticatedRoute.opened, deleteVacancyMutation.$succeeded],
  source: authenticatedRoute.$params,
  fn: ({ companyId }) => companyId,
  target: getVacanciesByCompanyIdQuery.start,
});

sample({
  clock: viewVacancyClicked,
  source: authenticatedRoute.$params,
  fn: ({ companyId }, { vacancyId }) => ({ companyId, vacancyId }),
  target: routes.company.vacancy.view.open,
});

sample({
  clock: editVacancyClicked,
  source: authenticatedRoute.$params,
  fn: ({ companyId }, { vacancyId }) => ({ companyId, vacancyId }),
  target: routes.company.vacancy.edit.open,
});

sample({
  clock: createVacancyClicked,
  source: authenticatedRoute.$params,
  target: routes.company.vacancy.create.open,
});

sample({
  clock: getVacanciesByCompanyIdQuery.finished.failure,
  fn: () => "Ошибка загрузки вакансий",
  target: $error,
});
