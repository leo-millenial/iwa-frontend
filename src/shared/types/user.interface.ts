export enum UserRole {
  Company = "Company",
  Jobseeker = "Jobseeker",
  Admin = "Admin",
}

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
}
