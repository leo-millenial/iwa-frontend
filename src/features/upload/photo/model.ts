import { createFactory } from "@withease/factories";
import { createEffect, createEvent, createStore, sample } from "effector";
import { debug } from "patronum";

import { uploadFileMutation } from "@/shared/api/file";
import { FileType } from "@/shared/types/file.interface";
import { UserRole } from "@/shared/types/user.interface";

export type UploadPhotoProps = {
  entityId?: string;
  entityType: UserRole;
  fileType: FileType;
  onSuccess?: (fileId: string) => void;
};

const uploadPhotoFactory = createFactory((props: UploadPhotoProps) => {
  const photoSelected = createEvent<File | null>();
  const uploadRequested = createEvent();
  const uploadReset = createEvent();
  const uploadSuccess = createEvent<{ fileId: string; url: string }>();
  const uploadFailed = createEvent<Error>();
  const setEntityParams = createEvent<Omit<UploadPhotoProps, "onSuccess">>();
  const setIsUploading = createEvent<boolean>();
  const callOnSuccess = createEvent<string>();

  debug({ photoSelected: photoSelected });
  debug({ uploadRequested: uploadRequested });
  debug({ uploadReset: uploadReset });
  debug({ uploadSuccess: uploadSuccess });
  debug({ uploadFailed: uploadFailed });
  debug({ setEntityParams: setEntityParams });
  debug({ setIsUploading: setIsUploading });
  debug({ callOnSuccess: callOnSuccess });

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

  const $uploadResult = createStore<{ fileId: string; url: string } | null>(null)
    .on(uploadSuccess, (_, result) => result)
    .reset(uploadReset);

  // Эффект для очистки URL объекта
  const revokeObjectUrlFx = createEffect<string, void>((url) => {
    URL.revokeObjectURL(url);
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
    filter: ({ photo }) => photo !== null,
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
      if (!result || !result.fileId) {
        throw new Error("Не удалось загрузить файл");
      }

      // Формируем URL для доступа к файлу
      const fileUrl = `/api/files/${result.fileId}`;

      return { fileId: result.fileId, url: fileUrl };
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
    fn: (result) => result.fileId,
    target: callOnSuccess,
  });

  // Если предоставлен колбэк onSuccess, вызываем его
  if (props?.onSuccess) {
    callOnSuccess.watch((fileId) => {
      props.onSuccess?.(fileId);
    });
  }

  // Очистка URL объекта при сбросе превью
  sample({
    source: $previewUrl,
    clock: [uploadReset, photoSelected],
    filter: (prevUrl): prevUrl is string => prevUrl !== null,
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
