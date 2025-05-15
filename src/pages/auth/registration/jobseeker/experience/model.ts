import { createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/session";
import { debug, or } from "patronum";

import { PERSIST_KEYS } from "@/pages/auth/registration/jobseeker/experience/consts.ts";

import { step3Mutation } from "@/shared/api/registration";
import { appStarted } from "@/shared/init";
import { routes } from "@/shared/routing";

export enum EmploymentType {
  FullTime = "FullTime",
  PartTime = "PartTime",
  Remote = "Remote",
  Office = "Office",
  Hybrid = "Hybrid",
}

export interface IWorkExperience {
  id: string;
  position?: string;
  company?: string;
  employmentType?: EmploymentType;
  startDate?: Date | null;
  endDate?: Date | null;
  website?: string;
  responsibilitiesDescription?: string;
  currentJob?: boolean;
}

export const currentRoute = routes.auth.registrationFlow.jobseeker.experience;

export type ExperienceFormError = null | "EMPTY_REQUIRED_FIELDS" | "INVALID_DATES" | "SERVER_ERROR";

export const formSubmitted = createEvent();
export const experienceAdded = createEvent<IWorkExperience>();
export const experienceEdited = createEvent<IWorkExperience>();
export const experienceRemoved = createEvent<string>();
export const experienceEditStarted = createEvent<IWorkExperience>();
export const experienceEditCancelled = createEvent();
export const activeExperienceIndexChanged = createEvent<number>();
export const currentExperienceChanged = createEvent<Partial<IWorkExperience>>();
export const setFormError = createEvent<ExperienceFormError>();
export const autoAddCurrentExperience = createEvent<IWorkExperience>();

export const $workExperiences = createStore<IWorkExperience[]>([]);

export const $currentExperience = createStore<IWorkExperience>({
  id: crypto.randomUUID(),
  currentJob: false,
});
export const $isEditing = createStore<boolean>(false);
export const $activeExperienceIndex = createStore<number>(0);
export const $formError = createStore<ExperienceFormError>(null);
export const $pending = or(step3Mutation.$pending);

const isValidExperience = (experience: IWorkExperience): boolean => {
  return Boolean(
    experience.position?.trim() &&
      experience.company?.trim() &&
      experience.startDate instanceof Date,
  );
};

persist({
  store: $workExperiences,
  key: PERSIST_KEYS.EXPERIENCE,
  pickup: appStarted,
});

$workExperiences
  .on(experienceAdded, (state, experience) => [...state, experience])
  .on(experienceEdited, (state, editedExperience) =>
    state.map((exp) => (exp.id === editedExperience.id ? editedExperience : exp)),
  )
  .on(experienceRemoved, (state, id) => state.filter((exp) => exp.id !== id))
  .on(autoAddCurrentExperience, (state, experience) => [...state, experience]);

debug({ $workExperiences });

$currentExperience
  .on(currentExperienceChanged, (state, changes) => ({ ...state, ...changes }))
  .on(experienceEditStarted, (_, experience) => experience)
  .reset(experienceAdded)
  .reset(experienceEdited)
  .on(experienceEditCancelled, () => ({
    id: crypto.randomUUID(),
    currentJob: false,
  }));

$isEditing
  .on(experienceEditStarted, () => true)
  .on(experienceEditCancelled, () => false)
  .on(experienceAdded, () => false)
  .on(experienceEdited, () => false);

$activeExperienceIndex
  .on(activeExperienceIndexChanged, (_, index) => index)
  .on(experienceRemoved, (state, id) => {
    const index = $workExperiences.getState().findIndex((exp) => exp.id === id);
    const newLength = $workExperiences.getState().length - 1;

    if (newLength === 0) return 0;
    if (index <= state) return Math.max(0, state - 1);
    return state;
  });

$formError
  .on(setFormError, (_, error) => error)
  .reset(currentExperienceChanged)
  .reset(experienceAdded)
  .reset(experienceEdited)
  .reset(experienceRemoved);

sample({
  clock: formSubmitted,
  source: {
    currentExperience: $currentExperience,
    workExperiences: $workExperiences,
  },
  filter: ({ currentExperience, workExperiences }) =>
    workExperiences.length === 0 && isValidExperience(currentExperience),
  fn: ({ currentExperience }) => currentExperience,
  target: autoAddCurrentExperience,
});

sample({
  clock: formSubmitted,
  source: {
    currentExperience: $currentExperience,
    workExperiences: $workExperiences,
  },
  filter: ({ currentExperience, workExperiences }) =>
    workExperiences.length === 0 && !isValidExperience(currentExperience),
  fn: () => "EMPTY_REQUIRED_FIELDS" as const,
  target: setFormError,
});

sample({
  clock: formSubmitted,
  source: $formError,
  filter: (formError) => formError === null,
  fn: () => ({}),
  target: routes.auth.registrationFlow.jobseeker.about.open,
});

sample({
  clock: autoAddCurrentExperience,
  fn: () => ({}),
  target: routes.auth.registrationFlow.jobseeker.about.open,
});
