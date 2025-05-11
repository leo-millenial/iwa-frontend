import { Route, RouteOpenedPayload, chainRoute } from "@argon-router/core";
import { createEvent, createStore, sample } from "effector";
import type { Effect, Event } from "effector";
import { persist } from "effector-storage/session";

import { getMeQuery } from "@/shared/api/user";
import { appStarted } from "@/shared/init";
import { routes } from "@/shared/routing";
import { clearToken } from "@/shared/tokens";
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

export interface Viewer {
  user: IUser;
  jobseeker?: IJobseeker;
  company?: ICompany;
}

export const viewerLoggedIn = createEvent();
export const viewerLoggedOut = createEvent();

export const $viewer = createStore<Viewer | null>(null);
export const $companyId = $viewer.map((viewer) => viewer?.company?._id ?? "");

persist({ store: $viewer, key: "viewer", pickup: appStarted });

sample({
  clock: viewerLoggedOut,
  target: [clearToken, routes.home.open, $viewer.reinit],
});

sample({
  clock: appStarted,
  target: getMeQuery.start,
});

// Создаем стор для хранения статуса авторизации
export const $viewerStatus = createStore(ViewerStatus.Initial);
persist({ store: $viewerStatus, key: "viewer_status", pickup: appStarted });

// Обновляем статус при запросе данных пользователя
$viewerStatus.on(getMeQuery.start, (status) => {
  if (status === ViewerStatus.Initial) return ViewerStatus.Pending;
  return status;
});

$viewer.on(getMeQuery.finished.success, (_, { result }) => {
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

export function chainAuthenticated<Params>(
  route: Route<Params>,
  {
    otherwise,
    requiredRole,
  }: {
    otherwise?:
      | Event<void>
      | Effect<void, unknown, unknown>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | Event<any>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | ((payload?: any) => any);
    requiredRole?: UserRole;
  } = {},
): Route<Params> {
  const authenticationCheckStarted = createEvent<RouteOpenedPayload<Params>>();
  const userAuthenticated = createEvent();
  const userAnonymous = createEvent();
  const userWrongRole = createEvent();

  const $routePayload = createStore<RouteOpenedPayload<Params> | null>(null)
    .on(authenticationCheckStarted, (_, payload) => payload)
    .reset([userAuthenticated, userAnonymous, userWrongRole]);

  sample({
    clock: authenticationCheckStarted,
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Initial,
    target: getMeQuery.start,
  });

  // Проверяем авторизацию сразу при запуске проверки
  sample({
    clock: authenticationCheckStarted,
    source: {
      status: $viewerStatus,
      viewer: $viewer,
      payload: $routePayload,
    },
    filter: ({ status, viewer, payload }) => {
      if (!payload) return false;

      // Если пользователь авторизован
      if (status === ViewerStatus.Authenticated) {
        // Проверяем роль, если она требуется
        if (requiredRole) {
          return viewer?.user.role === requiredRole;
        }
        return true;
      }
      return false;
    },
    fn: ({ payload }) => payload!,
    target: userAuthenticated,
  });

  // Проверяем авторизацию после успешного запроса
  sample({
    clock: getMeQuery.finished.success,
    source: {
      viewer: $viewer,
      payload: $routePayload,
    },
    filter: ({ viewer, payload }) => {
      if (!payload) return false;

      // Проверяем роль, если она требуется
      if (requiredRole) {
        return viewer?.user.role === requiredRole;
      }
      return true;
    },
    fn: ({ payload }) => payload!,
    target: userAuthenticated,
  });

  // Проверяем неавторизованного пользователя
  sample({
    clock: getMeQuery.finished.failure,
    source: {
      status: $viewerStatus,
      payload: $routePayload,
    },
    filter: ({ status, payload }) => {
      return Boolean(payload) && status === ViewerStatus.Anonymous;
    },
    fn: ({ payload }) => payload!,
    target: userAnonymous,
  });

  // Проверяем неправильную роль
  sample({
    clock: getMeQuery.finished.success,
    source: {
      viewer: $viewer,
      payload: $routePayload,
      status: $viewerStatus,
    },
    filter: ({ viewer, payload, status }) => {
      if (!payload || !requiredRole || status !== ViewerStatus.Authenticated) return false;
      return viewer?.user.role !== requiredRole;
    },
    fn: ({ payload }) => payload!,
    target: userWrongRole,
  });

  // Перенаправляем при отклонении, если указан маршрут
  if (otherwise) {
    sample({
      // @ts-expect-error
      clock: [userAnonymous, userWrongRole],
      filter: route.$isOpened,
      target: otherwise as Event<void>,
    });
  }

  return chainRoute({
    route,
    beforeOpen: authenticationCheckStarted,
    openOn: userAuthenticated,
    cancelOn: [userAnonymous, userWrongRole],
  });
}
