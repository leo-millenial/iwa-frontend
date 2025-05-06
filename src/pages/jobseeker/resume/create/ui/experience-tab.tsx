import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useUnit } from "effector-react";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";

import { EmploymentType } from "@/shared/types/vacancy.interface";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import {
  $workExperience,
  addWorkExperience,
  removeWorkExperience,
  updateWorkExperience,
} from "../model.ts";

const employmentTypeLabels: Record<EmploymentType, string> = {
  [EmploymentType.FullTime]: "Полная занятость",
  [EmploymentType.PartTime]: "Частичная занятость",
  [EmploymentType.Remote]: "Удаленная работа",
  [EmploymentType.Office]: "Офис",
  [EmploymentType.Hybrid]: "Гибридный формат",
};

interface WorkExperience {
  onNext: () => void;
  onPrev: () => void;
}

export const ExperienceTab = ({ onNext, onPrev }: WorkExperience) => {
  const [workExperience, handleAddExperience, handleUpdateExperience, handleRemoveExperience] =
    useUnit([$workExperience, addWorkExperience, updateWorkExperience, removeWorkExperience]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Опыт работы</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => handleAddExperience()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить место работы
        </Button>
      </div>

      {workExperience.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-8">
            <div className="text-muted-foreground mb-2">
              Добавьте информацию о вашем опыте работы
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => handleAddExperience()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить место работы
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workExperience.map((experience, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {experience.position || "Новое место работы"}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveExperience(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`position-${index}`}>Должность</Label>
                    <Input
                      id={`position-${index}`}
                      value={experience.position}
                      onChange={(e) =>
                        handleUpdateExperience({
                          index,
                          field: "position",
                          value: e.target.value,
                        })
                      }
                      placeholder="Например: Frontend-разработчик"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`company-${index}`}>Компания</Label>
                    <Input
                      id={`company-${index}`}
                      value={experience.company}
                      onChange={(e) =>
                        handleUpdateExperience({
                          index,
                          field: "company",
                          value: e.target.value,
                        })
                      }
                      placeholder="Например: ООО 'Технологии'"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`employment-type-${index}`}>Тип занятости</Label>
                    <Select
                      value={experience.employmentType}
                      onValueChange={(value) =>
                        handleUpdateExperience({
                          index,
                          field: "employmentType",
                          value: value as EmploymentType,
                        })
                      }
                    >
                      <SelectTrigger id={`employment-type-${index}`}>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Дата начала</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {experience.startDate
                            ? format(new Date(experience.startDate), "PPP", { locale: ru })
                            : "Выберите дату"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            experience.startDate ? new Date(experience.startDate) : undefined
                          }
                          onSelect={(date) =>
                            handleUpdateExperience({
                              index,
                              field: "startDate",
                              value: date || new Date(),
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Дата окончания</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {experience.endDate
                            ? format(new Date(experience.endDate), "PPP", { locale: ru })
                            : "По настоящее время"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={experience.endDate ? new Date(experience.endDate) : undefined}
                          onSelect={(date) =>
                            handleUpdateExperience({
                              index,
                              field: "endDate",
                              value: date ? date : null,
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Обязанности и достижения</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={experience.responsibilitiesDescription}
                    onChange={(e) =>
                      handleUpdateExperience({
                        index,
                        field: "responsibilitiesDescription",
                        value: e.target.value,
                      })
                    }
                    placeholder="Опишите ваши основные обязанности и достижения на этой должности"
                    className="min-h-[120px]"
                  />
                </div>

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
          ))}
        </div>
      )}

      {workExperience.length > 0 && (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={() => handleAddExperience()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить еще одно место работы
          </Button>
        </div>
      )}
    </div>
  );
};
