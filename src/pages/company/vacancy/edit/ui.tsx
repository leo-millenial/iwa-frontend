import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

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
  currency: string | number;
}

interface IVacancy {
  id: string;
  title: string;
  description: string;
  salary: ISalary;
  city: string;
  experience: Experience;
  employmentTypes: EmploymentType[];
  createdAt: string;
  updatedAt: string;
  responses: number;
  views: number;
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

export const CompanyVacancyEditPage = () => {
  // Состояния для формы
  const [formData, setFormData] = useState<Partial<IVacancy>>({});
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Эффект для загрузки данных вакансии
  useEffect(() => {
    const fetchVacancy = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // В реальном приложении здесь будет запрос к API
        // Для примера используем моковые данные
        const mockVacancy: IVacancy = {
          id: "1",
          title: "Frontend-разработчик (React)",
          description: `Мы ищем опытного Frontend-разработчика для работы над нашими продуктами.

**Обязанности:**
- Разработка пользовательских интерфейсов с использованием React
- Работа с API и интеграция с бэкендом
- Оптимизация производительности приложений
- Участие в код-ревью и улучшении кодовой базы

**Требования:**
- Опыт коммерческой разработки от 2 лет
- Глубокое знание JavaScript, TypeScript, React
- Понимание принципов отзывчивого дизайна
- Опыт работы с системами контроля версий (Git)

**Условия:**
- Гибкий график работы
- Возможность удаленной работы
- Конкурентная заработная плата
- Дружный коллектив профессионалов

**Навыки:**
React, TypeScript, JavaScript, HTML, CSS, Redux, REST API, Git`,
          salary: {
            amount: {
              min: 150000,
              max: 250000,
            },
            currency: "RUB",
          },
          city: "Москва",
          experience: Experience.Middle,
          employmentTypes: [EmploymentType.FullTime, EmploymentType.Remote],
          createdAt: "2023-07-15T10:00:00Z",
          updatedAt: "2023-07-15T10:00:00Z",
          responses: 12,
          views: 145,
        };

        // Разделяем описание и навыки
        const descriptionParts = mockVacancy.description.split("**Навыки:**");
        const mainDescription = descriptionParts[0].trim();
        const skillsText = descriptionParts.length > 1 ? descriptionParts[1].trim() : "";

        setFormData(mockVacancy);
        setDescription(mainDescription);
        setSkills(skillsText);

        setTimeout(() => {
          setIsLoading(false);
        }, 500); // Имитация задержки загрузки
      } catch (err) {
        setError("Не удалось загрузить данные вакансии");
        setIsLoading(false);
      }
    };

    fetchVacancy();
  }, []);

  // Обработчики изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      const currentTypes = prev.employmentTypes || [];
      const updatedTypes = currentTypes.includes(type)
        ? currentTypes.filter((t) => t !== type)
        : [...currentTypes, type];

      return {
        ...prev,
        employmentTypes: updatedTypes,
      };
    });
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

  // Обновление полного описания при отправке формы
  const updateDescription = () => {
    const fullDescription = [description, skills && `**Навыки:**\n${skills}`]
      .filter(Boolean)
      .join("\n\n");

    setFormData((prev) => ({
      ...prev,
      description: fullDescription,
    }));

    return fullDescription;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullDescription = updateDescription();

    setIsSaving(true);
    setError(null);

    try {
      // В реальном приложении здесь будет запрос к API для сохранения данных
      const updatedVacancy = {
        ...formData,
        description: fullDescription,
        updatedAt: new Date().toISOString(),
      };

      console.log("Сохранение данных:", updatedVacancy);

      // Имитация задержки сохранения
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSaving(false);
      // В реальном приложении здесь будет редирект на страницу просмотра вакансии
    } catch (err) {
      setError("Не удалось сохранить изменения");
      setIsSaving(false);
    }
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) {
    return (
      <LayoutCompany>
        <div className="flex justify-center items-center h-full py-20">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Загрузка данных вакансии...</p>
          </div>
        </div>
      </LayoutCompany>
    );
  }

  return (
    <LayoutCompany>
      <div className="flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-3xl bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold">Редактирование вакансии</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

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
                      value={formData.title || ""}
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
                      value={formData.city || ""}
                      onChange={handleInputChange}
                      placeholder="Например: Москва"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Требуемый опыт</Label>
                    <Select
                      value={formData.experience || ""}
                      onValueChange={handleExperienceChange}
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

                  <div className="space-y-2">
                    <Label>Формат работы</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {Object.entries(employmentTypeLabels).map(([type, label]) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`employment-${type}`}
                            checked={
                              formData.employmentTypes?.includes(type as EmploymentType) || false
                            }
                            onCheckedChange={() =>
                              handleEmploymentTypeToggle(type as EmploymentType)
                            }
                          />
                          <Label htmlFor={`employment-${type}`} className="cursor-pointer">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Заработная плата</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="salary-min" className="text-xs">
                          От
                        </Label>
                        <Input
                          id="salary-min"
                          type="number"
                          value={formData.salary?.amount.min || ""}
                          onChange={(e) => handleSalaryChange("min", e.target.value)}
                          placeholder="Минимальная сумма"
                        />
                      </div>
                      <div>
                        <Label htmlFor="salary-max" className="text-xs">
                          До
                        </Label>
                        <Input
                          id="salary-max"
                          type="number"
                          value={formData.salary?.amount.max || ""}
                          onChange={(e) => handleSalaryChange("max", e.target.value)}
                          placeholder="Максимальная сумма"
                        />
                      </div>
                      <div>
                        <Label htmlFor="salary-currency" className="text-xs">
                          Валюта
                        </Label>
                        <Select
                          value={(formData.salary?.currency as string) || "RUB"}
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
                      className="min-h-[200px]"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Используйте **текст** для выделения заголовков разделов
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Требуемые навыки</Label>
                    <Textarea
                      id="skills"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Например: React, TypeScript, JavaScript, HTML, CSS"
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Перечислите навыки через запятую
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Кнопки действий */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (window.confirm("Вы уверены, что хотите удалить эту вакансию?")) {
                    // В реальном приложении здесь будет запрос к API для удаления
                    console.log("Удаление вакансии с ID:", formData.id);
                    // После успешного удаления - редирект на страницу со списком вакансий
                  }
                }}
              >
                Удалить вакансию
              </Button>

              <div className="flex space-x-4">
                <Button type="button" variant="outline">
                  Отмена
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Сохранить изменения
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </LayoutCompany>
  );
};
