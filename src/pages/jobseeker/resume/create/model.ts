import { combine, createEffect, createEvent, createStore, sample } from "effector";
import { debug } from "patronum";

import { fileUrlByFileId } from "@/shared/config";
import { routes } from "@/shared/routing";
import {
  CertificateUrl,
  Gender,
  IEducation,
  IFullName,
  ILanguage,
  IResume,
  ISkill,
  IWorkExperience,
  Income,
  LanguageLevel,
  SkillLevel,
} from "@/shared/types/resume.interface";
import { EmploymentType } from "@/shared/types/vacancy.interface";

export const currentRoute = routes.jobseeker.resume.create;

export interface ResumeForm {
  photo: string;
  video: string;
  jobseekerId: string;
  position: string;
  income?: Income;
  fullName?: IFullName;
  gender?: Gender;
  birthday?: Date;
  email: string;
  phone: string;
  city: string;
  workExperience: IWorkExperience[];
  education: IEducation[];
  skills: ISkill[];
  aboutMe: string;
  certificates: CertificateUrl[];
  languages: ILanguage[];
}

// Тип для ошибок формы резюме
export type ResumeFormError =
  | null
  | "EMPTY_FORM"
  | "INVALID_PERSONAL_INFO"
  | "INVALID_WORK_EXPERIENCE"
  | "INVALID_EDUCATION"
  | "INVALID_SKILLS"
  | "INVALID_LANGUAGES"
  | "SERVER_ERROR";

export const positionChanged = createEvent<string>();
export const genderChanged = createEvent<Gender>();
export const birthdayChanged = createEvent<Date | null>();
export const emailChanged = createEvent<string>();
export const phoneChanged = createEvent<string>();
export const cityChanged = createEvent<string>();
export const aboutMeChanged = createEvent<string>();
export const jobseekerIdChanged = createEvent<string>();
export const incomeAmountChanged = createEvent<number>();
export const incomeCurrencyChanged = createEvent<string>();

export const updateFullName = createEvent<{ field: keyof IFullName; value: string }>();
export const updateIncome = createEvent<{ field: keyof Income; value: number | string | null }>();

export const addWorkExperience = createEvent();
export const updateWorkExperience = createEvent<{
  index: number;
  field: keyof IWorkExperience;
  value: string | Date | EmploymentType | null;
}>();
export const removeWorkExperience = createEvent<number>();

export const addEducation = createEvent();
export const updateEducation = createEvent<{
  index: number;
  field: keyof IEducation;
  value: string | Date;
}>();
export const removeEducation = createEvent<number>();

export const addSkill = createEvent();
export const updateSkill = createEvent<{
  index: number;
  field: keyof ISkill;
  value: string | SkillLevel;
}>();
export const removeSkill = createEvent<number>();

export const addLanguage = createEvent();
export const updateLanguage = createEvent<{
  index: number;
  field: keyof ILanguage;
  value: string | LanguageLevel;
}>();
export const removeLanguage = createEvent<number>();

export const addCertificate = createEvent();
export const updateCertificate = createEvent<{
  index: number;
  value: string;
}>();
export const removeCertificate = createEvent<number>();

export const photoChanged = createEvent<string>();
export const uploadVideo = createEvent<File>();
export const removeVideo = createEvent();

export const submitForm = createEvent();
export const resetForm = createEvent();
export const setFormError = createEvent<ResumeFormError>();

export const uploadVideoFx = createEffect<File, string, Error>(async (file) => {
  return URL.createObjectURL(file);
});

export const createResumeFx = createEffect<ResumeForm, IResume, Error>(async (resumeData) => {
  return {
    ...resumeData,
    _id: Math.random().toString(36).substring(2, 15),
    jobseekerId: resumeData.jobseekerId || Math.random().toString(36).substring(2, 15),
  } as IResume;
});

export const $photo = createStore<string>("")
  .on(photoChanged, (_, fileId) => fileUrlByFileId(fileId))
  .reset(resetForm);

export const $video = createStore<string>("")
  .on(uploadVideoFx.doneData, (_, videoUrl) => videoUrl)
  .on(removeVideo, () => "")
  .reset(resetForm);

export const $jobseekerId = createStore<string>("")
  .on(jobseekerIdChanged, (_, value) => value)
  .reset(resetForm);

export const $position = createStore<string>("")
  .on(positionChanged, (_, value) => value)
  .reset(resetForm);

debug({ incomeAmountChanged });

export const $incomeAmount = createStore<number>(0)
  .on(incomeAmountChanged, (_, amount) => amount)
  .reset(resetForm);

export const $incomeCurrency = createStore<string>("")
  .on(incomeCurrencyChanged, (_, currency) => currency)
  .reset(resetForm);

