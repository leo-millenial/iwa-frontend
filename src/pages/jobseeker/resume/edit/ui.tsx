import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useUnit } from "effector-react";
import { CalendarIcon, Loader2, PlusCircle, Save, Trash2 } from "lucide-react";

import { ResumeStatusSelect } from "@/entities/resume";

import { Gender, LanguageLevel, SkillLevel } from "@/shared/types/resume.interface";
import { EmploymentType } from "@/shared/types/vacancy.interface";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PageLoader } from "@/shared/ui/page-loader";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";

import * as model from "./model";

export const JobseekerResumeEditPage = () => {
  const [
    position,
    firstName,
    lastName,
    patronymic,
    gender,
    birthday,
    email,
    phone,
    city,
    aboutMe,
    incomeAmount,
    incomeCurrency,
    workExperience,
    education,
    skills,
    languages,
    pending,
    activeTab,
    status,
  ] = useUnit([
    model.$position,
    model.$firstName,
    model.$lastName,
    model.$patronymic,
    model.$gender,
    model.$birthday,
    model.$email,
    model.$phone,
    model.$city,
    model.$aboutMe,
    model.$incomeAmount,
    model.$incomeCurrency,
    model.$workExperience,
    model.$education,
    model.$skills,
    model.$languages,
    model.$pending,
    model.$activeTab,
    model.$status,
  ]);

  const [
    handlePositionChange,
    handleFirstNameChange,
    handleLastNameChange,
    handlePatronymicChange,
    handleGenderChange,
    handleEmailChange,
    handlePhoneChange,
    handleCityChange,
    handleAboutMeChange,
    handleIncomeAmountChange,
    handleIncomeCurrencyChange,
    handleAddWorkExperience,
    handleUpdateWorkExperience,
    handleRemoveWorkExperience,
    handleAddEducation,
    handleUpdateEducation,
    handleRemoveEducation,
    handleAddSkill,
    handleUpdateSkill,
    handleRemoveSkill,
    handleAddLanguage,
    handleUpdateLanguage,
    handleRemoveLanguage,
    handleSubmit,
    handleActiveTabChange,
    handleBirthdayChange,
    handleStatusChange,
  ] = useUnit([
    model.positionChanged,
    model.firstNameChanged,
    model.lastNameChanged,
    model.patronymicChanged,
    model.genderChanged,
    model.emailChanged,
    model.phoneChanged,
    model.cityChanged,
    model.aboutMeChanged,
    model.incomeAmountChanged,
    model.incomeCurrencyChanged,
    model.addWorkExperience,
    model.updateWorkExperience,
    model.removeWorkExperience,
    model.addEducation,
    model.updateEducation,
    model.removeEducation,
    model.addSkill,
    model.updateSkill,
    model.removeSkill,
    model.addLanguage,
    model.updateLanguage,
    model.removeLanguage,
    model.formSubmitted,
    model.activeTabChanged,
    model.birthdayChanged,
    model.statusChanged,
  ]);

  if (pending) {
    return <PageLoader />;
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Редактирование резюме</h1>
        <Button onClick={handleSubmit} disabled={pending}>
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Сохранить изменения
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleActiveTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="personal">Личная информация</TabsTrigger>
          <TabsTrigger value="experience">Опыт работы</TabsTrigger>
          <TabsTrigger value="education">Образование</TabsTrigger>
          <TabsTrigger value="skills">Навыки и языки</TabsTrigger>
        </TabsList>

        {/* Личная информация */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Должность</Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => handlePositionChange(e.target.value)}
                    placeholder="Например: Frontend-разработчик"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Город</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    placeholder="Например: Москва"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incomeAmount">Желаемая зарплата</Label>
                  <div className="flex gap-2">
                    <Input
                      id="incomeAmount"
                      type="number"
                      value={incomeAmount}
                      onChange={(e) => handleIncomeAmountChange(e.target.value)}
                      placeholder="Например: 150000"
                    />
                    <Select
                      value={
                        typeof incomeCurrency === "number" ? String(incomeCurrency) : incomeCurrency
                      }
                      onValueChange={handleIncomeCurrencyChange}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Валюта" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RUB">₽</SelectItem>
                        <SelectItem value="USD">$</SelectItem>
                        <SelectItem value="EUR">€</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="resume-status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Статус
                  </label>
                  <ResumeStatusSelect value={status} onChange={handleStatusChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Персональные данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    placeholder="Фамилия"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    placeholder="Имя"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patronymic">Отчество</Label>
                  <Input
                    id="patronymic"
                    value={patronymic}
                    onChange={(e) => handlePatronymicChange(e.target.value)}
                    placeholder="Отчество (если есть)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Пол</Label>
                  <RadioGroup
                    value={gender}
                    onValueChange={(value) => handleGenderChange(value as Gender)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={Gender.Male} id="male" />
                      <Label htmlFor="male">Мужской</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={Gender.Female} id="female" />
                      <Label htmlFor="female">Женский</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthday">Дата рождения</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="birthday"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !birthday && "text-muted-foreground",
                        )}
                      >
                        {birthday ? (
                          format(new Date(birthday), "dd MMMM yyyy", { locale: ru })
                        ) : (
                          <span>Выберите дату</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={birthday ? new Date(birthday) : undefined}
                        onSelect={(date) =>
                          date ? handleBirthdayChange(date) : handleBirthdayChange(null)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="example@mail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutMe">О себе</Label>
                <Textarea
                  id="aboutMe"
                  value={aboutMe}
                  onChange={(e) => handleAboutMeChange(e.target.value)}
                  placeholder="Расскажите о себе, своих навыках и достижениях"
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {aboutMe?.length || 0}/2000 символов
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Опыт работы */}
        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Опыт работы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {workExperience && workExperience.length > 0 ? (
                workExperience.map((exp, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Место работы #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveWorkExperience(index)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`company-${index}`}>Компания</Label>
                        <Input
                          id={`company-${index}`}
                          value={exp.company}
                          onChange={(e) =>
                            handleUpdateWorkExperience({
                              index,
                              field: "company",
                              value: e.target.value,
                            })
                          }
                          placeholder="Название компании"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`position-${index}`}>Должность</Label>
                        <Input
                          id={`position-${index}`}
                          value={exp.position}
                          onChange={(e) =>
                            handleUpdateWorkExperience({
                              index,
                              field: "position",
                              value: e.target.value,
                            })
                          }
                          placeholder="Ваша должность"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>Дата начала</Label>
                        <Input
                          id={`startDate-${index}`}
                          type="date"
                          value={
                            exp.startDate instanceof Date
                              ? exp.startDate.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleUpdateWorkExperience({
                              index,
                              field: "startDate",
                              value: new Date(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${index}`}>Дата окончания</Label>
                        <Input
                          id={`endDate-${index}`}
                          type="date"
                          value={
                            exp.endDate instanceof Date
                              ? exp.endDate.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleUpdateWorkExperience({
                              index,
                              field: "endDate",
                              value: e.target.value ? new Date(e.target.value) : null,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`employmentType-${index}`}>Тип занятости</Label>
                      <Select
                        value={exp.employmentType}
                        onValueChange={(value) =>
                          handleUpdateWorkExperience({
                            index,
                            field: "employmentType",
                            value: value as EmploymentType,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип занятости" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EmploymentType.FullTime}>Полная занятость</SelectItem>
                          <SelectItem value={EmploymentType.PartTime}>
                            Частичная занятость
                          </SelectItem>
                          <SelectItem value={EmploymentType.Remote}>Удаленная работа</SelectItem>
                          <SelectItem value={EmploymentType.Office}>Работа в офисе</SelectItem>
                          <SelectItem value={EmploymentType.Hybrid}>Гибридный формат</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`responsibilities-${index}`}>Обязанности и достижения</Label>
                      <Textarea
                        id={`responsibilities-${index}`}
                        value={exp.responsibilitiesDescription}
                        onChange={(e) =>
                          handleUpdateWorkExperience({
                            index,
                            field: "responsibilitiesDescription",
                            value: e.target.value,
                          })
                        }
                        placeholder="Опишите ваши обязанности и достижения на этой позиции"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  У вас пока нет добавленного опыта работы
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddWorkExperience}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить место работы
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Образование */}
        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Образование</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {education && education.length > 0 ? (
                education.map((edu, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Образование #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEducation(index)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`university-${index}`}>Учебное заведение</Label>
                        <Input
                          id={`university-${index}`}
                          value={edu.university}
                          onChange={(e) =>
                            handleUpdateEducation({
                              index,
                              field: "university",
                              value: e.target.value,
                            })
                          }
                          placeholder="Название университета"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`faculty-${index}`}>Факультет</Label>
                        <Input
                          id={`faculty-${index}`}
                          value={edu.faculty}
                          onChange={(e) =>
                            handleUpdateEducation({
                              index,
                              field: "faculty",
                              value: e.target.value,
                            })
                          }
                          placeholder="Факультет"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`degree-${index}`}>Специальность</Label>
                        <Input
                          id={`degree-${index}`}
                          value={edu.degree}
                          onChange={(e) =>
                            handleUpdateEducation({
                              index,
                              field: "degree",
                              value: e.target.value,
                            })
                          }
                          placeholder="Специальность"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`graduation-${index}`}>Год окончания</Label>
                        <Input
                          id={`graduation-${index}`}
                          type="date"
                          value={
                            edu.graduationDate instanceof Date
                              ? edu.graduationDate.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleUpdateEducation({
                              index,
                              field: "graduationDate",
                              value: new Date(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  У вас пока нет добавленного образования
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddEducation}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить образование
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Навыки */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Навыки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-4 p-2 border rounded-lg">
                    <div className="flex-grow">
                      <Input
                        value={skill.name}
                        onChange={(e) =>
                          handleUpdateSkill({
                            index,
                            field: "name",
                            value: e.target.value,
                          })
                        }
                        placeholder="Название навыка"
                      />
                    </div>
                    <div className="w-40">
                      <Select
                        value={skill.level}
                        onValueChange={(value) =>
                          handleUpdateSkill({
                            index,
                            field: "level",
                            value: value as SkillLevel,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Уровень" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SkillLevel.Beginner}>Начинающий</SelectItem>
                          <SelectItem value={SkillLevel.Intermediate}>Средний</SelectItem>
                          <SelectItem value={SkillLevel.Advanced}>Продвинутый</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  У вас пока нет добавленных навыков
                </div>
              )}

              <Button type="button" variant="outline" onClick={handleAddSkill} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить навык
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Языки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {languages && languages.length > 0 ? (
                languages.map((language, index) => (
                  <div key={index} className="flex items-center space-x-4 p-2 border rounded-lg">
                    <div className="flex-grow">
                      <Input
                        value={language.name}
                        onChange={(e) =>
                          handleUpdateLanguage({
                            index,
                            field: "name",
                            value: e.target.value,
                          })
                        }
                        placeholder="Название языка"
                      />
                    </div>
                    <div className="w-40">
                      <Select
                        value={language.level}
                        onValueChange={(value) =>
                          handleUpdateLanguage({
                            index,
                            field: "level",
                            value: value as LanguageLevel,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Уровень" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={LanguageLevel.Beginner}>Начальный</SelectItem>
                          <SelectItem value={LanguageLevel.Intermediate}>Средний</SelectItem>
                          <SelectItem value={LanguageLevel.Advanced}>Продвинутый</SelectItem>
                          <SelectItem value={LanguageLevel.Native}>Родной</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLanguage(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  У вас пока нет добавленных языков
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddLanguage}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить язык
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
