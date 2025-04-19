import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { Button } from "@/shared/ui/button.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs.tsx";

type TabType = "active" | "drafts" | "archive" | "templates";

export const CompanyVacanciesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("active");

  // Здесь будут данные о вакансиях, пока используем пустые массивы
  const vacancies = {
    active: [],
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

  // Компонент для отображения таблицы вакансий (заглушка)
  const VacanciesTable = ({ data }: { data: any[] }) => {
    if (data.length === 0) {
      return (
        <div className="flex flex-col flex-1">
          <EmptyState />
        </div>
      );
    }

    return (
      <div className="border rounded-md p-4">
        <p>Здесь будет таблица с вакансиями</p>
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
