import { ResumeStatus } from "@/shared/types/resume.interface.ts";

// Определяем тип для вариантов статуса резюме
export type ResumeStatusVariants = "default" | "secondary" | "destructive" | "outline" | "success";

export const resumeStatusLabels: Record<ResumeStatus, string> = {
  [ResumeStatus.ActivelySearching]: "Активно ищу работу",
  [ResumeStatus.NotSearching]: "Не ищу работу",
  [ResumeStatus.OpenToOffers]: "Готов к предложениям",
  [ResumeStatus.Hidden]: "Скрыто от просмотра",
};

export const resumeStatusVariants: Record<ResumeStatus, ResumeStatusVariants> = {
  [ResumeStatus.ActivelySearching]: "success",
  [ResumeStatus.NotSearching]: "destructive",
  [ResumeStatus.OpenToOffers]: "secondary",
  [ResumeStatus.Hidden]: "outline",
};
