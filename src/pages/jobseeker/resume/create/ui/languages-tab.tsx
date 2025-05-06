import { useUnit } from "effector-react";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  $languages,
  addLanguage,
  removeLanguage,
  updateLanguage,
} from "@/pages/jobseeker/resume/create/model.ts";

import { ILanguage, LanguageLevel } from "@/shared/types/resume.interface.ts";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import { languageLevelLabels } from "./index.tsx";

interface LanguagesTabProps {
  onNext: () => void;
  onPrev: () => void;
}

export const LanguagesTab = ({ onNext, onPrev }: LanguagesTabProps) => {
  const languages = useUnit($languages);
  const addLanguageEvent = useUnit(addLanguage);
  const updateLanguageEvent = useUnit(updateLanguage);
  const removeLanguageEvent = useUnit(removeLanguage);

  // Создаем временный объект для хранения текущего редактируемого языка
  // Это нужно для отслеживания состояния формы, но не влияет на модель
  const [currentLanguage, setCurrentLanguage] = useState<{
    index: number | null;
    name: string;
    level: LanguageLevel;
  }>({
    index: null,
    name: "",
    level: LanguageLevel.Beginner,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = currentLanguage.index !== null;

  // Обработчик добавления/обновления языка
  const handleAddLanguage = () => {
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!currentLanguage.name?.trim()) {
      newErrors.name = "Введите название языка";
    }

    // Проверка на дубликаты
    if (
      !isEditing &&
      languages?.some((lang) => lang.name.toLowerCase() === currentLanguage.name.toLowerCase())
    ) {
      newErrors.name = "Этот язык уже добавлен";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing && currentLanguage.index !== null) {
      // Обновление существующего языка через модель
      updateLanguageEvent({
        index: currentLanguage.index,
        field: "name",
        value: currentLanguage.name,
      });
      updateLanguageEvent({
        index: currentLanguage.index,
        field: "level",
        value: currentLanguage.level,
      });
    } else {
      // Добавление нового языка через модель
      addLanguageEvent();
      const newIndex = languages.length;
      updateLanguageEvent({
        index: newIndex,
        field: "name",
        value: currentLanguage.name,
      });
      updateLanguageEvent({
        index: newIndex,
        field: "level",
        value: currentLanguage.level,
      });
    }

    // Сброс формы
    setCurrentLanguage({
      index: null,
      name: "",
      level: LanguageLevel.Beginner,
    });
    setErrors({});
  };

  // Обработчик редактирования языка
  const handleEditLanguage = (language: ILanguage, index: number) => {
    setCurrentLanguage({
      index,
      name: language.name,
      level: language.level,
    });
    setErrors({});
  };

  // Обработчик удаления языка
  const handleDeleteLanguage = (index: number) => {
    removeLanguageEvent(index);

    if (isEditing && currentLanguage.index === index) {
      setCurrentLanguage({
        index: null,
        name: "",
        level: LanguageLevel.Beginner,
      });
    }
  };

  // Обработчик изменения названия языка
  const handleNameChange = (value: string) => {
    setCurrentLanguage((prev) => ({
      ...prev,
      name: value,
    }));

    // Очистка ошибки при изменении поля
    if (errors.name) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.name;
        return newErrors;
      });
    }
  };

  // Обработчик изменения уровня владения языком
  const handleLevelChange = (value: string) => {
    setCurrentLanguage((prev) => ({
      ...prev,
      level: value as LanguageLevel,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Владение языками</CardTitle>
        <CardDescription>
          Укажите языки, которыми вы владеете, и уровень владения каждым из них
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Список добавленных языков */}
        {languages && languages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Добавленные языки</h3>
            <div className="space-y-3">
              {languages.map((language, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <div className="font-medium">{language.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {languageLevelLabels[language.level]}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditLanguage(language, index)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLanguage(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Форма добавления/редактирования языка */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {isEditing ? "Редактирование языка" : "Добавление языка"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language-name">Язык</Label>
              <Input
                id="language-name"
                value={currentLanguage.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Например: Английский"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language-level">Уровень владения</Label>
              <Select value={currentLanguage.level} onValueChange={handleLevelChange}>
                <SelectTrigger id="language-level">
                  <SelectValue placeholder="Выберите уровень" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageLevelLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={handleAddLanguage} disabled={!currentLanguage.name}>
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
