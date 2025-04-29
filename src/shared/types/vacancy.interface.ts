export interface ISalary {
  amount: {
    min: number;
    max: number;
  };

  currency: string | number; // ISO 4217 (RUB or 643)
}

export enum EmploymentType {
  FullTime = "FullTime",
  PartTime = "PartTime",
  Remote = "Remote",
  Office = "Office",
  Hybrid = "Hybrid",
}

export enum Experience {
  Intern = "Intern",
  Junior = "Junior",
  Middle = "Middle",
  Senior = "Senior",
  Manager = "Manager",
  Director = "Director",
}

export interface IVacancy {
  _id?: string;
  companyId: string;
  title: string;
  description: string;
  salary: ISalary;
  city: string;
  experience: Experience;
  employmentTypes: EmploymentType[];
  brands?: string[];
}
