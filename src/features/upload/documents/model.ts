// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createFactory } from "@withease/factories";
import { createEvent, createStore, sample } from "effector";

import { uploadFileMutation } from "@/shared/api/file";
import { FileType } from "@/shared/types/file.interface";
import { UserRole } from "@/shared/types/user.interface";

export interface DocumentFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface UploadDocumentsProps {
  entityId: string;
  entityType: UserRole;
  fileType: FileType.DOCUMENT | FileType.CERTIFICATE;
  initialFiles?: DocumentFile[];
  onSuccess?: (files: DocumentFile[]) => void;
  onDelete?: (fileId: string) => void;
}

export const uploadDocumentsFactory = createFactory((props: UploadDocumentsProps) => {
  // События
  const fileSelected = createEvent<File | null>();
  const uploadRequested = createEvent();
  const deleteFile = createEvent<string>();
  const setEntityParams =
    createEvent<Omit<UploadDocumentsProps, "onSuccess" | "onDelete" | "initialFiles">>();
  const setIsUploading = createEvent<boolean>();
  const uploadSuccess = createEvent<DocumentFile>();
  const uploadFailed = createEvent<Error>();
  const filesInitialized = createEvent<DocumentFile[]>();
  const resetUpload = createEvent();
  const callOnSuccess = createEvent<DocumentFile[]>();
  const callOnDelete = createEvent<string>();

  // Сторы
  const $selectedFile = createStore<File | null>(null)
    .on(fileSelected, (_, file) => file)
    .reset(resetUpload);

  const $entityParams = createStore<
    Omit<UploadDocumentsProps, "onSuccess" | "onDelete" | "initialFiles">
  >(
    props
      ? { entityId: props.entityId, entityType: props.entityType, fileType: props.fileType }
      : { entityId: "", entityType: UserRole.Jobseeker, fileType: FileType.DOCUMENT },
  ).on(setEntityParams, (_, params) => params);

  const $isUploading = createStore(false).on(setIsUploading, (_, value) => value);

  const $uploadError = createStore<string | null>(null)
    .on(uploadFailed, (_, error) => error.message)
    .reset([fileSelected, resetUpload]);

  const $files = createStore<DocumentFile[]>(props?.initialFiles || [])
    .on(filesInitialized, (_, files) => files)
    .on(uploadSuccess, (state, file) => [...state, file])
    .on(deleteFile, (state, fileId) => state.filter((file) => file.id !== fileId));

  // Автоматически запускаем загрузку при выборе файла
  sample({
    source: $selectedFile,
    filter: (file) => file !== null,
    target: uploadRequested,
  });

  // Логика загрузки файла
  const uploadStarted = sample({
    source: { file: $selectedFile, params: $entityParams },
    clock: uploadRequested,
    filter: ({ file, params }) => file !== null && !!params.entityId,
    fn: ({ file, params }) => ({
      file: file as File,
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
    source: $selectedFile,
    filter: (file): file is File => file !== null,
    fn: (selectedFile, { result }) => {
      if (!result) {
        throw new Error("Не удалось загрузить файл");
      }

      // Обрабатываем разные форматы ответа от сервера
      let fileId: string;
      let fileUrl: string;

      // Проверяем формат ответа и извлекаем нужные данные
      if (typeof result === "object") {
        // Проверяем наличие разных полей в ответе
        if ("fileId" in result) {
          fileId = result.fileId;
          // Если есть url, используем его, иначе формируем из fileId
          fileUrl = "url" in result && result.url ? result.url : `/api/files/${fileId}`;
        } else if ("id" in result) {
          // Альтернативный формат с полем id вместо fileId
          fileId = result.id;
          fileUrl = "url" in result && result.url ? result.url : `/api/files/${fileId}`;
        } else if ("url" in result && result.url) {
          // Если есть только URL, но нет ID
          fileUrl = result.url;
          fileId = "fileId" in result ? result.fileId : crypto.randomUUID();
        } else {
          throw new Error("В ответе сервера отсутствуют необходимые поля");
        }

        // Проверяем успешность операции только если поле success явно указано как false
        if ("success" in result && result.success === false) {
          throw new Error(result.message || "Ошибка при загрузке файла на сервер");
        }
      } else {
        throw new Error("Неизвестный формат ответа от сервера");
      }

      if (!fileUrl) {
        throw new Error("Не удалось получить URL файла");
      }

      // Создаем объект документа
      return {
        id: fileId,
        name: selectedFile.name,
        url: fileUrl,
        type: selectedFile.type,
        size: selectedFile.size,
      };
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

  // Сбрасываем выбранный файл после успешной загрузки
  sample({
    clock: uploadSuccess,
    target: resetUpload,
  });

  // Вызываем колбэк при успешной загрузке
  sample({
    clock: uploadSuccess,
    source: $files,
    filter: () => Boolean(props?.onSuccess),
    target: callOnSuccess,
  });

  // Вызываем колбэк при удалении файла
  sample({
    clock: deleteFile,
    filter: () => Boolean(props?.onDelete),
    target: callOnDelete,
  });

  // Если предоставлен колбэк onSuccess, подписываемся на событие
  if (props?.onSuccess) {
    callOnSuccess.watch(props.onSuccess);
  }

  // Если предоставлен колбэк onDelete, подписываемся на событие
  if (props?.onDelete) {
    callOnDelete.watch(props.onDelete);
  }

  return {
    // События
    fileSelected,
    uploadRequested,
    deleteFile,
    setEntityParams,
    filesInitialized,
    resetUpload,

    // Сторы
    $selectedFile,
    $isUploading,
    $uploadError,
    $files,
    $entityParams,
  };
});
