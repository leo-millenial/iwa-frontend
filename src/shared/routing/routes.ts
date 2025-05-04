import { RouteInstance, UnmappedRouteObject, createRoute } from "atomic-router";

export const routes = {
  home: createRoute(),
  help: createRoute(),
  resume: createRoute<{ resumeId: string }>(),

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
    search: createRoute<{ companyId: string }>(),
    vacancies: createRoute<{ companyId: string }>(),
    subscription: createRoute<{ companyId: string }>(),
    profile: createRoute<{ companyId: string }>(),

    vacancy: {
      create: createRoute<{ companyId: string }>(),
      view: createRoute<{ companyId: string; vacancyId: string }>(),
      edit: createRoute<{ companyId: string; vacancyId: string }>(),
    },
  },

  jobseeker: {
    search: createRoute<{ jobseekerId: string }>(),
    resume: {
      create: createRoute<{ jobseekerId: string }>(),
      view: createRoute<{ jobseekerId: string; resumeId: string }>(),
      edit: createRoute<{ jobseekerId: string; resumeId: string }>(),
    },
  },
};

export const notFoundRoute = createRoute();

export const routesMap: UnmappedRouteObject<object>[] = [
  /* Not Auth routes */
  { path: "/", route: routes.home },
  {
    path: "/help",
    route: routes.help as RouteInstance<object>,
  },
  /* Auth */
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
    path: "/resume/:resumeId",
    route: routes.resume as RouteInstance<object>,
  },
  /* Auth routes */
  /* Company routes */
  {
    path: "/company/:companyId",
    route: routes.company.search as RouteInstance<object>,
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
    path: "/company/:companyId/vacancy-create",
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
  {
    path: "/company/:companyId/profile",
    route: routes.company.profile as RouteInstance<object>,
  },
  /* Jobseeker routes */
  {
    path: "/jobseeker/:jobseekerId",
    route: routes.jobseeker.search as RouteInstance<object>,
  },
  {
    path: "/jobseeker/:jobseekerId/resume/create",
    route: routes.jobseeker.resume.create as RouteInstance<object>,
  },
  {
    path: "/jobseeker/:jobseekerId/resume/:resumeId",
    route: routes.jobseeker.resume.view as RouteInstance<object>,
  },
  {
    path: "/jobseeker/:jobseekerId/resume/:resumeId/edit",
    route: routes.jobseeker.resume.edit as RouteInstance<object>,
  },
];
