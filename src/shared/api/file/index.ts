import { createMutation } from "@farfetched/core";
import { attach, createEffect, sample } from "effector";

import { API_BASE_URL } from "@/shared/config/api.ts";
import { $headers } from "@/shared/tokens";
import { FileType } from "@/shared/types/file.interface.ts";
import { UserRole } from "@/shared/types/user.interface.ts";

// Определяем интерфейс для данных загрузки файла
export interface UploadFileDto {
  file: File;
  fileType: FileType;
  entityType: UserRole;
  entityId?: string;
}

// Функция для определения правильного URL в зависимости от типа файла и сущности
const getUploadUrl = (data: UploadFileDto): string => {
  const { entityType, fileType, entityId } = data;

  if (!entityId) {
    throw new Error("entityId обязателен для загрузки файла");
  }

  if (entityType === UserRole.Jobseeker) {
    switch (fileType) {
      case FileType.PHOTO:
        return `/api/jobseeker/${entityId}/photo`;
      case FileType.VIDEO:
        return `/api/jobseeker/${entityId}/video`;
      case FileType.DOCUMENT:
        return `/api/jobseeker/${entityId}/document`;
      case FileType.CERTIFICATE:
        return `/api/jobseeker/${entityId}/certificate`;
      default:
        throw new Error(`Неподдерживаемый тип файла для соискателя: ${fileType}`);
    }
  } else if (entityType === UserRole.Company) {
    switch (fileType) {
      case FileType.LOGO:
        return `/api/companies/${entityId}/upload-logo`;
      case FileType.PHOTO:
        return `/api/companies/${entityId}/upload-photo`;
      case FileType.CERTIFICATE:
        return `/api/companies/${entityId}/upload-certificate`;
      case FileType.DOCUMENT:
        return `/api/companies/${entityId}/upload-document`;
      default:
        throw new Error(`Неподдерживаемый тип файла для компании: ${fileType}`);
    }
  }

  throw new Error(`Неподдерживаемый тип сущности: ${entityType}`);
};

const uploadFileFx = createEffect<
  { headers: Record<string, string>; data: UploadFileDto },
  unknown,
  Error
>(async ({ headers, data }) => {
  const url = new URL(getUploadUrl(data), API_BASE_URL);

  const formData = new FormData();
  formData.append("file", data.file);

  // Некоторые API могут не требовать эти поля, но мы их добавляем для совместимости
  // со старым кодом, который может ожидать их на бэкенде
  formData.append("fileType", data.fileType);
  formData.append("entityType", data.entityType);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      ...headers,
      // Не устанавливаем Content-Type, так как браузер автоматически
      // установит правильный Content-Type с boundary для FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при загрузке файла");
  }

  return await response.json();
});

export const uploadFileMutation = createMutation({
  effect: attach({
    source: $headers,
    mapParams: (data: UploadFileDto, headers: Record<string, string>) => ({
      headers,
      data,
    }),
    effect: uploadFileFx,
  }),
});

sample({
  clock: uploadFileMutation.finished.failure,
  fn: (response) => console.error("File upload failure", response),
});
