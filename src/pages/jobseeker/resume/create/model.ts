import { combine, createEffect, createEvent, createStore, sample } from "effector";
import { reset } from "patronum";

import { createResumeMutation } from "@/shared/api/resume";
import { fileUrlByFileId } from "@/shared/config";
import { showErrorToast, showSuccessToast } from "@/shared/lib/toast";
import { routes } from "@/shared/routing";
import {
  CertificateUrl,
  Gender,
  IEducation,
  IFullName,
  ILanguage,
  ISkill,
  IWorkExperience,
  Income,
  LanguageLevel,
  SkillLevel,
} from "@/shared/types/resume.interface";
import { EmploymentType } from "@/shared/types/vacancy.interface";
import { $viewer } from "@/shared/viewer";

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

export type ResumeCreateFormError =
  | null
  | "EMPTY_FORM"
  | "INVALID_PERSONAL_INFO"
  | "INVALID_WORK_EXPERIENCE"
  | "INVALID_EDUCATION"
  | "INVALID_SKILLS"
  | "INVALID_LANGUAGES"
  | "ABOUT_ME_TOO_LONG"
  | "SERVER_ERROR"
  | "INVALID_BIRTH_DATE"
  | "INVALID_POSITION"
  | "INVALID_SALARY";

export const positionChanged = createEvent<string>();
export const genderChanged = createEvent<Gender>();
export const birthdayChanged = createEvent<Date | null>();
export const emailChanged = createEvent<string>();
export const phoneChanged = createEvent<string>();
export const cityChanged = createEvent<string>();
export const aboutMeChanged = createEvent<string>();
export const incomeAmountChanged = createEvent<number>();
export const incomeCurrencyChanged = createEvent<string>();

export const updateFullName = createEvent<{ field: keyof IFullName; value: string }>();

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
export const setFormError = createEvent<ResumeCreateFormError>();

export const uploadVideoFx = createEffect<File, string, Error>(async (file) => {
  return URL.createObjectURL(file);
});

export const $pending = createResumeMutation.$pending;

export const $photo = createStore<string>("")
  .on(photoChanged, (_, fileId) => fileUrlByFileId(fileId))
  .reset(resetForm);

export const $video = createStore<string>("")
  .on(uploadVideoFx.doneData, (_, videoUrl) => videoUrl)
  .on(removeVideo, () => "")
  .reset(resetForm);

export const $jobseekerId = $viewer.map((viewer) => viewer?.jobseeker?._id ?? "");

export const $position = createStore<string>("")
  .on(positionChanged, (_, value) => value)
  .reset(resetForm);

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
    return { amount, currency: currency || "RUB" };
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
  jobseekerId: $jobseekerId,
  photo: $photo,
  video: $video,
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

export const $birthDateValid = $birthday.map((date) => date !== null);
// Добавим валидацию для зарплаты
export const $salaryValid = $income.map(
  (income) => income !== null && income.amount !== null && income.amount > 0,
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
  $birthDateValid,
  $salaryValid,
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
    birthDateValid,
    salaryValid,
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
    aboutMeValid &&
    birthDateValid &&
    salaryValid,
);

// Стор для хранения ошибок формы
export const $formError = createStore<ResumeCreateFormError>(null)
  .on(setFormError, (_, error) => error)
  .reset(resetForm);

// Создаем эффект для проверки валидности формы
const validateFormFx = createEffect(
  ({
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
    birthDateValid,
    salaryValid,
  }: {
    positionValid: boolean;
    fullNameValid: boolean;
    emailValid: boolean;
    phoneValid: boolean;
    cityValid: boolean;
    workExperienceValid: boolean;
    educationsValid: boolean;
    skillsValid: boolean;
    languagesValid: boolean;
    aboutMeValid: boolean;
    birthDateValid: boolean;
    salaryValid: boolean;
  }) => {
    // Проверяем валидность формы
    if (!positionValid) {
      return "INVALID_POSITION";
    }
    if (!birthDateValid) {
      return "INVALID_BIRTH_DATE";
    }
    if (!salaryValid) {
      return "INVALID_SALARY";
    }
    if (!fullNameValid || !emailValid || !phoneValid || !cityValid) {
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

    // Если все проверки прошли успешно
    return null;
  },
);

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
    birthDateValid: $birthDateValid,
    salaryValid: $salaryValid,
  },
  target: validateFormFx,
});

// Устанавливаем ошибку, если форма невалидна
sample({
  clock: validateFormFx.doneData,
  filter: (error: ResumeCreateFormError) => error !== null,
  target: setFormError,
});

// Отправляем форму, если она валидна
sample({
  clock: submitForm,
  filter: $formValid,
  source: $resumeForm,
  target: createResumeMutation.start,
});

sample({
  clock: createResumeMutation.$succeeded,
  fn: () => ({
    message: "Успешно!",
    description: "Резюме создано",
  }),
  target: [showSuccessToast, resetForm],
});

sample({
  clock: createResumeMutation.$succeeded,
  source: { jobseekerId: $jobseekerId },
  fn: ({ jobseekerId }) => ({ params: { jobseekerId } }),
  target: routes.jobseeker.profile.open,
});

sample({
  clock: createResumeMutation.$failed,
  fn: () => "SERVER_ERROR" as const,
  target: setFormError,
});

sample({
  clock: createResumeMutation.$failed,
  fn: () => ({
    message: "Ошибка!",
    description: "Не удалось создать резюме",
  }),
  target: showErrorToast,
});

reset({
  clock: [
    positionChanged,
    genderChanged,
    birthdayChanged,
    emailChanged,
    phoneChanged,
    cityChanged,
    aboutMeChanged,
    incomeAmountChanged,
    incomeCurrencyChanged,
    updateFullName,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addCertificate,
    updateCertificate,
    removeCertificate,
    photoChanged,
    uploadVideo,
    removeVideo,
  ],
  target: $formError,
});
