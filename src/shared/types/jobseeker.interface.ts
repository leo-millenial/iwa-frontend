import { Gender, IFullName, IResume, Income } from "@/shared/types/resume.interface.ts";
import { IUser } from "@/shared/types/user.interface.ts";

export interface IJobseekerProfile {
  photo?: string;
  video?: string;
  position?: string;
  income: Income;
  fullName: IFullName;
  phone: string;
  gender: Gender;
  birthday: Date;
  region: string;
}

export interface JobseekerRegistrationDto {
  profile: IJobseekerProfile;
  resumes: IResume[];
}

export interface IJobseeker {
  _id?: string;
  profile: IJobseekerProfile;
  userId?: IUser["_id"];
  resumes: IResume[];
  documentFileIds?: string[];
  certificateFileIds?: string[];
}
