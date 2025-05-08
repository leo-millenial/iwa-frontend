import { combine, createEvent, createStore, sample } from "effector";
import { or } from "patronum";

import { updateResumeMutation } from "@/shared/api/resume";
import { getResumeByIdQuery } from "@/shared/api/resume/get-by-id.ts";
import { showErrorToast, showSuccessToast } from "@/shared/lib/toast";
import { routes } from "@/shared/routing";
import {
  CertificateUrl,
  Gender,
  IEducation,
  ILanguage,
  ISkill,
  IWorkExperience,
  Income,
  LanguageLevel,
  SkillLevel,
} from "@/shared/types/resume.interface";
import { EmploymentType } from "@/shared/types/vacancy.interface";
import { $viewer } from "@/shared/viewer";

export const currentRoute = routes.jobseeker.resume.edit;

// export const authenticatedRoute = chainAuthenticated(routes.jobseeker.resume.edit, {
//   otherwise: routes.auth.signIn.open,
// });

// События для формы
export const formSubmitted = createEvent();

// События для основной информации
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
export const incomeAmountChanged = createEvent<number>();
export const incomeCurrencyChanged = createEvent<string>();

// События для опыта работы
export const addWorkExperience = createEvent();
export const updateWorkExperience = createEvent<{
  index: number;
  field: keyof IWorkExperience;
  value: unknown;
}>();
export const removeWorkExperience = createEvent<number>();

// События для образования
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
export const $incomeAmount = createStore<Income["amount"]>(0);
export const $incomeCurrency = createStore<Income["currency"]>("RUB");

// Сторы для опыта работы, образования, навыков, языков и сертификатов
export const $workExperience = createStore<IWorkExperience[]>([]);
export const $education = createStore<IEducation[]>([]);
export const $skills = createStore<ISkill[]>([]);
export const $languages = createStore<ILanguage[]>([]);
export const $certificates = createStore<CertificateUrl[]>([]);

export const $jobseekerId = $viewer.map((viewer) => viewer?.jobseeker?._id ?? "");

export const $pending = or(updateResumeMutation.$pending, getResumeByIdQuery.$pending);

// Привязка событий к сторам
$position
  .on(positionChanged, (_, position) => position)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.position)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.position);

$photo
  .on(photoChanged, (_, photo) => photo)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.photo)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.photo);

$video
  .on(videoChanged, (_, video) => video)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.video)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.video);

$gender
  .on(genderChanged, (_, gender) => gender)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.gender)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.gender);

$birthday
  .on(birthdayChanged, (_, birthday) => birthday)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.birthday)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.birthday);

$email
  .on(emailChanged, (_, email) => email)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.email)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.email);

$phone
  .on(phoneChanged, (_, phone) => phone)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.phone)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.phone);

$city
  .on(cityChanged, (_, city) => city)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.city)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.city);

$aboutMe
  .on(aboutMeChanged, (_, aboutMe) => aboutMe)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.aboutMe || "")
  .on(updateResumeMutation.finished.success, (_, { result }) => result.aboutMe || "");

$firstName
  .on(firstNameChanged, (_, firstName) => firstName)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.fullName?.firstName)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.fullName?.firstName);

$lastName
  .on(lastNameChanged, (_, lastName) => lastName)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.fullName?.lastName)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.fullName?.lastName);

$patronymic
  .on(patronymicChanged, (_, patronymic) => patronymic)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result.fullName?.patronymic)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.fullName?.patronymic);

$incomeAmount
  .on(incomeAmountChanged, (_, amount) => amount)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result?.income?.amount ?? 0)
  .on(updateResumeMutation.finished.success, (_, { result }) => result.income.amount ?? 0);

$incomeCurrency
  .on(incomeCurrencyChanged, (_, currency) => currency)
  .on(getResumeByIdQuery.finished.success, (_, { result }) => result?.income?.currency ?? "RUB")
  .on(updateResumeMutation.finished.success, (_, { result }) => result?.income?.currency ?? "RUB");

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
  .on(removeWorkExperience, (state, index) => state.filter((_, i) => i !== index));

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
  .on(removeEducation, (state, index) => state.filter((_, i) => i !== index));

// Обработка навыков
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
  .on(removeSkill, (state, index) => state.filter((_, i) => i !== index));

// Обработка языков
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
  .on(removeLanguage, (state, index) => state.filter((_, i) => i !== index));

// Обработка сертификатов
$certificates
  .on(addCertificate, (state) => [...state, ""])
  .on(updateCertificate, (state, { index, value }) =>
    state.map((cert, i) => (i === index ? value : cert)),
  )
  .on(removeCertificate, (state, index) => state.filter((_, i) => i !== index));

// Загрузка данных резюме
sample({
  clock: currentRoute.opened,
  source: $resumeId,
  target: getResumeByIdQuery.start,
});

sample({
  clock: getResumeByIdQuery.finished.success,
  fn: ({ result }) => result.skills || [],
  target: $skills,
});

sample({
  clock: getResumeByIdQuery.finished.success,
  fn: ({ result }) => result.languages || [],
  target: $languages,
});

sample({
  clock: getResumeByIdQuery.finished.success,
  fn: ({ result }) => result.certificates || [],
  target: $certificates,
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
  amount,
  currency,
}));

// Комбинированный стор для формирования данных формы
export const $formData = combine({
  id: $resumeId,
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
  certificates: $certificates,
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

// Переход на страницу просмотра после успешного обновления
sample({
  clock: updateResumeMutation.$succeeded,
  source: { resumeId: $resumeId },
  fn: ({ resumeId }) => ({ params: { resumeId } }),
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
