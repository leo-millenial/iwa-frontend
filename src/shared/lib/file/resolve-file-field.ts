import { FileField, FileType } from "@/shared/types/file.interface.ts";
import { UserRole } from "@/shared/types/user.interface.ts";

// Карта соответствия типов файлов и полей сущностей
export const fileFieldMap: Partial<
  Record<UserRole, Partial<Record<FileType, { single: boolean; key: FileField }>>>
> = {
  [UserRole.Company]: {
    [FileType.LOGO]: { single: true, key: "logoUrl" },
    [FileType.PHOTO]: { single: true, key: "photoUrl" },
    [FileType.CERTIFICATE]: { single: false, key: "certificateUrls" },
    [FileType.DOCUMENT]: { single: false, key: "documentUrls" },
  },
  [UserRole.Jobseeker]: {
    [FileType.PHOTO]: { single: true, key: "photoUrl" },
    [FileType.VIDEO]: { single: true, key: "videoUrl" },
    [FileType.CERTIFICATE]: { single: false, key: "certificateUrls" },
    [FileType.DOCUMENT]: { single: false, key: "documentUrls" },
  },
};

/**
 * Функция для определения поля сущности по роли и типу файла
 * @param role Роль пользователя
 * @param type Тип файла
 * @returns Объект с информацией о поле и типе (одиночное или множественное)
 */
export function resolveFileField(
  role: UserRole,
  type: FileType,
): { key: FileField; single: boolean } {
  const config = fileFieldMap[role]?.[type];
  if (!config) {
    throw new Error(`Неизвестное сочетание роли и типа файла: ${role} + ${type}`);
  }
  return config;
}
