import { UserRole } from "@/shared/types/user.interface.ts";

export enum FileType {
  PHOTO = "photo",
  VIDEO = "video",
  DOCUMENT = "document",
  LOGO = "logo",
  CERTIFICATE = "certificate",
}

export type FileField = "photoUrl" | "logoUrl" | "certificateUrls" | "documentUrls" | "videoUrl";

export interface IFile {
  url: string;
  fileType: FileType;
  fileName: string;
  size: number;
  entityType: UserRole;
  entityId: string;
}
