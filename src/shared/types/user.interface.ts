export enum UserRole {
  Company = "Company",
  Jobseeker = "Jobseeker",
}

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  refreshTokenHash?: string;
  role: UserRole;
  phone: string;
}
