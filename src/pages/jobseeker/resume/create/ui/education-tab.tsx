import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { IEducation, IResume } from "@/shared/types/resume.interface.ts";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface EducationTabProps {
  resume: IResume;
  setResume: React.Dispatch<React.SetStateAction<IResume>>;
  onNext: () => void;
  onPrev: () => void;
}

export const EducationTab = ({ resume, setResume, onNext, onPrev }: EducationTabProps) => {
  const [currentEducation, setCurrentEducation] = useState<IEducation>({
    id: crypto.randomUUID(),
    university: "",
    faculty: "",
    degree: "",
    graduationDate: new Date(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      // Обновление существующего образования
      setResume((prev) => ({
        ...prev,
        education: prev.education?.map((edu) =>
          edu.id === currentEducation.id ? currentEducation : edu,
        ),
      }));
      setIsEditing(false);
    } else {
      // Добавление нового образования
      setResume((prev) => ({
        ...prev,
        education: [...(prev.education || []), currentEducation],
      }));
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
  const handleEditEducation = (education: IEducation) => {
    setCurrentEducation(education);
    setIsEditing(true);
    setErrors({});
  };

  // Обработчик удаления образования
  const handleDeleteEducation = (id: string) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education?.filter((edu) => edu.id !== id),
    }));

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
        {resume.education && resume.education.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Добавленное образование</h3>
            <div className="space-y-3">
              {resume.education.map((education) => (
                <div
                  key={education.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <div className="font-medium">{education.university}</div>
                    <div className="text-sm text-muted-foreground">
                      {education.faculty}, {education.degree}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Год окончания: {format(education.graduationDate, "yyyy", { locale: ru })}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditEducation(education)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEducation(education.id)}
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
                  <Calendar
                    mode="single"
                    selected={currentEducation.graduationDate}
                    onSelect={(date) => handleInputChange("graduationDate", date as Date)}
                    initialFocus
                    locale={ru}
                    captionLayout="dropdown-buttons"
                    fromYear={1970}
                    toYear={new Date().getFullYear() + 5}
                    disabled={(date) => date > new Date(new Date().getFullYear() + 5, 0, 1)}
                  />
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
