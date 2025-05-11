import { UserRole } from "@/shared/types/user.interface.ts";

export interface SendMessageDto {
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
}

export interface IMessage {
  _id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  status: "sent" | "delivered" | "read";
  createdAt: string; // ISO date
}

export interface InitiateChatRequest {
  vacancyId: string;
  resumeId: string;
  companyId: string;
  jobseekerId: string;
  initialMessage: string;
  initiator: UserRole;
}

export enum ChatStatus {
  PENDING = "pending",
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export interface IChat {
  _id: string;
  companyId: string;
  jobseekerId: string;
  vacancyId: string;
  resumeId: string;
  initialMessage: string;
  status: ChatStatus;
  initiator: UserRole;
  lastMessage?: {
    content: string;
    createdAt: Date;
  };
}
