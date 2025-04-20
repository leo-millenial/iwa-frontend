import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button.tsx";
import { Calendar } from "@/shared/ui/calendar.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { LogoLink } from "@/shared/ui/logo-link.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select.tsx";
import { Switch } from "@/shared/ui/switch.tsx";
import { Textarea } from "@/shared/ui/textarea.tsx";

enum EmploymentType {
  FullTime = "FullTime",
  PartTime = "PartTime",
  Remote = "Remote",
  Office = "Office",
  Hybrid = "Hybrid",
}

type WorkExperienceEndDate = Date | null;

interface IWorkExperience {
  id: string;
  position?: string;
  company?: string;
  employmentType?: EmploymentType;
  startDate?: Date;
  endDate?: WorkExperienceEndDate;
  website?: string;
  responsibilitiesDescription?: string;
  currentJob?: boolean;
}

const employmentTypeLabels = {
  [EmploymentType.FullTime]: "Полный рабочий день",
  [EmploymentType.PartTime]: "Неполный рабочий день",
  [EmploymentType.Remote]: "Удаленная работа",
  [EmploymentType.Office]: "Работа в офисе",
  [EmploymentType.Hybrid]: "Гибридный формат",
};

export const AuthRegistrationJobseekerExperiencePage = () => {
  const [workExperiences, setWorkExperiences] = useState<IWorkExperience[]>([]);
  const [currentExperience, setCurrentExperience] = useState<IWorkExperience>({
    id: crypto.randomUUID(),
    currentJob: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Форма отправлена", { workExperiences });
  };

  const handleAddExperience = () => {
    if (!currentExperience.position || !currentExperience.company || !currentExperience.startDate) {
      return; // Базовая валидация
    }

    if (isEditing) {
      setWorkExperiences(
        workExperiences.map((exp) => (exp.id === currentExperience.id ? currentExperience : exp)),
      );
      setIsEditing(false);
    } else {
      setWorkExperiences([...workExperiences, currentExperience]);
      // Устанавливаем активный индекс на новый опыт
      setActiveExperienceIndex(workExperiences.length);
    }

    // Сброс формы
    setCurrentExperience({
      id: crypto.randomUUID(),
      currentJob: false,
    });
  };

  const handleEditExperience = (experience: IWorkExperience) => {
    setCurrentExperience(experience);
    setIsEditing(true);
  };

  const handleDeleteExperience = (id: string) => {
    const index = workExperiences.findIndex((exp) => exp.id === id);
    setWorkExperiences(workExperiences.filter((exp) => exp.id !== id));

    // Корректируем активный индекс после удаления
    if (workExperiences.length > 1) {
      if (index <= activeExperienceIndex) {
        setActiveExperienceIndex(Math.max(0, activeExperienceIndex - 1));
      }
    } else {
      setActiveExperienceIndex(0);
    }

    if (isEditing && currentExperience.id === id) {
      setCurrentExperience({
        id: crypto.randomUUID(),
        currentJob: false,
      });
      setIsEditing(false);
    }
  };

  const handleCurrentJobChange = (checked: boolean) => {
    setCurrentExperience({
      ...currentExperience,
      currentJob: checked,
      endDate: checked ? null : currentExperience.endDate,
    });
  };

  const nextExperience = () => {
    setActiveExperienceIndex((prev) => (prev === workExperiences.length - 1 ? 0 : prev + 1));
  };

  const prevExperience = () => {
    setActiveExperienceIndex((prev) => (prev === 0 ? workExperiences.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-10">
        <LogoLink />
      </header>

      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('images/blue-backgraund.jpg')",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl p-6 space-y-4 bg-card rounded-lg shadow-md">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Опыт работы</h1>
              <p className="text-muted-foreground">
                Расскажите о вашем опыте работы, чтобы работодатели могли лучше оценить ваши навыки
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Карусель опыта работы */}
              {workExperiences.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Ваш опыт работы</h2>
                    <div className="text-sm text-muted-foreground">
                      {activeExperienceIndex + 1} / {workExperiences.length}
                    </div>
                  </div>

                  <div className="relative">
                    <Card className="min-h-[150px] max-h-[180px] overflow-hidden">
                      <CardHeader className="pb-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              {workExperiences[activeExperienceIndex].position}
                            </CardTitle>
                            <CardDescription>
                              {workExperiences[activeExperienceIndex].company}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleEditExperience(workExperiences[activeExperienceIndex])
                              }
                              className="h-8 px-2"
                            >
                              Изменить
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteExperience(workExperiences[activeExperienceIndex].id)
                              }
                              className="h-8 px-2"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="text-sm text-muted-foreground">
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <div>
                              {workExperiences[activeExperienceIndex].employmentType &&
                                employmentTypeLabels[
                                  workExperiences[activeExperienceIndex].employmentType
                                ]}
                            </div>
                            <div>
                              {workExperiences[activeExperienceIndex].startDate &&
                                format(
                                  workExperiences[activeExperienceIndex].startDate,
                                  "MMMM yyyy",
                                  { locale: ru },
                                )}
                              {" - "}
                              {workExperiences[activeExperienceIndex].currentJob
                                ? "По настоящее время"
                                : workExperiences[activeExperienceIndex].endDate &&
                                  format(
                                    workExperiences[activeExperienceIndex].endDate,
                                    "MMMM yyyy",
                                    { locale: ru },
                                  )}
                            </div>
                          </div>
                          {workExperiences[activeExperienceIndex].responsibilitiesDescription && (
                            <div className="mt-1 line-clamp-3">
                              {workExperiences[activeExperienceIndex].responsibilitiesDescription}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {workExperiences.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={prevExperience}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={nextExperience}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Форма добавления/редактирования опыта */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {isEditing ? "Редактирование опыта" : "Добавление опыта работы"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="position">Должность</Label>
                      <Input
                        id="position"
                        value={currentExperience.position || ""}
                        onChange={(e) =>
                          setCurrentExperience({ ...currentExperience, position: e.target.value })
                        }
                        placeholder="Например: Frontend-разработчик"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="company">Компания</Label>
                      <Input
                        id="company"
                        value={currentExperience.company || ""}
                        onChange={(e) =>
                          setCurrentExperience({ ...currentExperience, company: e.target.value })
                        }
                        placeholder="Например: ООО Рога и Копыта"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="employmentType">Тип занятости</Label>
                    <Select
                      value={currentExperience.employmentType}
                      onValueChange={(value) =>
                        setCurrentExperience({
                          ...currentExperience,
                          employmentType: value as EmploymentType,
                        })
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Дата начала</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !currentExperience.startDate && "text-muted-foreground",
                            )}
                            type="button"
                          >
                            {currentExperience.startDate ? (
                              format(currentExperience.startDate, "MMMM yyyy", { locale: ru })
                            ) : (
                              <span>Выберите дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={currentExperience.startDate}
                            onSelect={(date) =>
                              setCurrentExperience({ ...currentExperience, startDate: date })
                            }
                            disabled={(date) => date > new Date()}
                            locale={ru}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label>Дата окончания</Label>
                        <div className="flex items-center space-x-1">
                          <Switch
                            id="currentJob"
                            checked={currentExperience.currentJob}
                            onCheckedChange={handleCurrentJobChange}
                          />
                          <Label htmlFor="currentJob" className="text-xs">
                            По настоящее время
                          </Label>
                        </div>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              (!currentExperience.endDate || currentExperience.currentJob) &&
                                "text-muted-foreground",
                            )}
                            disabled={currentExperience.currentJob}
                            type="button"
                          >
                            {currentExperience.endDate && !currentExperience.currentJob ? (
                              format(currentExperience.endDate, "MMMM yyyy", { locale: ru })
                            ) : (
                              <span>
                                {currentExperience.currentJob
                                  ? "По настоящее время"
                                  : "Выберите дату"}
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={currentExperience.endDate || undefined}
                            onSelect={(date) =>
                              setCurrentExperience({ ...currentExperience, endDate: date })
                            }
                            disabled={(date) =>
                              date > new Date() ||
                              (currentExperience.startDate
                                ? date < currentExperience.startDate
                                : false)
                            }
                            locale={ru}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="website">Сайт компании</Label>
                    <Input
                      id="website"
                      value={currentExperience.website || ""}
                      onChange={(e) =>
                        setCurrentExperience({ ...currentExperience, website: e.target.value })
                      }
                      placeholder="Например: https://company.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="responsibilitiesDescription">Обязанности и достижения</Label>
                    <Textarea
                      id="responsibilitiesDescription"
                      value={currentExperience.responsibilitiesDescription || ""}
                      onChange={(e) =>
                        setCurrentExperience({
                          ...currentExperience,
                          responsibilitiesDescription: e.target.value,
                        })
                      }
                      placeholder="Опишите ваши обязанности и достижения на этой должности"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={handleAddExperience}>
                      {isEditing ? "Сохранить изменения" : "Добавить опыт"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-2">
                <Button variant="outline" type="button">
                  Назад
                </Button>
                <Button type="submit">
                  {workExperiences.length > 0 ? "Сохранить и продолжить" : "Пропустить"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
