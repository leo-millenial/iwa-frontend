import { arr, num, obj, or, str, val } from "@withease/contracts";

const incomeContract = obj({
  amount: or(str, num), // Изменено: поддержка как строки, так и числа
  currency: str,
});

const fullNameContract = obj({
  firstName: str,
  lastName: str,
  patronymic: or(str, val(null), val(undefined)), // Изменено: patronymic вместо middleName
});

const educationContract = obj({
  id: or(str, val(null), val(undefined)), // Добавлено: id для образования
  university: str,
  faculty: str,
  degree: str,
  graduationDate: str, // Для даты в формате строки
});

const skillContract = obj({
  id: or(str, val(null), val(undefined)), // Добавлено: id для навыка
  name: str,
  level: str,
});

const languageContract = obj({
  id: or(str, val(null), val(undefined)), // Добавлено: id для языка
  name: str,
  level: str,
  plan: or(str, val(null), val(undefined)), // Добавлено: план
});

const workExperienceContract = obj({
  id: or(str, val(null), val(undefined)), // Добавлено: id для опыта работы
  company: str,
  position: str,
  employmentType: or(str, val(null), val(undefined)), // Добавлено: тип занятости
  startDate: str,
  endDate: or(str, val(null), val(undefined)),
  description: or(str, val(null), val(undefined)),
  responsibilitiesDescription: or(str, val(null), val(undefined)), // Добавлено: описание обязанностей
});

const resumeContract = obj({
  _id: or(str, val(null), val(undefined)),
  position: str,
  income: or(incomeContract, val(null), val(undefined)),
  fullName: fullNameContract,
  gender: or(val("Male"), val("Female")),
  birthday: str, // Для даты в формате строки
  email: str,
  phone: str,
  city: str,
  workExperience: arr(workExperienceContract),
  education: arr(educationContract),
  skills: arr(skillContract),
  aboutMe: or(str, val(null), val(undefined)),
  languages: or(arr(languageContract), val(null), val(undefined)),
  certificates: or(arr(str), val(null), val(undefined)),
  photo: or(str, val(null), val(undefined)), // Добавлено: фото
  video: or(str, val(null), val(undefined)), // Добавлено: видео
  createdAt: or(str, val(null), val(undefined)), // Добавлено: дата создания
  updatedAt: or(str, val(null), val(undefined)), // Добавлено: дата обновления
});

const jobseekerContract = obj({
  _id: str,
  userId: str,
  resumes: arr(resumeContract),
  documentFileIds: arr(str),
  certificateFileIds: arr(str),
});

const companySubscriptionContract = obj({
  // Предполагаемая структура подписки компании
  type: str,
  startDate: str,
  endDate: str,
});

// Контракт для зарплаты в вакансии
const vacancySalaryAmountContract = obj({
  min: or(num, val(null), val(undefined)),
  max: or(num, val(null), val(undefined)),
});

const vacancySalaryContract = obj({
  amount: vacancySalaryAmountContract,
  currency: str,
});

// Контракт для вакансии
const vacancyContract = obj({
  _id: str,
  title: str,
  description: str,
  salary: vacancySalaryContract,
  city: str,
  experience: str,
  employmentTypes: arr(str),
  companyId: str,
  brands: or(arr(str), val(null), val(undefined)),
});

const companyContract = obj({
  _id: str,
  userId: str,
  name: str,
  region: str,
  city: str,
  inn: or(str, num, val(null), val(undefined)),
  phone: str,
  logoUrl: or(str, val(null), val(undefined)),
  certificateUrls: or(arr(str), val(null), val(undefined)),
  documentUrls: or(arr(str), val(null), val(undefined)),
  CompanyCertificateFileIds: or(arr(str), val(null), val(undefined)),
  CompanyDocumentFileIds: or(arr(str), val(null), val(undefined)),
  CompanyLogoFileId: or(str, val(null), val(undefined)),
  employeesCount: or(num, val(null), val(undefined)),
  video: or(str, val(null), val(undefined)),
  brands: or(arr(str), val(null), val(undefined)),
  subscriptions: or(arr(companySubscriptionContract), val(null), val(undefined)),
  vacancies: or(arr(vacancyContract), val(null), val(undefined)),
  membersCount: or(num, val(null), val(undefined)),
  websiteUrl: or(str, val(null), val(undefined)),
  description: or(str, val(null), val(undefined)),
});

const userContract = obj({
  firstName: str,
  lastName: str,
  email: str,
  phone: str,
  role: str, // Используем строку для роли
});

export const meResponseContract = obj({
  user: userContract,
  jobseeker: or(jobseekerContract, val(null), val(undefined)),
  company: or(companyContract, val(null), val(undefined)),
});
