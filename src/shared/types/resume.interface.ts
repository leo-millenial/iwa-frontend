import { EmploymentType, Experience } from "./vacancy.interface";

export type CertificateUrl = string; // url

export interface Income {
  amount: number;
  currency: string | number; // ISO 4217 (RUB or 643)
}

export interface IFullName {
  firstName: string;
  lastName: string;
  patronymic?: string;
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export interface IEducation {
  university: string;
  faculty: string;
  degree: string;
  graduationDate: Date;
}

export enum SkillLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export interface ISkill {
  name: string;
  level: SkillLevel;
}

export enum LanguageLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Native = "Native",
}

export interface ILanguage {
  name: string;
  level: LanguageLevel;
}

export type WorkExperienceEndDate = Date | null; // null - работает до текущего момента;

export interface IWorkExperience {
  position: string; // Продукт менеджер
  company: string; // Сбер
  employmentType: EmploymentType; // в офисе
  startDate: Date; // март 2020
  endDate: WorkExperienceEndDate; // null - работает до текущего момента
  website?: string; // сбер.ru
  responsibilitiesDescription: string; // Комментарий. делал то да сё
}

export interface IResume {
  _id: string;
  photo?: string;
  video?: string;
  jobseekerId: string;
  position: string;
  income: Income;
  fullName: IFullName;
  gender: Gender;
  birthday: Date | null;
  email: string;
  phone: string;
  city: string;
  workExperience: IWorkExperience[];
  education?: IEducation[];
  skills?: ISkill[];
  aboutMe?: string;
  certificates?: CertificateUrl[];
  languages?: ILanguage[];
}

export interface ResumeSearchParams {
  query?: string;
  city?: string;
  experience?: Experience;
  employmentTypes?: EmploymentType[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string;
}
