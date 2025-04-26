import { Gender, IFullName, IResume, Income } from "@/shared/types/resume.interface.ts";

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
