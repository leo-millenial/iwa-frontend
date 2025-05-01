import { useUnit } from "effector-react";
import { PlusCircle } from "lucide-react";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { EmploymentType, ISalary, IVacancy } from "@/shared/types/vacancy.interface.ts";
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

import { $error, $pending, $vacancies, editVacancyClicked, viewVacancyClicked } from "./model.ts";

type TabType = "active" | "drafts" | "archive" | "templates";

export const CompanyVacanciesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("active");

  const { vacancies, error, isPending } = useUnit({
    vacancies: $vacancies,
    error: $error,
    isPending: $pending,
  });

  const [handleViewVacancyClick, handleEditVacancyClick] = useUnit([
    viewVacancyClicked,
    editVacancyClicked,
  ]);

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
  const VacanciesTable = () => {
    if (isPending) {
      return <div>Загрузка...</div>;
    }

    if (error) {
      return <div>Ошибка: {error}</div>;
    }

    if (!vacancies || vacancies.length === 0) {
      return <EmptyState />;
    }

    // Форматирование зарплаты
    const formatSalary = (salary: ISalary) => {
      const { amount, currency } = salary;
      if (amount.min && amount.max) {
        return `${amount.min.toLocaleString()} - ${amount.max.toLocaleString()} ${currency}`;
      } else if (amount.min) {
        return `от ${amount.min.toLocaleString()} ${currency}`;
      } else if (amount.max) {
        return `до ${amount.max.toLocaleString()} ${currency}`;
      }
      return "По договоренности";
    };

    // Форматирование типов занятости
    const formatEmploymentTypes = (types: EmploymentType[]) => {
      return types.map((type) => {
        switch (type) {
          case EmploymentType.FullTime:
            return "Полная";
          case EmploymentType.PartTime:
            return "Частичная";
          case EmploymentType.Remote:
            return "Удаленная";
          case EmploymentType.Office:
            return "Офис";
          case EmploymentType.Hybrid:
            return "Гибрид";
          default:
            return type;
        }
      });
    };

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Название вакансии</TableHead>
              <TableHead>Город</TableHead>
              <TableHead>Опыт работы</TableHead>
              <TableHead>Тип занятости</TableHead>
              <TableHead>Заработная плата</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacancies.map((vacancy: IVacancy) => (
              <TableRow key={vacancy._id}>
                <TableCell className="font-medium">{vacancy.title}</TableCell>
                <TableCell>{vacancy.city}</TableCell>
                <TableCell>{vacancy.experience}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {formatEmploymentTypes(vacancy.employmentTypes).map((type, index) => (
                      <span
                        key={index}
                        className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                      >
                        {type}
                      </span>
                    ))}
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
                      <DropdownMenuItem
                        onClick={() => handleViewVacancyClick({ vacancyId: vacancy._id })}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Просмотреть</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditVacancyClick({ vacancyId: vacancy._id })}
                      >
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
            {/*<TabsTrigger value="drafts">Черновики</TabsTrigger>*/}
            {/*<TabsTrigger value="archive">Архив</TabsTrigger>*/}
            {/*<TabsTrigger value="templates">Шаблоны</TabsTrigger>*/}
          </TabsList>

          <div className="flex-1 overflow-hidden flex flex-col">
            <TabsContent value="active" className="flex flex-col flex-1 overflow-auto mt-0">
              <VacanciesTable />
            </TabsContent>

            <TabsContent value="drafts" className="flex flex-col flex-1 overflow-auto mt-0">
              <VacanciesTable />
            </TabsContent>

            <TabsContent value="archive" className="flex flex-col flex-1 overflow-auto mt-0">
              <VacanciesTable />
            </TabsContent>

            <TabsContent value="templates" className="flex flex-col flex-1 overflow-auto mt-0">
              <VacanciesTable />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </LayoutCompany>
  );
};