export const $firstName = createStore<string>("")
  .on(updateFullName, (state, { field, value }) => (field === "firstName" ? value : state))
  .reset(resetForm);

export const $lastName = createStore<string>("")
  .on(updateFullName, (state, { field, value }) => (field === "lastName" ? value : state))
  .reset(resetForm);

export const $patronymic = createStore<string>("")
  .on(updateFullName, (state, { field, value }) => (field === "patronymic" ? value : state))
  .reset(resetForm);

export const $gender = createStore<Gender>(Gender.Male)
  .on(genderChanged, (_, value) => value)
  .reset(resetForm);

export const $birthday = createStore<Date | null>(null)
  .on(birthdayChanged, (_, value) => value)
  .reset(resetForm);

export const $email = createStore<string>("")
  .on(emailChanged, (_, value) => value)
  .reset(resetForm);

export const $phone = createStore<string>("")
  .on(phoneChanged, (_, value) => value)
  .reset(resetForm);

export const $city = createStore<string>("")
  .on(cityChanged, (_, value) => value)
  .reset(resetForm);

export const $aboutMe = createStore<string>("")
  .on(aboutMeChanged, (_, value) => value)
  .reset(resetForm);

export const $workExperience = createStore<IWorkExperience[]>([])
  .on(addWorkExperience, (state) => [
    ...state,
    {
      position: "",
      company: "",
      employmentType: EmploymentType.FullTime,
      startDate: new Date(),
      endDate: null,
      responsibilitiesDescription: "",
    },
  ])
  .on(updateWorkExperience, (state, { index, field, value }) =>
    state.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
  )
  .on(removeWorkExperience, (state, index) => state.filter((_, i) => i !== index))
  .reset(resetForm);

export const $education = createStore<IEducation[]>([])
  .on(addEducation, (state) => [
    ...state,
    {
      university: "",
      faculty: "",
      degree: "",
      graduationDate: new Date(),
    },
  ])
  .on(updateEducation, (state, { index, field, value }) =>
    state.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
  )
  .on(removeEducation, (state, index) => state.filter((_, i) => i !== index))
  .reset(resetForm);

export const $skills = createStore<ISkill[]>([])
  .on(addSkill, (state) => [
    ...state,
    {
      name: "",
      level: SkillLevel.Beginner,
    },
  ])
  .on(updateSkill, (state, { index, field, value }) =>
    state.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill)),
  )
  .on(removeSkill, (state, index) => state.filter((_, i) => i !== index))
  .reset(resetForm);

export const $languages = createStore<ILanguage[]>([])
  .on(addLanguage, (state) => [
    ...state,
    {
      name: "",
      level: LanguageLevel.Beginner,
    },
  ])
  .on(updateLanguage, (state, { index, field, value }) =>
    state.map((lang, i) => (i === index ? { ...lang, [field]: value } : lang)),
  )
  .on(removeLanguage, (state, index) => state.filter((_, i) => i !== index))
  .reset(resetForm);

export const $certificates = createStore<CertificateUrl[]>([])
  .on(addCertificate, (state) => [...state, ""])
  .on(updateCertificate, (state, { index, value }) =>
    state.map((cert, i) => (i === index ? value : cert)),
  )
  .on(removeCertificate, (state, index) => state.filter((_, i) => i !== index))
  .reset(resetForm);

export const $income = combine($incomeAmount, $incomeCurrency, (amount, currency) => {
  if (amount !== null) {
    return { amount, currency: currency || "RUB" }; // Используем RUB как валюту по умолчанию
  }
  if (currency && !amount) {
    return { amount: null, currency };
  }
  return null;
});

export const $fullName = combine(
  $firstName,
  $lastName,
  $patronymic,
  (firstName, lastName, patronymic) => {
    if (!firstName && !lastName) return null;
    return {
      firstName,
      lastName,
      patronymic,
    };
  },
);

// Объединяем все сторы в один общий стор формы
export const $resumeForm = combine({
  photo: $photo,
  video: $video,
  jobseekerId: $jobseekerId,
  position: $position,
  income: $income,
  fullName: $fullName,
  gender: $gender,
  birthday: $birthday,
  email: $email,
  phone: $phone,
  city: $city,
  workExperience: $workExperience,
  education: $education,
  skills: $skills,
  aboutMe: $aboutMe,
  certificates: $certificates,
  languages: $languages,
});

