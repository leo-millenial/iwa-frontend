import { arr, num, obj, or, str, val } from "@withease/contracts";

const incomeContract = obj({
  amount: str,
  currency: str,
});

const fullNameContract = obj({
  firstName: str,
  lastName: str,
  middleName: or(str, val(null), val(undefined)),
});

const educationContract = obj({
  university: str,
  faculty: str,
  degree: str,
  graduationDate: str, // Для даты в формате строки
});

const skillContract = obj({
  name: str,
  level: str,
});

const languageContract = obj({
  name: str,
  level: str,
});

const workExperienceContract = obj({
  company: str,
  position: str,
  startDate: str,
  endDate: or(str, val(null), val(undefined)),
  description: or(str, val(null), val(undefined)),
});

const resumeContract = obj({
  position: str,
  income: incomeContract,
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
  languages: arr(languageContract),
  certificates: arr(str),
});

const jobseekerContract = obj({
  _id: str,
  userId: str,
  resumes: arr(resumeContract),
  documentFileIds: or(arr(str), val(null), val(undefined)),
  certificateFileIds: or(arr(str), val(null), val(undefined)),
});

const companySubscriptionContract = obj({
  // Предполагаемая структура подписки компании
  type: str,
  startDate: str,
  endDate: str,
});

const companyContract = obj({
  _id: str,
  userId: str,
  name: str,
  region: str,
  city: str,
  inn: or(str, num),
  phone: str,
  // Делаем необязательными поля, которые могут отсутствовать
  logoUrl: or(str, val(null), val(undefined)),
  certificateUrls: or(arr(str), val(null), val(undefined)),
  documentUrls: or(arr(str), val(null), val(undefined)),
  CompanyCertificateFileIds: or(arr(str), val(null), val(undefined)),
  CompanyDocumentFileIds: or(arr(str), val(null), val(undefined)),
  video: or(str, val(null), val(undefined)),
  brands: or(arr(str), val(null), val(undefined)),
  subscriptions: or(arr(companySubscriptionContract), val(null), val(undefined)),
  vacancies: or(arr(str), val(null), val(undefined)),
  // Делаем необязательными поля, которые могут отсутствовать в ответе
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
