import { combine, createEvent, createStore, sample } from "effector";
import { or } from "patronum";

import { $sessionId } from "@/pages/auth/registration/model.ts";

import { completeRegistrationMutation, step5Mutation } from "@/shared/api/registration";
import { routes } from "@/shared/routing";
import {
  CertificateUrl,
  IEducation,
  ILanguage,
  ISkill,
  LanguageLevel,
  SkillLevel,
} from "@/shared/types/resume.interface";

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

export const setFormError = createEvent<AboutFormError>();

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

const $jobseekerDto = combine({
  education: $educations,
  skills: $skills,
  aboutMe: $aboutMe,
  languages: $languages,
});

$formError.reset(
  educationsChanged,
  skillsChanged,
  languagesChanged,
  aboutMeChanged,
  certificatesChanged,
);

sample({
  clock: formSubmitted,
  source: { sessionId: $sessionId, jobseeker: $jobseekerDto },
  target: step5Mutation.start,
});
