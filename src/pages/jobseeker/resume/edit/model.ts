import { combine, createEvent, createStore, sample } from "effector";
import { or } from "patronum";

import { updateResumeMutation } from "@/shared/api/resume";
import { getResumeByIdQuery } from "@/shared/api/resume/get-by-id.ts";
import { showErrorToast, showSuccessToast } from "@/shared/lib/toast";
import { routes } from "@/shared/routing";
import {
  Gender,
  IEducation,
  ILanguage,
  ISkill,
  IWorkExperience,
  Income,
  LanguageLevel,
  ResumeStatus,
  SkillLevel,
} from "@/shared/types/resume.interface";
import { EmploymentType } from "@/shared/types/vacancy.interface";
import { $viewer, chainAuthenticated } from "@/shared/viewer";

export const currentRoute = routes.jobseeker.resume.edit;

export const authenticatedRoute = chainAuthenticated(routes.jobseeker.resume.edit, {
  otherwise: routes.auth.signIn.open,
});

// События для формы
export const formSubmitted = createEvent();

// События для основной информации
export const statusChanged = createEvent<ResumeStatus>();
export const positionChanged = createEvent<string>();
export const photoChanged = createEvent<string>();
export const videoChanged = createEvent<string>();
export const genderChanged = createEvent<Gender>();
export const birthdayChanged = createEvent<Date | null>();
export const emailChanged = createEvent<string>();
export const phoneChanged = createEvent<string>();
export const cityChanged = createEvent<string>();
export const aboutMeChanged = createEvent<string>();

// События для полного имени
export const firstNameChanged = createEvent<string>();
export const lastNameChanged = createEvent<string>();
export const patronymicChanged = createEvent<string>();

// События для дохода
export const incomeAmountChanged = createEvent<string>();
export const incomeCurrencyChanged = createEvent<string>();

// События для опыта работы
export const addWorkExperience = createEvent();
export const updateWorkExperience = createEvent<{
  index: number;
  field: keyof IWorkExperience;
  value: unknown;
}>();
export const removeWorkExperience = createEvent<number>();

export const addEducation = createEvent();
export const updateEducation = createEvent<{
  index: number;
  field: keyof IEducation;
  value: unknown;
}>();
export const removeEducation = createEvent<number>();

// События для навыков
export const addSkill = createEvent();
export const updateSkill = createEvent<{
  index: number;
  field: keyof ISkill;
  value: unknown;
}>();
export const removeSkill = createEvent<number>();

// События для языков
export const addLanguage = createEvent();
export const updateLanguage = createEvent<{
  index: number;
  field: keyof ILanguage;
  value: unknown;
}>();
export const removeLanguage = createEvent<number>();

// События для сертификатов
export const addCertificate = createEvent();
export const updateCertificate = createEvent<{
  index: number;
  value: string;
}>();
export const removeCertificate = createEvent<number>();

// Сторы для формы
export const $status = createStore<ResumeStatus>(ResumeStatus.ActivelySearching);
export const $resumeId = currentRoute.$params.map((params) => params.resumeId || "");
export const $position = createStore<string>("");
export const $photo = createStore<string>("");
export const $video = createStore<string>("");
export const $gender = createStore<Gender>(Gender.Male);
export const $birthday = createStore<Date | null>(null);
export const $email = createStore<string>("");
export const $phone = createStore<string>("");
export const $city = createStore<string>("");
export const $aboutMe = createStore<string>("");

// Сторы для полного имени
export const $firstName = createStore<string>("");
export const $lastName = createStore<string>("");
export const $patronymic = createStore<string>("");

// Сторы для дохода
export const $incomeAmount = createStore<number | string>(0);
export const $incomeCurrency = createStore<Income["currency"]>("RUB");

// Сторы для опыта работы, образования, навыков, языков и сертификатов
export const $workExperience = createStore<IWorkExperience[]>([]);
export const $education = createStore<IEducation[]>([]);
export const $skills = createStore<ISkill[]>([]);
export const $languages = createStore<ILanguage[]>([]);

export const $jobseekerId = $viewer.map((viewer) => viewer?.jobseeker?._id ?? "");

export const $pending = or(updateResumeMutation.$pending, getResumeByIdQuery.$pending);

// Привязка событий к сторам
$status
  .on(statusChanged, (_, status) => status)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.status)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.status);

$position
  .on(positionChanged, (_, position) => position)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.position)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.position);

$photo
  .on(photoChanged, (_, photo) => photo)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.photo || "")
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.photo || "");

$video
  .on(videoChanged, (_, video) => video)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.video || "")
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.video || "");

$gender
  .on(genderChanged, (_, gender) => gender)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.gender)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.gender);

$birthday
  .on(birthdayChanged, (_, birthday) => birthday)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.birthday)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.birthday);

$email
  .on(emailChanged, (_, email) => email)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.email)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.email);

$phone
  .on(phoneChanged, (_, phone) => phone)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.phone)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.phone);

$city
  .on(cityChanged, (_, city) => city)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.city)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.city);

$aboutMe
  .on(aboutMeChanged, (_, aboutMe) => aboutMe)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.aboutMe || "")
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.aboutMe || "");

$firstName
  .on(firstNameChanged, (_, firstName) => firstName)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.fullName?.firstName ?? "")
  .on(
    updateResumeMutation.finished.success,
    (_, { result }) => result.resume?.fullName?.firstName ?? "",
  );

$lastName
  .on(lastNameChanged, (_, lastName) => lastName)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.fullName?.lastName ?? "")
  .on(
    updateResumeMutation.finished.success,
    (_, { result }) => result.resume?.fullName?.lastName ?? "",
  );

