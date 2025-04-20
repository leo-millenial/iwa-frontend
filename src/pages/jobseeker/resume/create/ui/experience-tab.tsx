import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import { EmploymentType, IResume, IWorkExperience, employmentTypeLabels } from "../ui";

interface ExperienceTabProps {
  resume: IResume;
  setResume: React.Dispatch<React.SetStateAction<IResume>>;
  onNext: () => void;
  onPrev: () => void;
}

export const ExperienceTab = ({ resume, setResume, onNext, onPrev }: ExperienceTabProps) => {
  const [currentWorkExperience, setCurrentWorkExperience] = useState<IWorkExperience>({
    id: crypto.randomUUID(),
    currentJob: false,
  });

  // Обработчики для опыта работы
  const handleAddWorkExperience = () => {
    if (!currentWorkExperience.position || !currentWorkExperience.company) return;

    setResume((prev) => ({
      ...prev,
      workExperience: [...(prev.workExperience || []), currentWorkExperience],
    }));
    setCurrentWorkExperience({
      id: crypto.randomUUID(),
      currentJob: false,
    });
  };

  const handleDeleteWorkExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      workExperience: prev.workExperience?.filter((exp) => exp.id !== id) || [],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Опыт работы</CardTitle>
        <CardDescription>
          Добавьте информацию о вашем опыте работы, начиная с последнего места
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Список добавленного опыта работы */}
        {resume.workExperience && resume.workExperience.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Добавленный опыт работы:</h3>
            {resume.workExperience.map((experience) => (
              <div
                key={experience.id}
                className="border rounded-lg p-4 relative hover:bg-muted/50 transition-colors"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleDeleteWorkExperience(experience.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <h4 className="font-medium">{experience.position}</h4>
                    <p className="text-sm text-muted-foreground">{experience.company}</p>
                  </div>
                  <div className="text-sm text-right">
                    {experience.startDate && (
                      <span>
                        {format(experience.startDate, "MMMM yyyy", { locale: ru })} -{" "}
                        {experience.currentJob
                          ? "По настоящее время"
                          : experience.endDate &&
                            format(experience.endDate, "MMMM yyyy", { locale: ru })}
                      </span>
                    )}
                    <p className="text-muted-foreground">
                      {experience.employmentType && employmentTypeLabels[experience.employmentType]}
                    </p>
                  </div>
                </div>
                {experience.responsibilitiesDescription && (
                  <p className="text-sm mt-2">{experience.responsibilitiesDescription}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Форма добавления нового опыта работы */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium">Добавить новое место работы</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Должность *</Label>
              <Input
                id="position"
                value={currentWorkExperience.position || ""}
                onChange={(e) =>
                  setCurrentWorkExperience((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
                placeholder="Например: Frontend-разработчик"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Компания *</Label>
              <Input
                id="company"
                value={currentWorkExperience.company || ""}
                onChange={(e) =>
                  setCurrentWorkExperience((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                placeholder="Например: ООО 'Компания'"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employmentType">Тип занятости</Label>
              <Select
                value={currentWorkExperience.employmentType}
                onValueChange={(value) =>
                  setCurrentWorkExperience((prev) => ({
                    ...prev,
                    employmentType: value as EmploymentType,
                  }))
                }
              >
                <SelectTrigger id="employmentType">
                  <SelectValue placeholder="Выберите тип занятости" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(employmentTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Сайт компании</Label>
              <Input
                id="website"
                value={currentWorkExperience.website || ""}
                onChange={(e) =>
                  setCurrentWorkExperience((prev) => ({
                    ...prev,
                    website: e.target.value,
                  }))
                }
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Дата начала</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !currentWorkExperience.startDate && "text-muted-foreground",
                    )}
                  >
                    {currentWorkExperience.startDate ? (
                      format(currentWorkExperience.startDate, "MMMM yyyy", { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentWorkExperience.startDate}
                    onSelect={(date) =>
                      setCurrentWorkExperience((prev) => ({
                        ...prev,
                        startDate: date,
                      }))
                    }
                    initialFocus
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="endDate">Дата окончания</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="currentJob"
                    checked={currentWorkExperience.currentJob}
                    onCheckedChange={(checked) =>
                      setCurrentWorkExperience((prev) => ({
                        ...prev,
                        currentJob: checked === true,
                        endDate: checked === true ? null : prev.endDate,
                      }))
                    }
                  />
                  <Label htmlFor="currentJob" className="text-sm">
                    Текущее место работы
                  </Label>
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !currentWorkExperience.endDate && "text-muted-foreground",
                    )}
                    disabled={currentWorkExperience.currentJob === true}
                  >
                    {currentWorkExperience.endDate ? (
                      format(currentWorkExperience.endDate, "MMMM yyyy", { locale: ru })
                    ) : (
                      <span>
                        {currentWorkExperience.currentJob ? "По настоящее время" : "Выберите дату"}
                      </span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={currentWorkExperience.endDate || undefined}
                    onSelect={(date) =>
                      setCurrentWorkExperience((prev) => ({
                        ...prev,
                        endDate: date,
                      }))
                    }
                    initialFocus
                    locale={ru}
                    disabled={currentWorkExperience.currentJob === true}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Обязанности и достижения</Label>
            <Textarea
              id="responsibilities"
              value={currentWorkExperience.responsibilitiesDescription || ""}
              onChange={(e) =>
                setCurrentWorkExperience((prev) => ({
                  ...prev,
                  responsibilitiesDescription: e.target.value,
                }))
              }
              placeholder="Опишите ваши основные обязанности и достижения на этой позиции"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="button"
              onClick={handleAddWorkExperience}
              disabled={!currentWorkExperience.position || !currentWorkExperience.company}
            >
              Добавить место работы
            </Button>
          </div>
        </div>

        <div className="flex justify-between mt-6">
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
