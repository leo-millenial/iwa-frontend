import { useUnit } from "effector-react";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { DeleteVacancyDialog, deleteVacancyClicked } from "@/features/vacancy-delete";

import { EmploymentType, Experience, ISalary } from "@/shared/types/vacancy.interface.ts";
import { Badge } from "@/shared/ui/badge.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu.tsx";
import { Skeleton } from "@/shared/ui/skeleton.tsx";

import { $vacancy, editClicked } from "./model";

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
  const vacancy = useUnit($vacancy);
  const [handleEditClick, handleVacancyDelete] = useUnit([editClicked, deleteVacancyClicked]);

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
  const formatDate = (dateString?: Date) => {
    if (!dateString) return "Не указано";

    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Если данные еще не загружены, показываем скелетон
  if (!vacancy) {
    return (
      <LayoutCompany>
        <div className="flex justify-center items-start py-8 px-4">
          <div className="w-full max-w-3xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>
            <Card className="mb-6">
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutCompany>
    );
  }

  return (
    <LayoutCompany>
      <div className="flex justify-center items-start py-8 px-4">
        <div className="w-full max-w-3xl">
          {/* Заголовок и действия */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">{vacancy.title}</h1>
              {vacancy.createdAt && (
                <p className="text-muted-foreground mt-1">
                  Опубликовано: {formatDate(vacancy.createdAt)}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleEditClick()} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      handleVacancyDelete({ companyId: vacancy?.companyId, id: vacancy._id })
                    }
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

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

              {vacancy.brands && vacancy.brands.length > 0 && (
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Технологии</h3>
                  <div className="flex flex-wrap gap-2">
                    {vacancy.brands.map((brand) => (
                      <Badge key={brand} variant="secondary">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
        </div>
      </div>

      <DeleteVacancyDialog />
    </LayoutCompany>
  );
};
