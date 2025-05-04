import { useUnit } from "effector-react";

import { $resume } from "@/pages/resume/model.ts";

import { ResumeView } from "@/entities/resume";

export const ResumePage = () => {
  const resume = useUnit($resume);

  if (!resume) return null;

  return <ResumeView resume={resume} />;
};
