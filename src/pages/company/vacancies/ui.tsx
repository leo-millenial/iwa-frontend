import { PlusCircle } from "lucide-react";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { Badge } from "@/shared/ui/badge.tsx";
import { Button } from "@/shared/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs.tsx";

type TabType = "active" | "drafts" | "archive" | "templates";

// Интерфейс для данных вакансии
interface Vacancy {
  id: string;
  title: string;
  city: string;
  additionalInfo: {
    responses: number;
    views: number;
    publishDate: string;
  };
  salary: {
    from?: number;
    to?: number;
    currency: string;
  };
}

export const CompanyVacanciesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("active");

  // Моковые данные для вакансий
  const vacancies = {
    active: [
      {
        id: "1",
        title: "Frontend-разработчик (React)",
        city: "Москва",
        additionalInfo: {
          responses: 12,
          views: 145,
          publishDate: "15.06.2023",
        },
        salary: {
          from: 150000,
          to: 250000,
          currency: "₽",
        },
      },
      {
        id: "2",
        title: "UX/UI дизайнер",
        city: "Санкт-Петербург",
        additionalInfo: {
          responses: 8,
          views: 98,
          publishDate: "20.06.2023",
        },
        salary: {
          from: 120000,
          to: 180000,
          currency: "₽",
        },
      },
      {
        id: "3",
        title: "Product Manager",
        city: "Удаленно",
        additionalInfo: {
          responses: 5,
          views: 76,
          publishDate: "22.06.2023",
        },
        salary: {
          from: 200000,
          currency: "₽",
        },
      },
    ],
    drafts: [],
    archive: [],
    templates: [],
  };

  // Компонент для отображения пустого состояния
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="text-center max-w-md space-y-4">
        <h3 className="text-xl font-semibold">Найдите идеального сотрудника</h3>
        <p className="text-muted-foreground">создайте вакансию – не упустите хороших кандидатов</p>
        <Button className="mt-4" size="lg">
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить вакансию
        </Button>
      </div>
    </div>
  );

  // Компонент для отображения таблицы вакансий
  const VacanciesTable = ({ data }: { data: Vacancy[] }) => {
    if (data.length === 0) {
      return (
        <div className="flex flex-col flex-1">
          <EmptyState />
        </div>
      );
    }

    // Форматирование зарплаты
    const formatSalary = (salary: Vacancy["salary"]) => {
      if (salary.from && salary.to) {
        return `${salary.from.toLocaleString()} - ${salary.to.toLocaleString()} ${salary.currency}`;
      } else if (salary.from) {
        return `от ${salary.from.toLocaleString()} ${salary.currency}`;
      } else if (salary.to) {
        return `до ${salary.to.toLocaleString()} ${salary.currency}`;
      }
      return "По договоренности";
    };

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Название вакансии</TableHead>
              <TableHead>Город</TableHead>
              <TableHead>Дополнительная информация</TableHead>
              <TableHead>Заработная плата</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((vacancy) => (
              <TableRow key={vacancy.id}>
                <TableCell className="font-medium">{vacancy.title}</TableCell>
                <TableCell>{vacancy.city}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {vacancy.additionalInfo.responses} откликов
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {vacancy.additionalInfo.views} просмотров
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Опубликовано: {vacancy.additionalInfo.publishDate}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatSalary(vacancy.salary)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Просмотреть</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Редактировать</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Удалить</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <LayoutCompany>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Вакансии</h1>
        </div>

        <Tabs
          defaultValue="active"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="flex flex-col flex-1"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="drafts">Черновики</TabsTrigger>
            <TabsTrigger value="archive">Архив</TabsTrigger>
            <TabsTrigger value="templates">Шаблоны</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden flex flex-col">
            <TabsContent value="active" className="flex flex-col flex-1 overflow-auto mt-0">
              <VacanciesTable data={vacancies.active} />
            </TabsContent>

            <TabsContent value="drafts" className="flex flex-col flex-1 overflow-auto mt-0">
              <VacanciesTable data={vacancies.drafts} />
            </TabsContent>

            <TabsContent value="archive" className="flex flex-col flex-1 overflow-auto mt-0">
              <VacanciesTable data={vacancies.archive} />
            </TabsContent>

            <TabsContent value="templates" className="flex flex-col flex-1 overflow-auto mt-0">
              <VacanciesTable data={vacancies.templates} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </LayoutCompany>
  );
};
