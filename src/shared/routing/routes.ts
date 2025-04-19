import { RouteInstance, UnmappedRouteObject, createRoute } from "atomic-router";

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

  company: {
    vacancies: createRoute<{ companyId: string }>(),
    subscription: createRoute<{ companyId: string }>(),
    help: createRoute<{ companyId: string }>(),

    vacancy: {
      create: createRoute<{ companyId: string }>(),
      view: createRoute<{ companyId: string; vacancyId: string }>(),
      edit: createRoute<{ companyId: string; vacancyId: string }>(),
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
  {
    path: "/company/:companyId/vacancies",
    route: routes.company.vacancies as RouteInstance<object>,
  },
  {
    path: "/company/:companyId/subscription",
    route: routes.company.subscription as RouteInstance<object>,
  },
  {
    path: "/company/:companyId/help",
    route: routes.company.help as RouteInstance<object>,
  },
  {
    path: "/company/:companyId/vacancy/create",
    route: routes.company.vacancy.create as RouteInstance<object>,
  },
  {
    path: "/company/:companyId/vacancy/:vacancyId",
    route: routes.company.vacancy.view as RouteInstance<object>,
  },
  {
    path: "/company/:companyId/vacancy/:vacancyId/edit",
    route: routes.company.vacancy.edit as RouteInstance<object>,
  },
];
