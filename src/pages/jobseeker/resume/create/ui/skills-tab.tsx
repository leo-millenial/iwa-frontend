import { useUnit } from "effector-react";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  $skills,
  addSkill,
  removeSkill,
  updateSkill,
} from "@/pages/jobseeker/resume/create/model.ts";
import { skillLevelLabels } from "@/pages/jobseeker/resume/create/ui/index.tsx";

import { ISkill, SkillLevel } from "@/shared/types/resume.interface.ts";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

interface SkillsTabProps {
  onNext: () => void;
  onPrev: () => void;
}

export const SkillsTab = ({ onNext, onPrev }: SkillsTabProps) => {
  // Получаем данные и события из модели
  const skills = useUnit($skills);
  const addSkillEvent = useUnit(addSkill);
  const updateSkillEvent = useUnit(updateSkill);
  const removeSkillEvent = useUnit(removeSkill);

  // Создаем временный объект для хранения текущего редактируемого навыка
  // Это нужно для отслеживания состояния формы, но не влияет на модель
  const [currentSkill, setCurrentSkill] = useState<{
    index: number | null;
    name: string;
    level: SkillLevel;
  }>({
    index: null,
    name: "",
    level: SkillLevel.Intermediate,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = currentSkill.index !== null;

  // Обработчик добавления/обновления навыка
  const handleAddSkill = () => {
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!currentSkill.name?.trim()) {
      newErrors.name = "Введите название навыка";
    }

    // Проверка на дубликаты
    if (
      !isEditing &&
      skills?.some((skill) => skill.name.toLowerCase() === currentSkill.name.toLowerCase())
    ) {
      newErrors.name = "Этот навык уже добавлен";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing && currentSkill.index !== null) {
      // Обновление существующего навыка через модель
      updateSkillEvent({
        index: currentSkill.index,
        field: "name",
        value: currentSkill.name,
      });
      updateSkillEvent({
        index: currentSkill.index,
        field: "level",
        value: currentSkill.level,
      });
    } else {
      // Добавление нового навыка через модель
      addSkillEvent();
      const newIndex = skills.length;
      updateSkillEvent({
        index: newIndex,
        field: "name",
        value: currentSkill.name,
      });
      updateSkillEvent({
        index: newIndex,
        field: "level",
        value: currentSkill.level,
      });
    }

    // Сброс формы
    setCurrentSkill({
      index: null,
      name: "",
      level: SkillLevel.Intermediate,
    });
    setErrors({});
  };

  // Обработчик редактирования навыка
  const handleEditSkill = (skill: ISkill, index: number) => {
    setCurrentSkill({
      index,
      name: skill.name,
      level: skill.level,
    });
    setErrors({});
  };

  // Обработчик удаления навыка
  const handleDeleteSkill = (index: number) => {
    removeSkillEvent(index);

    if (isEditing && currentSkill.index === index) {
      setCurrentSkill({
        index: null,
        name: "",
        level: SkillLevel.Intermediate,
      });
    }
  };

  // Обработчик изменения названия навыка
  const handleNameChange = (value: string) => {
    setCurrentSkill((prev) => ({
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

  // Обработчик изменения уровня владения навыком
  const handleLevelChange = (value: string) => {
    setCurrentSkill((prev) => ({
      ...prev,
      level: value as SkillLevel,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Профессиональные навыки</CardTitle>
        <CardDescription>
          Укажите ваши профессиональные навыки и уровень владения каждым из них
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Список добавленных навыков */}
        {skills && skills.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Добавленные навыки</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {skillLevelLabels[skill.level]}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSkill(skill, index)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSkill(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Форма добавления/редактирования навыка */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {isEditing ? "Редактирование навыка" : "Добавление навыка"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skill-name">Навык</Label>
              <Input
                id="skill-name"
                value={currentSkill.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Например: React.js"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-level">Уровень владения</Label>
              <Select value={currentSkill.level} onValueChange={handleLevelChange}>
                <SelectTrigger id="skill-level">
                  <SelectValue placeholder="Выберите уровень" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(skillLevelLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={handleAddSkill} disabled={!currentSkill.name}>
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
