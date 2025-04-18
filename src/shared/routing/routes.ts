import { UnmappedRouteObject, createRoute } from "atomic-router";

export const routes = {
  home: createRoute(),
  auth: {
    signIn: createRoute(),
    finish: createRoute(),
    registration: createRoute(),
    registrationFlow: {
      fullName: createRoute(),
      phone: createRoute(),
      confirmPhone: createRoute(),
    },
  },
};

export const notFoundRoute = createRoute();

export const routesMap: UnmappedRouteObject<object>[] = [
  { path: "/", route: routes.home },
  { path: "/auth/sign-in", route: routes.auth.signIn },
  { path: "/auth/finish", route: routes.auth.finish },
  { path: "/auth/registration", route: routes.auth.registration },
  {
    path: "/auth/registration/fullname",
    route: routes.auth.registrationFlow.fullName,
  },
  {
    path: "/auth/registration/phone",
    route: routes.auth.registrationFlow.phone,
  },
  {
    path: "/auth/registration/confirm-phone",
    route: routes.auth.registrationFlow.confirmPhone,
  },
];
