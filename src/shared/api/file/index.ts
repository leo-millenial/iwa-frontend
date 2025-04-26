import { createMutation } from "@farfetched/core";
import { zodContract } from "@farfetched/zod";
import { createEffect } from "effector";
import { z } from "zod";

import { filesControllerUploadFile } from "@/shared/api/__generated__";
import { FileType } from "@/shared/types/file.interface.ts";
import { UserRole } from "@/shared/types/user.interface.ts";

// Определяем схему валидации для данных загрузки файла
const zUploadFileDto = z.object({
  file: z.instanceof(File),
  fileType: z.nativeEnum(FileType),
  entityType: z.nativeEnum(UserRole),
  entityId: z.string(),
});

// Создаем эффект для загрузки файла
const uploadFileFx = createEffect(async (data: z.infer<typeof zUploadFileDto>) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("entityType", data.entityType);

  if (data.entityId) {
    formData.append("entityId", data.entityId);
  }

  const res = await filesControllerUploadFile({
    body: {
      fileType: data.fileType,
      file: data.file,
      entityType: data.entityType,
      entityId: data.entityId,
    },
  });

  return res.data;
});

export const uploadFileMutation = createMutation({
  effect: uploadFileFx,
  contract: zodContract(zUploadFileDto),
});
