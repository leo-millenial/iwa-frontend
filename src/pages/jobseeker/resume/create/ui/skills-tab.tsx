import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { skillLevelLabels } from "@/pages/jobseeker/resume/create/ui/index.tsx";

import { IResume, ISkill, SkillLevel } from "@/shared/types/resume.interface.ts";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

interface SkillsTabProps {
  resume: IResume;
  setResume: React.Dispatch<React.SetStateAction<IResume>>;
  onNext: () => void;
  onPrev: () => void;
}

export const SkillsTab = ({ resume, setResume, onNext, onPrev }: SkillsTabProps) => {
  const [currentSkill, setCurrentSkill] = useState<ISkill>({
    id: crypto.randomUUID(),
    name: "",
    level: SkillLevel.Intermediate,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Обработчик добавления/обновления навыка
  const handleAddSkill = () => {
    // Валидация
    const newErrors: Record<string, string> = {};
    if (!currentSkill.name.trim()) {
      newErrors.name = "Введите название навыка";
    }

    // Проверка на дубликаты
    if (
      !isEditing &&
      resume.skills?.some((skill) => skill.name.toLowerCase() === currentSkill.name.toLowerCase())
    ) {
      newErrors.name = "Этот навык уже добавлен";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing) {
      // Обновление существующего навыка
      setResume((prev) => ({
        ...prev,
        skills: prev.skills?.map((skill) => (skill.id === currentSkill.id ? currentSkill : skill)),
      }));
      setIsEditing(false);
    } else {
      // Добавление нового навыка
      setResume((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), currentSkill],
      }));
    }

    // Сброс формы
    setCurrentSkill({
      id: crypto.randomUUID(),
      name: "",
      level: SkillLevel.Intermediate,
    });
    setErrors({});
  };

  // Обработчик редактирования навыка
  const handleEditSkill = (skill: ISkill) => {
    setCurrentSkill(skill);
    setIsEditing(true);
    setErrors({});
  };

  // Обработчик удаления навыка
  const handleDeleteSkill = (id: string) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills?.filter((skill) => skill.id !== id),
    }));

    if (isEditing && currentSkill.id === id) {
      setCurrentSkill({
        id: crypto.randomUUID(),
        name: "",
        level: SkillLevel.Intermediate,
      });
      setIsEditing(false);
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
        {resume.skills && resume.skills.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Добавленные навыки</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resume.skills.map((skill) => (
                <div
                  key={skill.id}
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
                      onClick={() => handleEditSkill(skill)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSkill(skill.id)}
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