$patronymic
  .on(patronymicChanged, (_, patronymic) => patronymic)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.fullName?.patronymic ?? "")
  .on(
    updateResumeMutation.finished.success,
    (_, { result }) => result.resume?.fullName?.patronymic ?? "",
  );

$incomeAmount
  .on(incomeAmountChanged, (_, amount) => {
    return amount === "" ? "" : Number(amount);
  })
  .on(getResumeByIdQuery.finished.success, (_, { result }) => {
    const amount = result?.income?.amount ?? 0;
    return amount.toString();
  })
  .on(updateResumeMutation.finished.success, (_, { result }) => {
    const amount = result.resume?.income?.amount ?? 0;
    return amount.toString();
  });

$incomeCurrency
  .on(incomeCurrencyChanged, (_, currency) => currency)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result?.income?.currency ?? "RUB")
  .on(
    updateResumeMutation.finished.success,
    (_, { result }) => result?.resume?.income?.currency ?? "RUB",
  );

// Обработка опыта работы
$workExperience
  .on(addWorkExperience, (state) => [
    ...state,
    {
      id: crypto.randomUUID(),
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
  .on(getResumeByIdQuery.finished.success, (_, { result }) => {
    return (result.workExperience || []).map((exp) => ({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
      endDate: exp.endDate ? new Date(exp.endDate) : null,
    }));
  })
  .on(updateResumeMutation.finished.success, (_, { result }) => {
    // Преобразуем строковые даты в объекты Date
    return (result.resume?.workExperience || []).map((exp) => ({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
      endDate: exp.endDate ? new Date(exp.endDate) : null,
    }));
  });

// Обработка образования
$education
  .on(addEducation, (state) => [
    ...state,
    {
      id: crypto.randomUUID(),
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
  .on(getResumeByIdQuery.finished.success, (_, { result }) => {
    return (result.education || []).map((edu) => ({
      ...edu,
      graduationDate: edu.graduationDate ? new Date(edu.graduationDate) : new Date(),
    }));
  })
  .on(updateResumeMutation.finished.success, (_, { result }) => {
    return (result.resume?.education || []).map((edu) => ({
      ...edu,
      graduationDate: edu.graduationDate ? new Date(edu.graduationDate) : new Date(),
    }));
  });

$skills
  .on(addSkill, (state) => [
    ...state,
    {
      id: crypto.randomUUID(),
      name: "",
      level: SkillLevel.Beginner,
    },
  ])
  .on(updateSkill, (state, { index, field, value }) =>
    state.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill)),
  )
  .on(removeSkill, (state, index) => state.filter((_, i) => i !== index))
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.skills || [])
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.skills || []);

// Обработка навыков
$languages
  .on(addLanguage, (state) => [
    ...state,
    {
      id: crypto.randomUUID(),
      name: "",
      level: LanguageLevel.Beginner,
    },
  ])
  .on(updateLanguage, (state, { index, field, value }) =>
    state.map((lang, i) => (i === index ? { ...lang, [field]: value } : lang)),
  )
  .on(removeLanguage, (state, index) => state.filter((_, i) => i !== index))
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.languages || [])
  .on(updateResumeMutation.finished.success, (_, { result }) => result.resume?.languages || []);

// Загрузка данных резюме
sample({
  clock: currentRoute.opened,
  source: $resumeId,
  target: getResumeByIdQuery.start,
});

export const $fullName = combine(
  $firstName,
  $lastName,
  $patronymic,
  (firstName, lastName, patronymic) => ({
    firstName,
    lastName,
    patronymic: patronymic || undefined,
  }),
);

// Комбинированный стор для формирования дохода
export const $income = combine($incomeAmount, $incomeCurrency, (amount, currency) => ({
  // Преобразуем строковое значение в число при отправке формы
  amount: amount === "" ? 0 : Number(amount),
  currency,
}));

// Комбинированный стор для формирования данных формы
export const $formData = combine({
  id: $resumeId,
  status: $status,
  jobseekerId: $jobseekerId,
  position: $position,
  photo: $photo,
  video: $video,
  fullName: $fullName,
  gender: $gender,
  birthday: $birthday,
  email: $email,
  phone: $phone,
  city: $city,
  aboutMe: $aboutMe,
  income: $income,
  workExperience: $workExperience,
  education: $education,
  skills: $skills,
  languages: $languages,
});

// Отправка формы
sample({
  clock: formSubmitted,
  source: $formData,
  fn: ({ id, ...data }) => ({ id, data }),
  target: updateResumeMutation.start,
});

// Обработка успешного обновления
sample({
  clock: updateResumeMutation.finished.success,
  fn: () => ({
    message: "Успешно!",
    description: "Резюме успешно обновлено",
  }),
  target: showSuccessToast,
});

sample({
  clock: updateResumeMutation.$succeeded,
  source: currentRoute.$params,
  fn: ({ resumeId, jobseekerId }) => ({ params: { resumeId, jobseekerId } }),
  target: routes.jobseeker.resume.view.open,
});

// Обработка ошибки обновления
sample({
  clock: updateResumeMutation.finished.failure,
  fn: () => ({
    message: "Ошибка!",
    description: "Не удалось обновить резюме",
  }),
  target: showErrorToast,
});

// Логирование ошибки
sample({
  clock: updateResumeMutation.finished.failure,
  fn: (response) => console.error("Resume update failure", response),
});

export const $activeTab = createStore<string>("personal");
export const activeTabChanged = createEvent<string>();

$activeTab.on(activeTabChanged, (_, tab) => tab);
