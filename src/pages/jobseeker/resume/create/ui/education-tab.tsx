import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useUnit } from "effector-react";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  $education,
  addEducation,
  removeEducation,
  updateEducation,
} from "@/pages/jobseeker/resume/create/model.ts";

import { IEducation } from "@/shared/types/resume.interface.ts";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface EducationTabProps {
  onNext: () => void;
  onPrev: () => void;
}

interface EducationCreate extends IEducation {
  id: string;
}

export const EducationTab = ({ onNext, onPrev }: EducationTabProps) => {
  const [currentEducation, setCurrentEducation] = useState<EducationCreate>({
    id: crypto.randomUUID(),
    university: "",
    faculty: "",
    degree: "",
    graduationDate: new Date(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Получаем список образований из модели
  const education = useUnit($education);
  const addEducationEvent = useUnit(addEducation);
  const updateEducationEvent = useUnit(updateEducation);
  const removeEducationEvent = useUnit(removeEducation);

  // Обработчик добавления/обновления образования
  const handleAddEducation = () => {
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!currentEducation.university.trim()) {
      newErrors.university = "Введите название учебного заведения";
    }
    if (!currentEducation.faculty.trim()) {
      newErrors.faculty = "Введите название факультета";
    }
    if (!currentEducation.degree.trim()) {
      newErrors.degree = "Введите название специальности";
    }
    if (!currentEducation.graduationDate) {
      newErrors.graduationDate = "Выберите дату окончания";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing) {
      // Обновление существующего образования через модель
      const index = education.findIndex((edu) => edu.id === currentEducation.id);
      if (index !== -1) {
        Object.entries(currentEducation).forEach(([key, value]) => {
          updateEducationEvent({
            index,
            field: key as keyof IEducation,
            value,
          });
        });
      }
      setIsEditing(false);
    } else {
      // Добавление нового образования через модель
      addEducationEvent();
      const index = education.length;
      Object.entries(currentEducation).forEach(([key, value]) => {
        updateEducationEvent({
          index,
          field: key as keyof IEducation,
          value,
        });
      });
    }

    // Сброс формы
    setCurrentEducation({
      id: crypto.randomUUID(),
      university: "",
      faculty: "",
      degree: "",
      graduationDate: new Date(),
    });
    setErrors({});
  };

  // Обработчик редактирования образования
  const handleEditEducation = (education: EducationCreate) => {
    setCurrentEducation(education);
    setIsEditing(true);
    setErrors({});
  };

  // Обработчик удаления образования
  const handleDeleteEducation = (id: string) => {
    const index = education.findIndex((edu) => edu.id === id);
    if (index !== -1) {
      removeEducationEvent(index);
    }

    if (isEditing && currentEducation.id === id) {
      setCurrentEducation({
        id: crypto.randomUUID(),
        university: "",
        faculty: "",
        degree: "",
        graduationDate: new Date(),
      });
      setIsEditing(false);
    }
  };

  // Обработчик изменения полей формы
  const handleInputChange = (field: keyof IEducation, value: string | Date) => {
    setCurrentEducation((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Очистка ошибки при изменении поля
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Образование</CardTitle>
        <CardDescription>
          Добавьте информацию о вашем образовании, чтобы работодатели могли оценить вашу
          квалификацию
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Список добавленного образования */}
        {education && education.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Добавленное образование</h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <div className="font-medium">{edu.university}</div>
                    <div className="text-sm text-muted-foreground">
                      {edu.faculty}, {edu.degree}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Год окончания: {format(edu.graduationDate, "yyyy", { locale: ru })}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEducation(edu)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEducation(edu.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Форма добавления/редактирования образования */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {isEditing ? "Редактирование образования" : "Добавление образования"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university">Учебное заведение</Label>
              <Input
                id="university"
                value={currentEducation.university}
                onChange={(e) => handleInputChange("university", e.target.value)}
                placeholder="Например: МГУ им. М.В. Ломоносова"
                className={errors.university ? "border-red-500" : ""}
              />
              {errors.university && <p className="text-red-500 text-sm">{errors.university}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="faculty">Факультет</Label>
              <Input
                id="faculty"
                value={currentEducation.faculty}
                onChange={(e) => handleInputChange("faculty", e.target.value)}
                placeholder="Например: Факультет вычислительной математики и кибернетики"
                className={errors.faculty ? "border-red-500" : ""}
              />
              {errors.faculty && <p className="text-red-500 text-sm">{errors.faculty}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Специальность</Label>
              <Input
                id="degree"
                value={currentEducation.degree}
                onChange={(e) => handleInputChange("degree", e.target.value)}
                placeholder="Например: Прикладная математика и информатика"
                className={errors.degree ? "border-red-500" : ""}
              />
              {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}
            </div>

            <div className="space-y-2">
              <Label>Год окончания</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !currentEducation.graduationDate && "text-muted-foreground",
                      errors.graduationDate && "border-red-500",
                    )}
                  >
                    {currentEducation.graduationDate ? (
                      format(currentEducation.graduationDate, "yyyy", { locale: ru })
                    ) : (
                      <span>Выберите год</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 w-[280px] max-h-[300px] overflow-y-auto">
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from(
                        { length: new Date().getFullYear() + 5 - 1970 + 1 },
                        (_, i) => new Date().getFullYear() + 5 - i,
                      ).map((year) => {
                        const isSelected =
                          currentEducation.graduationDate &&
                          currentEducation.graduationDate.getFullYear() === year;
                        return (
                          <Button
                            key={year}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "h-9 w-full",
                              isSelected && "bg-primary text-primary-foreground",
                            )}
                            onClick={() => {
                              // Создаем новую дату с выбранным годом, сохраняя текущий месяц и день
                              const currentDate = currentEducation.graduationDate || new Date();
                              const newDate = new Date(
                                year,
                                currentDate.getMonth(),
                                currentDate.getDate(),
                              );
                              handleInputChange("graduationDate", newDate);
                              // Закрываем попап после выбора
                              document.body.click(); // Простой способ закрыть Popover
                            }}
                          >
                            {year}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {errors.graduationDate && (
                <p className="text-red-500 text-sm">{errors.graduationDate}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleAddEducation}
              disabled={
                !currentEducation.university ||
                !currentEducation.faculty ||
                !currentEducation.degree ||
                !currentEducation.graduationDate
              }
            >
              {isEditing ? "Обновить" : "Добавить"}
            </Button>
          </div>
        </div>

        {/* Кнопки навигации */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrev}>
            Назад
          </Button>
          <Button type="button" onClick={onNext}>
            Далее
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
