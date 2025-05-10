import { ICompanySubscription } from "@/shared/types/subscription.interface.ts";
import { IUser } from "@/shared/types/user.interface.ts";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";

export interface ICompany {
  _id?: string;
  name: string;
  region: string;
  city: string;
  inn: number;
  userId?: IUser["_id"];
  vacancies?: IVacancy[];
  brands?: string[];
  phone: string;
  subscriptions?: ICompanySubscription[];
  employeesCount?: number;
  websiteUrl?: string;
  description?: string;

  logoUrl?: string; // 1 файл (ссылка)
  photoUrl?: string; // 1 файл (ссылка)
  certificateUrls?: string[]; // коллекция файлов (ссылки)
  documentUrls?: string[]; // коллекция файлов (ссылки)
}
