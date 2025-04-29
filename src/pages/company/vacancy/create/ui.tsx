import { useUnit } from "effector-react";
import React from "react";

import { LayoutCompany } from "@/layouts/company-layout";

import { EmploymentType, Experience } from "@/shared/types/vacancy.interface";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import {
  $brandsInput,
  $city,
  $currency,
  $description,
  $employmentTypes,
  $experience,
  $pending,
  $salaryMax,
  $salaryMin,
  $skillsText,
  $title,
  brandsChanged,
  cityChanged,
  currencyChanged,
  descriptionChanged,
  employmentTypeToggled,
  experienceChanged,
  formSubmitted,
  salaryMaxChanged,
  salaryMinChanged,
  skillsTextChanged,
  titleChanged,
} from "./model";

// Лейблы для отображения
const employmentTypeLabels: Record<EmploymentType, string> = {
  [EmploymentType.FullTime]: "Полный рабочий день",
  [EmploymentType.PartTime]: "Частичная занятость",
  [EmploymentType.Remote]: "Удаленная работа",
  [EmploymentType.Office]: "Работа в офисе",
  [EmploymentType.Hybrid]: "Гибридный формат",
};

const experienceLabels: Record<Experience, string> = {
  [Experience.Intern]: "Стажер",
  [Experience.Junior]: "Младший специалист",
  [Experience.Middle]: "Специалист",
  [Experience.Senior]: "Старший специалист",
  [Experience.Manager]: "Менеджер",
  [Experience.Director]: "Руководитель",
};

const currencies = [
  { value: "RUB", label: "₽ Рубль" },
  { value: "USD", label: "$ Доллар" },
  { value: "EUR", label: "€ Евро" },
];

export const CompanyVacancyCreatePage = () => {
  // Получаем значения из сторов и события через useUnit
  const [
    pending,
    title,
    description,
    skillsText,
    salaryMin,
    salaryMax,
    currency,
    city,
    experience,
    employmentTypes,
    brandsInput,
    handleTitleChange,
    handleDescriptionChange,
    handleSkillsChange,
    handleSalaryMinChange,
    handleSalaryMaxChange,
    handleCurrencyChange,
    handleCityChange,
    handleExperienceChange,
    handleEmploymentTypeToggle,
    handleBrandsChange,
    handleSubmit,
  ] = useUnit([
    $pending,
    $title,
    $description,
    $skillsText,
    $salaryMin,
    $salaryMax,
    $currency,
    $city,
    $experience,
    $employmentTypes,
    $brandsInput,
    titleChanged,
    descriptionChanged,
    skillsTextChanged,
    salaryMinChanged,
    salaryMaxChanged,
    currencyChanged,
    cityChanged,
    experienceChanged,
    employmentTypeToggled,
    brandsChanged,
    formSubmitted,
  ]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <LayoutCompany>
      <div className="flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-3xl bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Новая вакансия</h1>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Основная информация */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название вакансии</Label>
                    <Input
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Например: Frontend-разработчик (React)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Город</Label>
                    <Input
                      id="city"
                      name="city"
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      placeholder="Например: Москва"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Требуемый опыт</Label>
                    <Select
                      value={experience}
                      onValueChange={(value) => handleExperienceChange(value as Experience)}
                    >
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Выберите требуемый опыт" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(experienceLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Типы занятости */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label>Формат работы (можно выбрать несколько)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(employmentTypeLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`employment-${value}`}
                          checked={employmentTypes.includes(value as EmploymentType)}
                          onCheckedChange={() =>
                            handleEmploymentTypeToggle(value as EmploymentType)
                          }
                        />
                        <Label htmlFor={`employment-${value}`} className="cursor-pointer">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Бренды */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brands">Бренды</Label>
                    <Textarea
                      id="brands"
                      value={brandsInput}
                      onChange={(e) => handleBrandsChange(e.target.value)}
                      placeholder="Перечислите бренды через запятую"
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Укажите бренды, с которыми вы хотели чтобы работал кандидат (не обязательно)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Описание вакансии */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание вакансии</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      placeholder="Опишите обязанности, требования и условия работы"
                      className="min-h-[250px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Подробно опишите, чем будет заниматься сотрудник, какие требования к кандидату
                      и какие условия вы предлагаете
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Навыки</Label>
                    <Textarea
                      id="skills"
                      value={skillsText}
                      onChange={(e) => handleSkillsChange(e.target.value)}
                      placeholder="Перечислите необходимые навыки через запятую"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Зарплата */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Label>Оплата работы</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary-min">От</Label>
                      <Input
                        id="salary-min"
                        type="number"
                        value={salaryMin}
                        onChange={(e) => handleSalaryMinChange(e.target.value)}
                        placeholder="Минимальная сумма"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary-max">До</Label>
                      <Input
                        id="salary-max"
                        type="number"
                        value={salaryMax}
                        onChange={(e) => handleSalaryMaxChange(e.target.value)}
                        placeholder="Максимальная сумма"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary-currency">Валюта</Label>
                      <Select value={currency} onValueChange={handleCurrencyChange}>
                        <SelectTrigger id="salary-currency">
                          <SelectValue placeholder="Выберите валюту" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currencyOption) => (
                            <SelectItem key={currencyOption.value} value={currencyOption.value}>
                              {currencyOption.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Кнопки действий */}
            <div className="flex justify-end space-x-4">
              <Button disabled={pending} type="submit">
                {pending ? "Сохранение..." : "Создать вакансию"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </LayoutCompany>
  );
};
