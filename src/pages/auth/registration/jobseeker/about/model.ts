import { combine, createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/session";
import { and, or } from "patronum";

import {
  $completedStep,
  $email,
  $sessionId,
  RegistrationStep,
  registrationResponseSucceed,
} from "@/pages/auth/registration/model.ts";
import { $normalizedPhone } from "@/pages/auth/registration/phone/model.ts";

import { completeRegistrationMutation, step5Mutation } from "@/shared/api/registration";
import { appStarted } from "@/shared/init";
import { routes } from "@/shared/routing";
import { setToken } from "@/shared/tokens";
import {
  CertificateUrl,
  IEducation,
  ILanguage,
  ISkill,
  LanguageLevel,
  SkillLevel,
} from "@/shared/types/resume.interface";

import { $workExperiences } from "../experience/model.ts";
import {
  $birthDate,
  $city,
  $currency,
  $firstName,
  $gender,
  $lastName,
  $middleName,
  $position,
  $region,
  $salary,
} from "../profile/model.ts";
import { PERSIST_KEYS } from "./consts.ts";

export const currentRoute = routes.auth.registrationFlow.jobseeker.about;

export type AboutFormError =
  | null
  | "EMPTY_FORM"
  | "INVALID_EDUCATION"
  | "INVALID_SKILLS"
  | "INVALID_LANGUAGES"
  | "ABOUT_ME_TOO_LONG"
  | "SERVER_ERROR";

export const formSubmitted = createEvent();

export const educationsChanged = createEvent<IEducation[]>();
export const skillsChanged = createEvent<ISkill[]>();
export const languagesChanged = createEvent<ILanguage[]>();
export const aboutMeChanged = createEvent<string>();
export const certificatesChanged = createEvent<CertificateUrl[]>();
export const setFormError = createEvent<AboutFormError>();

export const educationAdded = createEvent();
export const educationRemoved = createEvent<number>();
export const skillAdded = createEvent();
export const skillRemoved = createEvent<number>();
export const languageAdded = createEvent();
export const languageRemoved = createEvent<number>();
export const certificateAdded = createEvent<CertificateUrl[]>();
export const certificateRemoved = createEvent<number>();

export const educationFieldChanged = createEvent<{
  index: number;
  field: keyof IEducation;
  value: string | Date;
}>();
export const skillFieldChanged = createEvent<{
  index: number;
  field: keyof ISkill;
  value: string | SkillLevel;
}>();
export const languageFieldChanged = createEvent<{
  index: number;
  field: keyof ILanguage;
  value: string | LanguageLevel;
}>();

// Хранилища для состояния формы
export const $educations = createStore<IEducation[]>([
  {
    university: "",
    faculty: "",
    degree: "",
    graduationDate: new Date(),
  },
]);

export const $skills = createStore<ISkill[]>([
  {
    name: "",
    level: SkillLevel.Beginner,
  },
]);

export const $languages = createStore<ILanguage[]>([
  {
    name: "",
    level: LanguageLevel.Beginner,
  },
]);

export const $aboutMe = createStore<string>("");
export const $certificates = createStore<CertificateUrl[]>([]);
export const $pending = or(step5Mutation.$pending, completeRegistrationMutation.$pending);
export const $formError = createStore<AboutFormError>(null);

persist({
  store: $educations,
  key: PERSIST_KEYS.EDUCATIONS,
  pickup: appStarted,
});

persist({
  store: $skills,
  key: PERSIST_KEYS.SKILLS,
  pickup: appStarted,
});

persist({
  store: $languages,
  key: PERSIST_KEYS.LANGUAGES,
  pickup: appStarted,
});

persist({
  store: $aboutMe,
  key: PERSIST_KEYS.ABOUT_ME,
  pickup: appStarted,
});

persist({
  store: $certificates,
  key: PERSIST_KEYS.CERTIFICATES,
  pickup: appStarted,
});

$educations
  .on(educationsChanged, (_, educations) => educations)
  .on(educationAdded, (state) => [
    ...state,
    { university: "", faculty: "", degree: "", graduationDate: new Date() },
  ])
  .on(educationRemoved, (state, index) => state.filter((_, i) => i !== index))
  .on(educationFieldChanged, (state, { index, field, value }) => {
    const newState = [...state];
    newState[index] = { ...newState[index], [field]: value };
    return newState;
  });

$skills
  .on(skillsChanged, (_, skills) => skills)
  .on(skillAdded, (state) => [...state, { name: "", level: SkillLevel.Beginner }])
  .on(skillRemoved, (state, index) => state.filter((_, i) => i !== index))
  .on(skillFieldChanged, (state, { index, field, value }) => {
    const newState = [...state];
    newState[index] = { ...newState[index], [field]: value };
    return newState;
  });

$languages
  .on(languagesChanged, (_, languages) => languages)
  .on(languageAdded, (state) => [...state, { name: "", level: LanguageLevel.Beginner }])
  .on(languageRemoved, (state, index) => state.filter((_, i) => i !== index))
  .on(languageFieldChanged, (state, { index, field, value }) => {
    const newState = [...state];
    newState[index] = { ...newState[index], [field]: value };
    return newState;
  });

$aboutMe.on(aboutMeChanged, (_, aboutMe) => aboutMe);

$certificates
  .on(certificatesChanged, (_, certificates) => certificates)
  .on(certificateAdded, (state, newCertificates) => [...state, ...newCertificates])
  .on(certificateRemoved, (state, index) => state.filter((_, i) => i !== index));

$formError
  .on(setFormError, (_, error) => error)
  .reset(
    educationsChanged,
    skillsChanged,
    languagesChanged,
    aboutMeChanged,
    certificatesChanged,
    educationFieldChanged,
    skillFieldChanged,
    languageFieldChanged,
    certificateAdded,
    certificateRemoved,
  );

const $profileDto = combine({
  position: $position,
  income: combine({
    amount: $salary,
    currency: $currency,
  }),
  fullName: combine({
    firstName: $firstName,
    lastName: $lastName,
    middleName: $middleName,
  }),
  phone: $normalizedPhone,
  gender: $gender,
  birthday: $birthDate,
  region: $region,
});

const $resumeDto = combine({
  position: $position,
  income: combine({
    amount: $salary,
    currency: $currency,
  }),
  fullName: combine({
    firstName: $firstName,
    lastName: $lastName,
    middleName: $middleName,
  }),
  gender: $gender,
  birthday: $birthDate,
  email: $email,
  phone: $normalizedPhone,
  city: $city,
  workExperience: $workExperiences,

  education: $educations,
  skills: $skills,
  aboutMe: $aboutMe,
  languages: $languages,
  certificates: $certificates,
});

const $jobseekerDto = combine(
  {
    profile: $profileDto,
    resume: $resumeDto,
  },
  ({ profile, resume }) => ({
    profile,
    resumes: [resume],
  }),
);

const $educationsValid = $educations.map(
  (educations) =>
    educations.length > 0 &&
    educations.every(
      (edu) =>
        Boolean(edu.university.trim()) && Boolean(edu.faculty.trim()) && Boolean(edu.degree.trim()),
    ),
);

const $skillsValid = $skills.map(
  (skills) => skills.length > 0 && skills.every((skill) => Boolean(skill.name.trim())),
);

const $languagesValid = $languages.map(
  (languages) => languages.length > 0 && languages.every((lang) => Boolean(lang.name.trim())),
);

const $aboutMeValid = $aboutMe.map((aboutMe) => aboutMe.length <= 1000 && aboutMe.length > 0);

export const $formIsValid = and($educationsValid, $skillsValid, $languagesValid, $aboutMeValid);

// Проверка формы при отправке
sample({
  clock: formSubmitted,
  source: {
    educationsValid: $educationsValid,
    skillsValid: $skillsValid,
    languagesValid: $languagesValid,
    aboutMeValid: $aboutMeValid,
  },
  filter: ({ educationsValid, skillsValid, languagesValid, aboutMeValid }) =>
    !educationsValid || !skillsValid || !languagesValid || !aboutMeValid,
  fn: ({ educationsValid, skillsValid, languagesValid, aboutMeValid }) => {
    if (!educationsValid) return "INVALID_EDUCATION";
    if (!skillsValid) return "INVALID_SKILLS";
    if (!languagesValid) return "INVALID_LANGUAGES";
    if (!aboutMeValid) return "ABOUT_ME_TOO_LONG";
    return "EMPTY_FORM";
  },
  target: setFormError,
});

sample({
  clock: formSubmitted,
  source: { sessionId: $sessionId, jobseeker: $jobseekerDto },
  filter: $formIsValid,
  target: step5Mutation.start,
});

sample({
  clock: step5Mutation.finished.success,
  fn: ({ result }) => ({
    currentStep: result.currentStep,
    sessionId: result.sessionId,
  }),
  target: registrationResponseSucceed,
});

sample({
  clock: $completedStep,
  source: { sessionId: $sessionId },
  filter: (_, step) => step === RegistrationStep.SendDataSucceed,
  target: completeRegistrationMutation.start,
});

sample({
  clock: completeRegistrationMutation.finished.success,
  fn: ({ result }) => {
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  },
  target: setToken,
});

sample({
  clock: completeRegistrationMutation.$succeeded,
  target: routes.auth.finish.open,
});

sample({
  clock: step5Mutation.finished.failure,
  fn: () => "SERVER_ERROR" as const,
  target: setFormError,
});
