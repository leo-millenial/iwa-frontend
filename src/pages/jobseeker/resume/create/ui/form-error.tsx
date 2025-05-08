import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";

import { ResumeCreateFormError } from "../model";

interface FormErrorProps {
  error: ResumeCreateFormError;
}

const errorMessages: Record<Exclude<ResumeCreateFormError, null>, string> = {
  EMPTY_FORM: "Пожалуйста, заполните все обязательные поля формы",
  INVALID_PERSONAL_INFO: "Проверьте правильность заполнения основной информации",
  INVALID_WORK_EXPERIENCE: "Проверьте правильность заполнения опыта работы",
  INVALID_EDUCATION: "Проверьте правильность заполнения информации об образовании",
  INVALID_SKILLS: "Добавьте хотя бы один навык",
  INVALID_LANGUAGES: "Проверьте правильность заполнения информации о языках",
  ABOUT_ME_TOO_LONG: "Описание о себе не должно превышать 1000 символов",
  SERVER_ERROR: "Произошла ошибка при сохранении резюме. Пожалуйста, попробуйте позже",
  INVALID_BIRTH_DATE: "Укажите дату рождения",
  INVALID_POSITION: "Укажите желаемую должность",
  INVALID_SALARY: "Укажите желаемую зарплату",
};

export const FormError = ({ error }: FormErrorProps) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ошибка</AlertTitle>
      <AlertDescription>{errorMessages[error]}</AlertDescription>
    </Alert>
  );
};
