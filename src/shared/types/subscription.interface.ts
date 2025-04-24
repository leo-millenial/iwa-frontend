export enum CompanySubscriptionStatus {
  Started = "STARTED",
  WaitingForPayment = "WAITING_FOR_PAYMENT",
  Active = "ACTIVE",
  Expired = "EXPIRED",
  Canceled = "CANCELED",
}

export interface SubscriptionPrice {
  monthly: number;
  annual: number;
}

export interface ISubscription {
  _id?: string;
  plan: string;
  duration: number;
  price: SubscriptionPrice;
}

export interface ICompanySubscription extends ISubscription {
  startDate?: Date;
  endDate?: Date;
  status: CompanySubscriptionStatus;
}
