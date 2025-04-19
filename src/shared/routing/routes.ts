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

      jobseeker: {
        profile: createRoute(),
        experience: createRoute(),
        about: createRoute(),
      },

      company: {
        about: createRoute(),
      },
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
  {
    path: "/auth/registration/jobseeker/profile",
    route: routes.auth.registrationFlow.jobseeker.profile,
  },
  {
    path: "/auth/registration/jobseeker/experience",
    route: routes.auth.registrationFlow.jobseeker.experience,
  },
  {
    path: "/auth/registration/jobseeker/about",
    route: routes.auth.registrationFlow.jobseeker.about,
  },
  {
    path: "/auth/registration/company/about",
    route: routes.auth.registrationFlow.company.about,
  },
];