// Валидация формы
export const $positionValid = $position.map((position) => position.trim().length > 0);
export const $fullNameValid = $fullName.map(
  (fullName) =>
    fullName !== null &&
    fullName.firstName.trim().length > 0 &&
    fullName.lastName.trim().length > 0,
);
export const $emailValid = $email.map((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
export const $phoneValid = $phone.map((phone) => phone.trim().length >= 10);
export const $cityValid = $city.map((city) => city.trim().length > 0);

export const $workExperienceValid = $workExperience.map(
  (experiences) =>
    experiences.length === 0 ||
    experiences.every(
      (exp) =>
        exp.position.trim().length > 0 &&
        exp.company.trim().length > 0 &&
        exp.startDate instanceof Date,
    ),
);

export const $educationsValid = $education.map(
  (educations) =>
    educations.length === 0 ||
    educations.every(
      (edu) =>
        Boolean(edu.university.trim()) && Boolean(edu.faculty.trim()) && Boolean(edu.degree.trim()),
    ),
);

export const $skillsValid = $skills.map(
  (skills) => skills.length === 0 || skills.every((skill) => skill.name.trim().length > 0),
);

export const $languagesValid = $languages.map(
  (languages) => languages.length === 0 || languages.every((lang) => lang.name.trim().length > 0),
);

export const $aboutMeValid = $aboutMe.map((aboutMe) => aboutMe.length <= 2000);

export const $formValid = combine(
  $positionValid,
  $fullNameValid,
  $emailValid,
  $phoneValid,
  $cityValid,
  $workExperienceValid,
  $educationsValid,
  $skillsValid,
  $languagesValid,
  $aboutMeValid,
  (
    positionValid,
    fullNameValid,
    emailValid,
    phoneValid,
    cityValid,
    workExperienceValid,
    educationsValid,
    skillsValid,
    languagesValid,
    aboutMeValid,
  ) =>
    positionValid &&
    fullNameValid &&
    emailValid &&
    phoneValid &&
    cityValid &&
    workExperienceValid &&
    educationsValid &&
    skillsValid &&
    languagesValid &&
    aboutMeValid,
);

// Стор для хранения ошибок формы
export const $formError = createStore<ResumeFormError>(null)
  .on(setFormError, (_, error) => error)
  .reset(resetForm);

// Логика отправки формы
sample({
  clock: submitForm,
  source: {
    form: $resumeForm,
    valid: $formValid,
    positionValid: $positionValid,
    fullNameValid: $fullNameValid,
    emailValid: $emailValid,
    phoneValid: $phoneValid,
    cityValid: $cityValid,
    workExperienceValid: $workExperienceValid,
    educationsValid: $educationsValid,
    skillsValid: $skillsValid,
    languagesValid: $languagesValid,
    aboutMeValid: $aboutMeValid,
  },
  filter: ({ valid }) => valid,
  fn: ({ form }) => form,
  target: createResumeFx,
});

// Обработка ошибок валидации при отправке формы
sample({
  clock: submitForm,
  source: {
    positionValid: $positionValid,
    fullNameValid: $fullNameValid,
    emailValid: $emailValid,
    phoneValid: $phoneValid,
    cityValid: $cityValid,
    workExperienceValid: $workExperienceValid,
    educationsValid: $educationsValid,
    skillsValid: $skillsValid,
    languagesValid: $languagesValid,
    aboutMeValid: $aboutMeValid,
  },
  filter: ({
    positionValid,
    fullNameValid,
    emailValid,
    phoneValid,
    cityValid,
    workExperienceValid,
    educationsValid,
    skillsValid,
    languagesValid,
    aboutMeValid,
  }) =>
    !positionValid ||
    !fullNameValid ||
    !emailValid ||
    !phoneValid ||
    !cityValid ||
    !workExperienceValid ||
    !educationsValid ||
    !skillsValid ||
    !languagesValid ||
    !aboutMeValid,
  fn: ({
    positionValid,
    fullNameValid,
    emailValid,
    phoneValid,
    cityValid,
    workExperienceValid,
    educationsValid,
    skillsValid,
    languagesValid,
    aboutMeValid,
  }) => {
    if (!positionValid || !fullNameValid || !emailValid || !phoneValid || !cityValid) {
      return "INVALID_PERSONAL_INFO";
    }
    if (!workExperienceValid) {
      return "INVALID_WORK_EXPERIENCE";
    }
    if (!educationsValid) {
      return "INVALID_EDUCATION";
    }
    if (!skillsValid) {
      return "INVALID_SKILLS";
    }
    if (!languagesValid) {
      return "INVALID_LANGUAGES";
    }
    if (!aboutMeValid) {
      return "ABOUT_ME_TOO_LONG";
    }
    return "EMPTY_FORM";
  },
  target: setFormError,
});

// Обработка ошибок при создании резюме
sample({
  clock: createResumeFx.failData,
  fn: () => "SERVER_ERROR" as const,
  target: setFormError,
});

sample({
  clock: uploadVideo,
  target: uploadVideoFx,
});

// Инициализация пустых массивов при первом рендере
sample({
  clock: currentRoute.opened,
  fn: () => {},
  target: [addSkill, addLanguage],
});
