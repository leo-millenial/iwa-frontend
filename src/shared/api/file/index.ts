import { createMutation } from "@farfetched/core";
import { attach, createEffect, sample } from "effector";

import { API_BASE_URL } from "@/shared/config/api.ts";
import { showErrorToast } from "@/shared/lib/toast";
import { $headers } from "@/shared/tokens";
import { FileType } from "@/shared/types/file.interface.ts";
import { UserRole } from "@/shared/types/user.interface.ts";

// Максимальный размер файла (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Типы ошибок загрузки файлов
export type FileUploadError =
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FILE_TYPE"
  | "UPLOAD_FAILED"
  | "ENTITY_ID_REQUIRED"
  | "SERVER_ERROR";

// Определяем интерфейс для данных загрузки файла
export interface UploadFileDto {
  file: File;
  fileType: FileType;
  entityType: UserRole;
  entityId?: string;
}

// Функция для получения сообщения об ошибке
export const getFileUploadErrorMessage = (error: FileUploadError): string => {
  switch (error) {
    case "FILE_TOO_LARGE":
      return `Размер файла превышает максимально допустимый (${MAX_FILE_SIZE / 1024 / 1024}MB)`;
    case "UNSUPPORTED_FILE_TYPE":
      return "Неподдерживаемый тип файла";
    case "UPLOAD_FAILED":
      return "Не удалось загрузить файл";
    case "ENTITY_ID_REQUIRED":
      return "Идентификатор сущности обязателен для загрузки файла";
    case "SERVER_ERROR":
      return "Ошибка сервера при загрузке файла";
    default:
      return "Произошла неизвестная ошибка при загрузке файла";
  }
};

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
  // Проверка размера файла перед отправкой
  if (data.file.size > MAX_FILE_SIZE) {
    throw new Error("FILE_TOO_LARGE");
  }

  const url = new URL(getUploadUrl(data), API_BASE_URL);

  const formData = new FormData();
  formData.append("file", data.file);

  // Некоторые API могут не требовать эти поля, но мы их добавляем для совместимости
  // со старым кодом, который может ожидать их на бэкенде
  formData.append("fileType", data.fileType);
  formData.append("entityType", data.entityType);

  try {
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
      // Обработка конкретных ошибок HTTP
      if (response.status === 413) {
        throw new Error("FILE_TOO_LARGE");
      }

      const errorData = await response
        .json()
        .catch(() => ({ message: "Ошибка при загрузке файла" }));
      throw new Error(errorData.message || "Ошибка при загрузке файла");
    }

    return await response.json();
  } catch (error) {
    // Если ошибка уже имеет нужный формат, пробрасываем её дальше
    if (error instanceof Error) {
      throw error;
    }
    // Иначе оборачиваем в Error
    throw new Error("SERVER_ERROR");
  }
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
  fn: (response) => {
    const errorMessage = response.error.message;
    let description = "Не удалось загрузить файл";

    if (
      errorMessage === "FILE_TOO_LARGE" ||
      errorMessage === "UNSUPPORTED_FILE_TYPE" ||
      errorMessage === "UPLOAD_FAILED" ||
      errorMessage === "ENTITY_ID_REQUIRED" ||
      errorMessage === "SERVER_ERROR"
    ) {
      description = getFileUploadErrorMessage(errorMessage as FileUploadError);
    } else {
      console.error("File upload failure:", response);
    }

    return {
      message: "Ошибка!",
      description: description,
    };
  },
  target: showErrorToast,
});
