import { Gender, IFullName, IResume, Income } from "@/shared/types/resume.interface.ts";
import { IUser } from "@/shared/types/user.interface.ts";

export interface IJobseekerProfile {
  photoUrl?: string; // ссылка на фотографию
  videoUrl?: string; // ссылка на видео
  position?: string;
  income: Income;
  fullName: IFullName;
  phone: string;
  gender: Gender;
  birthday: Date;
  region: string;
  documentUrls?: string[]; // ссылки на документы
  certificateUrls?: string[]; // ссылки на сертификаты
}

export interface IJobseeker {
  _id?: string;
  profile: IJobseekerProfile;
  userId?: IUser["_id"];
  resumes: IResume[];
}

export interface JobseekerRegistrationDto {
  profile: IJobseekerProfile;
  resumes: IResume[];
}
