import { useState } from "react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

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

// Перечисления для типов занятости и опыта
enum EmploymentType {
  FullTime = "FullTime",
  PartTime = "PartTime",
  Remote = "Remote",
  Office = "Office",
  Hybrid = "Hybrid",
}

enum Experience {
  Intern = "Intern",
  Junior = "Junior",
  Middle = "Middle",
  Senior = "Senior",
  Manager = "Manager",
  Director = "Director",
}

// Интерфейсы для данных вакансии
interface ISalary {
  amount: {
    min: number;
    max: number;
  };
  currency: string | number; // ISO 4217 (RUB or 643)
}

interface IVacancy {
  title: string;
  description: string;
  salary: ISalary;
  city: string;
  experience: Experience;
  employmentTypes: EmploymentType[];
}

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
  // Состояние формы
  const [formData, setFormData] = useState<Partial<IVacancy>>({
    title: "",
    description: "",
    salary: {
      amount: {
        min: 0,
        max: 0,
      },
      currency: "RUB",
    },
    city: "",
    experience: Experience.Middle,
    employmentTypes: [],
  });

  // Состояние для описания и навыков
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  // Обработчики изменения полей
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalaryChange = (field: "min" | "max", value: string) => {
    const numValue = value === "" ? 0 : parseInt(value, 10);
    setFormData((prev) => ({
      ...prev,
      salary: {
        ...prev.salary!,
        amount: {
          ...prev.salary!.amount,
          [field]: numValue,
        },
      },
    }));
  };

  const handleCurrencyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      salary: {
        ...prev.salary!,
        currency: value,
      },
    }));
  };

  const handleExperienceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      experience: value as Experience,
    }));
  };

  const handleEmploymentTypeToggle = (type: EmploymentType) => {
    setFormData((prev) => {
      const types = prev.employmentTypes || [];
      if (types.includes(type)) {
        return {
          ...prev,
          employmentTypes: types.filter((t) => t !== type),
        };
      } else {
        return {
          ...prev,
          employmentTypes: [...types, type],
        };
      }
    });
  };

  // Обновление полного описания при отправке формы
  const updateDescription = () => {
    const fullDescription = [description, skills && `**Навыки:**\n${skills}`]
      .filter(Boolean)
      .join("\n\n");

    setFormData((prev) => ({
      ...prev,
      description: fullDescription,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDescription();

    // Здесь будет логика отправки данных на сервер
    console.log("Отправка данных:", formData);
  };

  return (
    <LayoutCompany>
      <div className="flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-3xl bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Новая вакансия</h1>

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
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Например: Frontend-разработчик (React)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Город</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Например: Москва"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Требуемый опыт</Label>
                    <Select value={formData.experience} onValueChange={handleExperienceChange}>
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
                          checked={formData.employmentTypes?.includes(value as EmploymentType)}
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

            {/* Описание вакансии */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание вакансии</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
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
                        value={formData.salary?.amount.min || ""}
                        onChange={(e) => handleSalaryChange("min", e.target.value)}
                        placeholder="Минимальная сумма"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary-max">До</Label>
                      <Input
                        id="salary-max"
                        type="number"
                        value={formData.salary?.amount.max || ""}
                        onChange={(e) => handleSalaryChange("max", e.target.value)}
                        placeholder="Максимальная сумма"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary-currency">Валюта</Label>
                      <Select
                        value={formData.salary?.currency as string}
                        onValueChange={handleCurrencyChange}
                      >
                        <SelectTrigger id="salary-currency">
                          <SelectValue placeholder="Выберите валюту" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
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
              <Button type="submit">Создать вакансию</Button>
            </div>
          </form>
        </div>
      </div>
    </LayoutCompany>
  );
};
