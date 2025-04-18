import { RouteInstance, UnmappedRouteObject, createRoute } from "atomic-router";

export const routes = {
  home: createRoute(),
  auth: {
    signIn: createRoute(),
    finish: createRoute(),
    registration: createRoute(),
    registrationFlow: {
      jobseeker: createRoute<{ step: string }>(),
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
    path: "/auth/registration/jobseeker/:step",
    route: routes.auth.registrationFlow.jobseeker as RouteInstance<object>,
  },
];
