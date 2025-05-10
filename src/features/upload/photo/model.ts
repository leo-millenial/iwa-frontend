import { createFactory } from "@withease/factories";
import { createEffect, createEvent, createStore, sample } from "effector";

import { uploadFileMutation } from "@/shared/api/file";
import { FileType } from "@/shared/types/file.interface";
import { UserRole } from "@/shared/types/user.interface";

// Обновленный интерфейс для соответствия реальному ответу сервера
interface UploadFileResult {
  success?: boolean;
  fileId?: string;
  url?: string;
  [key: string]: unknown;
}

export type UploadPhotoProps = {
  entityId?: string;
  entityType: UserRole;
  fileType: FileType;
  onSuccess?: (fileUrl: string) => void;
};

const uploadPhotoFactory = createFactory((props: UploadPhotoProps) => {
  const photoSelected = createEvent<File | null>();
  const uploadRequested = createEvent();
  const uploadReset = createEvent();
  const uploadSuccess = createEvent<{ url: string }>();
  const uploadFailed = createEvent<Error>();
  const setEntityParams = createEvent<Omit<UploadPhotoProps, "onSuccess">>();
  const setIsUploading = createEvent<boolean>();
  const callOnSuccess = createEvent<string>();

  const $selectedPhoto = createStore<File | null>(null)
    .on(photoSelected, (_, file) => file)
    .reset(uploadReset);

  const $entityParams = createStore<Omit<UploadPhotoProps, "onSuccess">>(
    props
      ? { entityId: props.entityId, entityType: props.entityType, fileType: props.fileType }
      : { entityType: "company" as UserRole, fileType: "logo" as FileType },
  ).on(setEntityParams, (_, params) => params);

  const $isUploading = createStore(false).on(setIsUploading, (_, value) => value);

  const $uploadError = createStore<string | null>(null)
    .on(uploadFailed, (_, error) => error.message)
    .reset([photoSelected, uploadReset]);

  const $previewUrl = createStore<string | null>(null)
    .on(photoSelected, (_, file) => (file ? URL.createObjectURL(file) : null))
    .reset(uploadReset);

  const $uploadResult = createStore<{ url: string } | null>(null)
    .on(uploadSuccess, (_, result) => result)
    .reset(uploadReset);

  // Эффект для очистки URL объекта
  const revokeObjectUrlFx = createEffect<string, void>((url) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  });

  // Автоматически запускаем загрузку при выборе файла
  sample({
    source: $selectedPhoto,
    filter: (photo) => photo !== null,
    target: uploadRequested,
  });

  // Логика загрузки файла
  const uploadStarted = sample({
    source: { photo: $selectedPhoto, params: $entityParams },
    clock: uploadRequested,
    filter: ({ photo, params }) => photo !== null && !!params.entityId,
    fn: ({ photo, params }) => ({
      file: photo as File,
      entityId: params.entityId,
      entityType: params.entityType,
      fileType: params.fileType,
    }),
  });

  // Устанавливаем флаг загрузки при начале загрузки
  sample({
    clock: uploadStarted,
    fn: () => true,
    target: setIsUploading,
  });

  // Запускаем мутацию загрузки файла
  sample({
    clock: uploadStarted,
    target: uploadFileMutation.start,
  });

  // Обрабатываем успешную загрузку
  sample({
    clock: uploadFileMutation.finished.success,
    fn: ({ result }) => {
      if (!result) {
        throw new Error("Не удалось загрузить файл");
      }

      // Приводим результат к нужному типу
      const fileResult = result as UploadFileResult;
      console.log("Получен ответ от сервера:", fileResult);

      // Проверяем успешность операции
      if (fileResult.success === false) {
        throw new Error("Ошибка при загрузке файла на сервер");
      }

      // Используем URL из ответа сервера
      const url = fileResult.url;

      if (!url) {
        throw new Error("Не удалось получить URL файла");
      }

      // Сохраняем результат
      return { url };
    },
    target: uploadSuccess,
  });

  // Обрабатываем ошибку загрузки
  sample({
    clock: uploadFileMutation.finished.failure,
    fn: ({ error }) => new Error(error.message || "Ошибка при загрузке файла"),
    target: uploadFailed,
  });

  // Сбрасываем флаг загрузки при завершении (успешном или с ошибкой)
  sample({
    clock: [uploadFileMutation.finished.success, uploadFileMutation.finished.failure],
    fn: () => false,
    target: setIsUploading,
  });

  // Вызываем колбэк при успешной загрузке
  sample({
    clock: uploadSuccess,
    fn: (result) => result.url,
    target: callOnSuccess,
  });

  // Если предоставлен колбэк onSuccess, вызываем его
  if (props?.onSuccess) {
    callOnSuccess.watch((url) => {
      props.onSuccess?.(url);
    });
  }

  // Очистка URL объекта при сбросе превью
  sample({
    source: $previewUrl,
    clock: [uploadReset, photoSelected],
    filter: (prevUrl): prevUrl is string => prevUrl !== null && prevUrl.startsWith("blob:"),
    target: revokeObjectUrlFx,
  });

  return {
    // События
    photoSelected,
    uploadRequested,
    uploadReset,
    setEntityParams,
    callOnSuccess,

    // Сторы
    $selectedPhoto,
    $isUploading,
    $uploadError,
    $previewUrl,
    $uploadResult,
    $entityParams,
  };
});

export { uploadPhotoFactory };
