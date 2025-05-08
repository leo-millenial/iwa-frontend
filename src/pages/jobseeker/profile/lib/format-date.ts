/**
 * Форматирует дату в локализованную строку
 * @param dateString Строка даты или объект Date
 * @returns Отформатированная строка даты
 */
export const formatDate = (dateString?: Date | string) => {
  if (!dateString) return "Не указано";

  const date = typeof dateString === "string" ? new Date(dateString) : dateString;

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
