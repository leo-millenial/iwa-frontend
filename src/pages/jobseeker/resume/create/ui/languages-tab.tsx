import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { ILanguage, IResume, LanguageLevel } from "@/shared/types/resume.interface.ts";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

import { languageLevelLabels } from "./index.tsx";

interface LanguagesTabProps {
  resume: IResume;
  setResume: React.Dispatch<React.SetStateAction<IResume>>;
  onNext: () => void;
  onPrev: () => void;
}

export const LanguagesTab = ({ resume, setResume, onNext, onPrev }: LanguagesTabProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<ILanguage>({
    id: crypto.randomUUID(),
    name: "",
    level: LanguageLevel.Beginner,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Обработчик добавления/обновления языка
  const handleAddLanguage = () => {
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!currentLanguage.name.trim()) {
      newErrors.name = "Введите название языка";
    }

    // Проверка на дубликаты
    if (
      !isEditing &&
      resume.languages?.some(
        (lang) => lang.name.toLowerCase() === currentLanguage.name.toLowerCase(),
      )
    ) {
      newErrors.name = "Этот язык уже добавлен";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing) {
      // Обновление существующего языка
      setResume((prev) => ({
        ...prev,
        languages: prev.languages?.map((lang) =>
          lang.id === currentLanguage.id ? currentLanguage : lang,
        ),
      }));
      setIsEditing(false);
    } else {
      // Добавление нового языка
      setResume((prev) => ({
        ...prev,
        languages: [...(prev.languages || []), currentLanguage],
      }));
    }

    // Сброс формы
    setCurrentLanguage({
      id: crypto.randomUUID(),
      name: "",
      level: LanguageLevel.Beginner,
    });
    setErrors({});
  };

  // Обработчик редактирования языка
  const handleEditLanguage = (language: ILanguage) => {
    setCurrentLanguage(language);
    setIsEditing(true);
    setErrors({});
  };

  // Обработчик удаления языка
  const handleDeleteLanguage = (id: string) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages?.filter((lang) => lang.id !== id),
    }));

    if (isEditing && currentLanguage.id === id) {
      setCurrentLanguage({
        id: crypto.randomUUID(),
        name: "",
        level: LanguageLevel.Beginner,
      });
      setIsEditing(false);
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
        {resume.languages && resume.languages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Добавленные языки</h3>
            <div className="space-y-3">
              {resume.languages.map((language) => (
                <div
                  key={language.id}
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
                      onClick={() => handleEditLanguage(language)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLanguage(language.id)}
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
