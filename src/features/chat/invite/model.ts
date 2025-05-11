import { createEvent, createStore, sample } from "effector";

import { initiateChatMutation } from "@/shared/api/chat/initiate";
import { showSuccessToast } from "@/shared/lib/toast";
import { InviteToChatParams } from "@/shared/types/chat.types.ts";
import { UserRole } from "@/shared/types/user.interface.ts";

export const openModal = createEvent();
export const closeModal = createEvent();
export const formSubmitted = createEvent();

export const $modalIsOpen = createStore(false)
  .on(openModal, () => true)
  .on(closeModal, () => false);

// Выбор: вакансия или резюме
export const setSelectedId = createEvent<string>();
export const $selectedId = createStore<string>("").on(setSelectedId, (_, id) => id);

// Сопроводительное сообщение
export const setInitialMessage = createEvent<string>();
export const $initialMessage = createStore<string>("").on(setInitialMessage, (_, msg) => msg);

// Метаданные (companyId, jobseekerId, role, resumes/vacancies)
export const setFormMeta = createEvent<Partial<InviteToChatParams>>();

export const $formMeta = createStore<Partial<InviteToChatParams> | null>(null).on(
  setFormMeta,
  (_, data) => data,
);

// Отправка
sample({
  clock: formSubmitted,
  source: {
    selectedId: $selectedId,
    initialMessage: $initialMessage,
    meta: $formMeta,
  },
  filter: ({ initialMessage, meta }) => Boolean(meta && initialMessage.trim()),
  fn: ({ selectedId, initialMessage, meta }) => {
    if (!meta) throw new Error("Meta is missing");

    const isJobseeker = meta.initiator === UserRole.Jobseeker;

    const resumeId = meta.resumeId || (isJobseeker ? selectedId : "");
    const vacancyId = meta.vacancyId || (!isJobseeker ? selectedId : "");

    return {
      ...meta,
      initialMessage,
      resumeId,
      vacancyId,
    } as InviteToChatParams;
  },
  target: initiateChatMutation.start,
});

// Закрытие модалки после успеха
sample({
  clock: initiateChatMutation.finished.success,
  target: closeModal,
});

// Показ уведомления об успехе
sample({
  clock: initiateChatMutation.finished.success,
  fn: () => ({
    message: "Успешно!",
    description: "Приглашение в чат отправлено",
  }),
  target: showSuccessToast,
});

// Сброс формы при закрытии
sample({
  clock: closeModal,
  fn: () => "",
  target: [setSelectedId, setInitialMessage],
});
