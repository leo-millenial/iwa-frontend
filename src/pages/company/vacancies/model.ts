import { createStore, sample } from "effector";

import { getVacanciesByCompanyIdQuery } from "@/shared/api/vacancy";
import { routes } from "@/shared/routing";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";
import { chainAuthenticated } from "@/shared/viewer";

export const currentRoute = routes.company.vacancies;
export const authenticatedRoute = chainAuthenticated(currentRoute, {
  otherwise: routes.auth.signIn.open,
});

export const $error = createStore<string | null>(null);
export const $pending = getVacanciesByCompanyIdQuery.$pending;
export const $vacancies = createStore<IVacancy[]>([]);

$vacancies.on(getVacanciesByCompanyIdQuery.finished.success, (_, { result }) => result);

sample({
  clock: authenticatedRoute.opened,
  source: authenticatedRoute.$params,
  fn: ({ companyId }) => companyId,
  target: getVacanciesByCompanyIdQuery.start,
});

sample({
  clock: getVacanciesByCompanyIdQuery.finished.failure,
  fn: () => "Ошибка загрузки вакансий",
  target: $error,
});
