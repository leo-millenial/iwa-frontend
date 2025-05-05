import { ICompanySubscription } from "./subscription.interface";
import { IUser } from "./user.interface";
import { IVacancy } from "./vacancy.interface";

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

  // Файлы
  CompanyLogoFileId?: string;
  CompanyPhotoFileId?: string;
  CompanyCertificateFileIds?: string[];
  CompanyDocumentFileIds?: string[];
  // URL для файлов (добавляются динамически)
  logoUrl?: string;
  certificateUrls?: string[];
  documentUrls?: string[];
}
