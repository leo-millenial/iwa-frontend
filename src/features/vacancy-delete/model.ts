import { sample } from "effector";
import { createEvent, createStore } from "effector";

import { deleteVacancyMutation } from "@/shared/api/vacancy";
import { showErrorToast, showSuccessToast } from "@/shared/lib/toast";

interface VacancyDeleteParams {
  id: string;
  companyId: string;
}

export const deleteVacancyClicked = createEvent<VacancyDeleteParams>();
export const cancelDeleteClicked = createEvent<void>();
export const confirmDeleteClicked = createEvent<void>();

export const $isModalOpen = createStore(false);
export const $vacancyId = createStore<string | null>(null);
export const $companyId = createStore<string | null>(null);
export const $pending = deleteVacancyMutation.$pending;

$vacancyId.on(deleteVacancyClicked, (_, params) => params.id);
$companyId.on(deleteVacancyClicked, (_, params) => params.companyId);

sample({
  clock: deleteVacancyClicked,
  fn: () => true,
  target: $isModalOpen,
});

// Закрытие модального окна при отмене или подтверждении
sample({
  clock: [cancelDeleteClicked, confirmDeleteClicked],
  fn: () => false,
  target: $isModalOpen,
});

sample({
  clock: confirmDeleteClicked,
  source: {
    vacancyId: $vacancyId,
    companyId: $companyId,
  },
  filter: ({ vacancyId, companyId }) => Boolean(vacancyId) && Boolean(companyId),
  fn: ({ vacancyId, companyId }: { vacancyId: string | null; companyId: string | null }) => ({
    id: vacancyId as string,
    companyId: companyId as string,
  }),
  target: deleteVacancyMutation.start,
});

sample({
  clock: deleteVacancyMutation.$succeeded,
  fn: () => ({
    message: "Успешно!",
    description: "Вакансия удалена",
  }),
  target: showSuccessToast,
});

sample({
  clock: deleteVacancyMutation.$failed,
  fn: () => ({
    message: "Ошибка!",
    description: "Не удалось удалить вакансию",
  }),
  target: showErrorToast,
});

sample({
  clock: deleteVacancyMutation.finished.success,
  target: [$vacancyId.reinit, $companyId.reinit],
});
