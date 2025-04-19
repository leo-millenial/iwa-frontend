import { Edit, Trash2, Users } from "lucide-react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { Badge } from "@/shared/ui/badge.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card.tsx";

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

const currencySymbols: Record<string, string> = {
  RUB: "₽",
  USD: "$",
  EUR: "€",
};

export const CompanyVacancyViewPage = () => {
  // Моковые данные для примера
  const vacancy: IVacancy = {
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

  // Форматирование зарплаты
  const formatSalary = (salary: ISalary) => {
    const { amount, currency } = salary;
    const currencySymbol = currencySymbols[currency as string] || currency;

    if (amount.min > 0 && amount.max > 0) {
      return `${amount.min.toLocaleString()} - ${amount.max.toLocaleString()} ${currencySymbol}`;
    } else if (amount.min > 0) {
      return `от ${amount.min.toLocaleString()} ${currencySymbol}`;
    } else if (amount.max > 0) {
      return `до ${amount.max.toLocaleString()} ${currencySymbol}`;
    }

    return "По договоренности";
  };

  // Форматирование описания с поддержкой разметки
  const formatDescription = (description: string) => {
    // Разбиваем текст на абзацы
    const paragraphs = description.split("\n\n");

    return paragraphs.map((paragraph, index) => {
      // Проверяем, является ли абзац заголовком (выделен жирным)
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        const title = paragraph.slice(2, -2);
        return (
          <h3 key={index} className="font-bold text-lg mt-4 mb-2">
            {title}
          </h3>
        );
      }

      // Обычный абзац или список
      return (
        <p key={index} className="my-2 whitespace-pre-line">
          {paragraph}
        </p>
      );
    });
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <LayoutCompany>
      <div className="flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-3xl">
          {/* Заголовок и действия */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">{vacancy.title}</h1>
              <p className="text-muted-foreground mt-1">
                Опубликовано: {formatDate(vacancy.createdAt)}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            </div>
          </div>

          {/* Статистика */}
          <Card className="mb-6">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  <strong>{vacancy.responses}</strong> откликов
                </span>
              </div>
              <div className="text-sm">
                <strong>{vacancy.views}</strong> просмотров
              </div>
            </CardContent>
          </Card>

          {/* Основная информация */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Город</h3>
                <p>{vacancy.city}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Требуемый опыт</h3>
                <p>{experienceLabels[vacancy.experience]}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Формат работы</h3>
                <div className="flex flex-wrap gap-2">
                  {vacancy.employmentTypes.map((type) => (
                    <Badge key={type} variant="outline">
                      {employmentTypeLabels[type]}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Оплата</h3>
                <p className="font-medium">{formatSalary(vacancy.salary)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Описание вакансии */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Описание вакансии</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {formatDescription(vacancy.description)}
              </div>
            </CardContent>
          </Card>

          {/* Отклики на вакансию */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Отклики ({vacancy.responses})</CardTitle>
              <Button variant="outline" size="sm">
                Смотреть все
              </Button>
            </CardHeader>
            <CardContent>
              {vacancy.responses > 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Здесь будет список откликов на вакансию</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Пока нет откликов на эту вакансию</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutCompany>
  );
};
