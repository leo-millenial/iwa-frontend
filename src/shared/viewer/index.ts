import { RouteInstance, RouteParams, RouteParamsAndQuery, chainRoute } from "atomic-router";
import { Effect, Event, createEvent, createStore, sample } from "effector";

import { getMeQuery } from "@/shared/api/user";
import { ICompany } from "@/shared/types/company.interface.ts";
import { IJobseeker } from "@/shared/types/jobseeker.interface.ts";
import { IUser, UserRole } from "@/shared/types/user.interface.ts";

// Определяем возможные статусы пользователя
export enum ViewerStatus {
  Initial = 0,
  Pending,
  Authenticated,
  Anonymous,
}

interface Viewer {
  user: IUser;
  jobseeker?: IJobseeker;
  company?: ICompany;
}

export const viewerLoggedIn = createEvent();
export const viewerLoggedOut = createEvent();

export const $viewer = createStore<Viewer | null>(null);

// Создаем стор для хранения статуса авторизации
export const $viewerStatus = createStore(ViewerStatus.Initial);

// Обновляем статус при запросе данных пользователя
$viewerStatus.on(getMeQuery.start, (status) => {
  if (status === ViewerStatus.Initial) return ViewerStatus.Pending;
  return status;
});

// Обновляем данные и статус при успешном получении данных пользователя
$viewer.on(getMeQuery.finished.success, (_, { result }) => {
  // Адаптируем данные API к нашему интерфейсу Viewer
  return {
    user: {
      ...result.user,
      role: result.user.role === "Company" ? UserRole.Company : UserRole.Jobseeker,
    },
    jobseeker: result.jobseeker,
    company: result.company,
  } as Viewer;
});
$viewerStatus.on(getMeQuery.finished.success, () => ViewerStatus.Authenticated);

$viewerStatus.on(getMeQuery.finished.failure, (status, { error }) => {
  if (error && typeof error === "object" && "status" in error) {
    const statusCode = (error as { status: number }).status;
    if (statusCode === 401 || statusCode === 403) {
      return ViewerStatus.Anonymous;
    }
  }

  // Если это первый запрос и произошла ошибка, переходим в Anonymous
  if (status === ViewerStatus.Pending) {
    return ViewerStatus.Anonymous;
  }

  // Иначе сохраняем текущий статус
  return status;
});

// Обновляем статус при входе и выходе пользователя
$viewerStatus.on(viewerLoggedIn, () => ViewerStatus.Authenticated);
$viewerStatus.on(viewerLoggedOut, () => ViewerStatus.Anonymous);

// Создаем стор для хранения состояния авторизации (для совместимости)
export const $isAuthenticated = $viewerStatus.map(
  (status) => status === ViewerStatus.Authenticated,
);

// Функция для защиты маршрутов, требующих авторизации
export function chainAuthenticated<Params extends RouteParams>(
  route: RouteInstance<Params>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { otherwise }: { otherwise?: Event<void> | Effect<void, any, any> } = {},
): RouteInstance<Params> {
  const authenticationCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
  const userAuthenticated = createEvent();
  const userAnonymous = createEvent();

  // Запрашиваем данные пользователя, если статус Initial
  sample({
    clock: authenticationCheckStarted,
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Initial,
    target: getMeQuery.start,
  });

  // Если пользователь авторизован, открываем маршрут
  sample({
    clock: [authenticationCheckStarted, getMeQuery.finished.success],
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Authenticated,
    target: userAuthenticated,
  });

  // Если пользователь не авторизован, отменяем открытие маршрута
  sample({
    clock: [authenticationCheckStarted, getMeQuery.finished.success, getMeQuery.finished.failure],
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Anonymous,
    target: userAnonymous,
  });

  // Если указан маршрут для перенаправления, используем его
  if (otherwise) {
    sample({
      // @ts-expect-error
      clock: userAnonymous,
      filter: route.$isOpened,
      target: otherwise as Event<void>,
    });
  }

  return chainRoute({
    route,
    beforeOpen: authenticationCheckStarted,
    openOn: [userAuthenticated],
    cancelOn: [userAnonymous],
  });
}

// Функция для защиты маршрутов, доступных только неавторизованным пользователям
export function chainAnonymous<Params extends RouteParams>(
  route: RouteInstance<Params>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { otherwise }: { otherwise?: Event<void> | Effect<void, any, any> } = {},
): RouteInstance<Params> {
  const authenticationCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
  const userAuthenticated = createEvent();
  const userAnonymous = createEvent();

  // Запрашиваем данные пользователя, если статус Initial
  sample({
    clock: authenticationCheckStarted,
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Initial,
    target: getMeQuery.start,
  });

  // Если пользователь авторизован, отменяем открытие маршрута
  sample({
    clock: [authenticationCheckStarted, getMeQuery.finished.success],
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Authenticated,
    target: userAuthenticated,
  });

  // Если пользователь не авторизован, открываем маршрут
  sample({
    clock: [authenticationCheckStarted, getMeQuery.finished.success, getMeQuery.finished.failure],
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Anonymous,
    target: userAnonymous,
  });

  // Если указан маршрут для перенаправления, используем его
  if (otherwise) {
    sample({
      // @ts-expect-error
      clock: userAuthenticated,
      filter: route.$isOpened,
      target: otherwise as Event<void>,
    });
  }

  return chainRoute({
    route,
    beforeOpen: authenticationCheckStarted,
    openOn: [userAnonymous],
    cancelOn: [userAuthenticated],
  });
}
