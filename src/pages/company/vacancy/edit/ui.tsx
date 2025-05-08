import { useUnit } from "effector-react";
import { Loader2 } from "lucide-react";

import {
  $city,
  $currency,
  $description,
  $employmentTypes,
  $experience,
  $pending,
  $salaryMax,
  $salaryMin,
  $title,
  cityChanged,
  currencyChanged,
  descriptionChanged,
  employmentTypeToggled,
  experienceChanged,
  formSubmitted,
  salaryMaxChanged,
  salaryMinChanged,
  titleChanged,
} from "@/pages/company/vacancy/edit/model";

import { EmploymentType, Experience } from "@/shared/types/vacancy.interface";
import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent } from "@/shared/ui/card.tsx";
import { Checkbox } from "@/shared/ui/checkbox.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Label } from "@/shared/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select.tsx";
import { Textarea } from "@/shared/ui/textarea.tsx";

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

export const CompanyVacancyEditPage = () => {
  const title = useUnit($title);
  const description = useUnit($description);
  const city = useUnit($city);
  const experience = useUnit($experience);
  const employmentTypes = useUnit($employmentTypes);
  const salaryMin = useUnit($salaryMin);
  const salaryMax = useUnit($salaryMax);
  const currency = useUnit($currency);
  const pending = useUnit($pending);

  // Обработчики изменения полей формы
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    titleChanged(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cityChanged(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    descriptionChanged(e.target.value);
  };

  const handleExperienceChange = (value: string) => {
    experienceChanged(value as Experience);
  };

  const handleEmploymentTypeToggle = (type: EmploymentType) => {
    employmentTypeToggled(type);
  };

  const handleSalaryMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    salaryMinChanged(e.target.value);
  };

  const handleSalaryMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    salaryMaxChanged(e.target.value);
  };

  const handleCurrencyChange = (value: string) => {
    currencyChanged(value);
  };

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formSubmitted();
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (pending && !title) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Загрузка данных вакансии...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start py-8 px-4">
      <div className="w-full max-w-3xl bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Редактирование вакансии</h1>
        </div>

        {/*{error && (*/}
        {/*  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">*/}
        {/*    {error}*/}
        {/*  </div>*/}
        {/*)}*/}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={handleTitleChange}
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
                    onChange={handleCityChange}
                    placeholder="Например: Москва"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Требуемый опыт</Label>
                  <Select value={experience} onValueChange={handleExperienceChange}>
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

                <div className="space-y-2">
                  <Label>Тип занятости</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(employmentTypeLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`employment-${value}`}
                          checked={employmentTypes.includes(value as EmploymentType)}
                          onCheckedChange={() =>
                            handleEmploymentTypeToggle(value as EmploymentType)
                          }
                        />
                        <Label htmlFor={`employment-${value}`} className="font-normal">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Зарплата</Label>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <Input
                        type="number"
                        placeholder="От"
                        value={salaryMin}
                        onChange={handleSalaryMinChange}
                      />
                    </div>
                    <div className="col-span-5">
                      <Input
                        type="number"
                        placeholder="До"
                        value={salaryMax}
                        onChange={handleSalaryMaxChange}
                      />
                    </div>
                    <div className="col-span-2">
                      <Select value={currency} onValueChange={handleCurrencyChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="₽" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((curr) => (
                            <SelectItem key={curr.value} value={curr.value}>
                              {curr.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание вакансии</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Опишите требования, обязанности и условия работы"
                    className="min-h-[200px]"
                  />
                </div>

                {/*<div className="space-y-2">*/}
                {/*  <Label htmlFor="skills">Требуемые навыки</Label>*/}
                {/*  <Textarea*/}
                {/*    id="skills"*/}
                {/*    value={skills}*/}
                {/*    onChange={handleSkillsChange}*/}
                {/*    placeholder="Перечислите необходимые навыки и технологии"*/}
                {/*    className="min-h-[100px]"*/}
                {/*  />*/}
                {/*  <p className="text-xs text-muted-foreground">*/}
                {/*    Укажите ключевые навыки и технологии, необходимые для этой позиции. Каждый*/}
                {/*    навык с новой строки.*/}
                {/*  </p>*/}
                {/*</div>*/}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить изменения"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
