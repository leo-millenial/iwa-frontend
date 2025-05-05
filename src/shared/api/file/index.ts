import { createMutation } from "@farfetched/core";
import { attach, createEffect, sample } from "effector";

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

const uploadFileFx = createEffect<{ headers: Record<string, string>; data: UploadFileDto }, Error>(
  async ({ headers, data }) => {
    const url = new URL("/api/files/upload", window.location.origin);

    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("fileType", data.fileType);
    formData.append("entityType", data.entityType);

    if (data.entityId) {
      formData.append("entityId", data.entityId);
    }

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
  },
);

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
  fn: (response) => console.log("File upload failure", response),
});
