import { createEvent, createStore, sample } from "effector";

import { deleteResumeMutation, getResumeListQuery } from "@/shared/api/resume";
import { routes } from "@/shared/routing";
import { IResume } from "@/shared/types/resume.interface.ts";
import { UserRole } from "@/shared/types/user.interface.ts";
import { chainAuthenticated } from "@/shared/viewer";

export const currentRoute = routes.jobseeker.profile;

export const authenticatedRoute = chainAuthenticated(routes.jobseeker.profile, {
  requiredRole: UserRole.Jobseeker,
  otherwise: routes.auth.signIn.open,
});

export const resumeCardClicked = createEvent<string>();
export const editResumeClicked = createEvent<string>();
export const deleteResumeClicked = createEvent<string>();
export const confirmDeleteClicked = createEvent();
export const cancelDeleteClicked = createEvent();

// Сторы
export const $resumes = createStore<IResume[]>([]);
export const $isLoading = getResumeListQuery.$pending;
export const $error = createStore<string | null>(null);
export const $resumeToDelete = createStore<string | null>(null);
export const $isDeleteDialogOpen = createStore(false);

sample({
  clock: currentRoute.opened,
  source: currentRoute.$params,
  filter: (params) => Boolean(params.jobseekerId),
  fn: (params) => ({ jobseekerId: params.jobseekerId }),
  target: getResumeListQuery.start,
});

$resumes.on(getResumeListQuery.finished.success, (_, { result: resumes }) => resumes);

$error.on(getResumeListQuery.finished.failure, (_, { error }) => error.message);
$error.on(deleteResumeMutation.finished.failure, (_, { error }) => error.message);

// Управление диалогом удаления
$resumeToDelete.on(deleteResumeClicked, (_, id) => id);
$isDeleteDialogOpen.on(deleteResumeClicked, () => true);
$isDeleteDialogOpen.on(cancelDeleteClicked, () => false);
$isDeleteDialogOpen.on(confirmDeleteClicked, () => false);
$isDeleteDialogOpen.on(deleteResumeMutation.$succeeded, () => false);

sample({
  clock: resumeCardClicked,
  source: currentRoute.$params,
  fn: (params, resumeId) => ({ params: { jobseekerId: params.jobseekerId, resumeId } }),
  target: routes.jobseeker.resume.view.open,
});

// Навигация на страницу редактирования резюме
sample({
  clock: editResumeClicked,
  source: currentRoute.$params,
  fn: (params, resumeId) => ({ params: { jobseekerId: params.jobseekerId, resumeId } }),
  target: routes.jobseeker.resume.edit.open,
});

// Удаление резюме при подтверждении
sample({
  clock: confirmDeleteClicked,
  source: $resumeToDelete,
  filter: Boolean,
  fn: (id) => ({ id }),
  target: deleteResumeMutation.start,
});

sample({
  clock: deleteResumeMutation.finished.success,
  source: $resumes,
  fn: (resumes, { params: { id } }) => resumes.filter((resume) => resume._id !== id),
  target: $resumes,
});
