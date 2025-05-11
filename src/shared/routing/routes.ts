import { createRoute } from "@argon-router/core";

export const routes = {
  home: createRoute({ path: "/" }),
  help: createRoute({ path: "/help" }),
  resume: createRoute({ path: "/resume/:resumeId" }),

  auth: {
    signIn: createRoute({ path: "/auth/sign-in" }),
    finish: createRoute({ path: "/auth/finish" }),
    registration: createRoute({ path: "/auth/registration" }),
    registrationFlow: {
      fullName: createRoute({ path: "/auth/registration/full-name" }),
      phone: createRoute({ path: "/auth/registration/phone" }),
      confirmPhone: createRoute({ path: "/auth/registration/confirm-phone" }),

      jobseeker: {
        profile: createRoute({ path: "/auth/registration/jobseeker/profile" }),
        experience: createRoute({ path: "/auth/registration/jobseeker/experience" }),
        about: createRoute({ path: "/auth/registration/jobseeker/about" }),
      },

      company: {
        about: createRoute({ path: "/auth/registration/company/about" }),
      },
    },
  },

  company: {
    search: createRoute({ path: "/company/:companyId" }),
    vacancies: createRoute({ path: "/company/:companyId/vacancies" }),
    subscription: createRoute({ path: "/company/:companyId/subscription" }),
    profile: createRoute({ path: "/company/:companyId/profile" }),

    vacancy: {
      create: createRoute({ path: "/company/:companyId/vacancy-create" }),
      view: createRoute({ path: "/company/:companyId/vacancy/:vacancyId" }),
      edit: createRoute({ path: "/company/:companyId/vacancy/:vacancyId/edit" }),
    },

    chats: createRoute({ path: "/company/:companyId/chats" }),
    chat: createRoute({ path: "/company/:companyId/chat/:chatId" }),
  },

  jobseeker: {
    search: createRoute({ path: "/jobseeker/:jobseekerId" }),
    profile: createRoute({ path: "/jobseeker/:jobseekerId/profile" }),
    resume: {
      create: createRoute({ path: "/jobseeker/:jobseekerId/resume-create" }),
      view: createRoute({ path: "/jobseeker/:jobseekerId/resume/:resumeId" }),
      edit: createRoute({ path: "/jobseeker/:jobseekerId/resume/:resumeId/edit" }),
    },

    chats: createRoute({ path: "/jobseeker/:jobseekerId/chats" }),
    chat: createRoute({ path: "/jobseeker/:jobseekerId/chat/:chatId" }),
  },
};

export const notFoundRoute = createRoute({ path: "*" });

export const routesMap = [
  routes.home,
  routes.help,
  routes.resume,

  /*Auth routes */
  routes.auth.signIn,
  routes.auth.finish,
  routes.auth.registration,
  routes.auth.registrationFlow.fullName,
  routes.auth.registrationFlow.phone,
  routes.auth.registrationFlow.confirmPhone,

  routes.auth.registrationFlow.jobseeker.profile,
  routes.auth.registrationFlow.jobseeker.experience,
  routes.auth.registrationFlow.jobseeker.about,

  routes.auth.registrationFlow.company.about,

  /* Company routes */
  routes.company.search,
  routes.company.vacancies,
  routes.company.subscription,
  routes.company.profile,
  routes.company.vacancy.create,
  routes.company.vacancy.view,
  routes.company.vacancy.edit,
  routes.company.chats,
  routes.company.chat,

  /* Jobseeker routes */
  routes.jobseeker.search,
  routes.jobseeker.profile,
  routes.jobseeker.resume.create,
  routes.jobseeker.resume.view,
  routes.jobseeker.resume.edit,
  routes.jobseeker.chats,
  routes.jobseeker.chat,

  /* END ROUTE */
  notFoundRoute,
];
