import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useUnit } from "effector-react";
import { CalendarIcon, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

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

import {
  $activeExperienceIndex,
  $currentExperience,
  $formError,
  $isEditing,
  $pending,
  $workExperiences,
  EmploymentType,
  activeExperienceIndexChanged,
  currentExperienceChanged,
  experienceAdded,
  experienceEditCancelled,
  experienceEditStarted,
  experienceEdited,
  experienceRemoved,
  formSubmitted,
} from "./model";

const employmentTypeLabels = {
  [EmploymentType.FullTime]: "Полный рабочий день",
  [EmploymentType.PartTime]: "Неполный рабочий день",
  [EmploymentType.Remote]: "Удаленная работа",
  [EmploymentType.Office]: "Работа в офисе",
  [EmploymentType.Hybrid]: "Гибридный формат",
};

export const AuthRegistrationJobseekerExperiencePage = () => {
  const [
    workExperiences,
    currentExperience,
    isEditing,
    activeExperienceIndex,
    formError,
    pending,
    handleExperienceAdded,
    handleExperienceEdited,
    handleExperienceEditStarted,
    handleExperienceEditCancelled,
    handleExperienceRemoved,
    handleCurrentExperienceChanged,
    handleActiveExperienceIndexChanged,
    handleFormSubmitted,
  ] = useUnit([
    $workExperiences,
    $currentExperience,
    $isEditing,
    $activeExperienceIndex,
    $formError,
    $pending,
    experienceAdded,
    experienceEdited,
    experienceEditStarted,
    experienceEditCancelled,
    experienceRemoved,
    currentExperienceChanged,
    activeExperienceIndexChanged,
    formSubmitted,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmitted();
  };

  const handleAddExperience = () => {
    if (!currentExperience.position || !currentExperience.company || !currentExperience.startDate) {
      return; // Базовая валидация
    }

    if (isEditing) {
      handleExperienceEdited(currentExperience);
    } else {
      handleExperienceAdded(currentExperience);
    }
  };

  const handleCurrentJobChange = (checked: boolean) => {
    handleCurrentExperienceChanged({
      currentJob: checked,
      endDate: checked ? null : currentExperience.endDate,
    });
  };

  const nextExperience = () => {
    handleActiveExperienceIndexChanged(
      activeExperienceIndex === workExperiences.length - 1 ? 0 : activeExperienceIndex + 1,
    );
  };

  const prevExperience = () => {
    handleActiveExperienceIndexChanged(
      activeExperienceIndex === 0 ? workExperiences.length - 1 : activeExperienceIndex - 1,
    );
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
            backgroundImage: "url('images/blue-background.jpg')",
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

            {formError && (
              <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
                {formError === "EMPTY_REQUIRED_FIELDS" &&
                  "Пожалуйста, заполните все обязательные поля"}
                {formError === "INVALID_DATES" && "Пожалуйста, проверьте правильность дат"}
                {formError === "SERVER_ERROR" && "Произошла ошибка при отправке данных"}
              </div>
            )}

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
                                handleExperienceEditStarted(workExperiences[activeExperienceIndex])
                              }
                              className="h-8 px-2"
                            >
                              Изменить
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleExperienceRemoved(workExperiences[activeExperienceIndex].id)
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
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isEditing ? "Редактирование опыта" : "Добавление опыта работы"}
                  </CardTitle>
                  <CardDescription>
                    {isEditing
                      ? "Измените информацию о вашем опыте работы"
                      : "Заполните информацию о вашем опыте работы"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Должность</Label>
                      <Input
                        id="position"
                        value={currentExperience.position || ""}
                        onChange={(e) =>
                          handleCurrentExperienceChanged({ position: e.target.value })
                        }
                        placeholder="Например: Frontend-разработчик"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Компания</Label>
                      <Input
                        id="company"
                        value={currentExperience.company || ""}
                        onChange={(e) =>
                          handleCurrentExperienceChanged({ company: e.target.value })
                        }
                        placeholder="Например: ООО Рога и Копыта"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employment-type">Тип занятости</Label>
                    <Select
                      value={currentExperience.employmentType}
                      onValueChange={(value) =>
                        handleCurrentExperienceChanged({
                          employmentType: value as EmploymentType,
                        })
                      }
                    >
                      <SelectTrigger id="employment-type">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Дата начала</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !currentExperience.startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {currentExperience.startDate ? (
                              format(currentExperience.startDate, "MMMM yyyy", { locale: ru })
                            ) : (
                              <span>Выберите дату</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={currentExperience.startDate || undefined}
                            onSelect={(date) => handleCurrentExperienceChanged({ startDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2 relative -top-4.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="end-date">Дата окончания</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="current-job"
                            checked={currentExperience.currentJob}
                            onCheckedChange={handleCurrentJobChange}
                          />
                          <Label htmlFor="current-job" className="text-xs">
                            Текущее место работы
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
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {currentExperience.currentJob ? (
                              "По настоящее время"
                            ) : currentExperience.endDate ? (
                              format(currentExperience.endDate, "MMMM yyyy", { locale: ru })
                            ) : (
                              <span>Выберите дату</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={currentExperience.endDate || undefined}
                            onSelect={(date) => handleCurrentExperienceChanged({ endDate: date })}
                            initialFocus
                            disabled={currentExperience.currentJob}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Сайт компании (необязательно)</Label>
                    <Input
                      id="website"
                      value={currentExperience.website || ""}
                      onChange={(e) => handleCurrentExperienceChanged({ website: e.target.value })}
                      placeholder="Например: https://company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Обязанности и достижения</Label>
                    <Textarea
                      id="description"
                      value={currentExperience.responsibilitiesDescription || ""}
                      onChange={(e) =>
                        handleCurrentExperienceChanged({
                          responsibilitiesDescription: e.target.value,
                        })
                      }
                      placeholder="Опишите ваши обязанности и достижения на этой позиции"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleExperienceEditCancelled()}
                      >
                        Отмена
                      </Button>
                    )}
                    <Button type="button" onClick={handleAddExperience}>
                      {isEditing ? "Сохранить изменения" : "Добавить опыт"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline">
                  Назад
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? "Сохранение..." : "Продолжить"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
