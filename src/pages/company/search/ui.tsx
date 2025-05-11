import { useUnit } from "effector-react";
import { ChevronUp, Filter, MessageSquare, MoreVertical, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  $city,
  $employmentTypes,
  $experience,
  $pending,
  $resumeList,
  $salaryMax,
  $salaryMin,
  $searchQuery,
  $skills,
  cityChanged,
  openResumeClicked,
  resetFilters,
  searchChanged,
  skillsChanged,
} from "@/pages/company/search/model.ts";

import { InviteToChatModal, openModal, setFormMeta } from "@/features/chat/invite";

import { IResume } from "@/shared/types/resume.interface.ts";
import { UserRole } from "@/shared/types/user.interface.ts";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label.tsx";
import { Skeleton } from "@/shared/ui/skeleton";
import { $viewer } from "@/shared/viewer";

// Компонент карточки соискателя
const ResumeCard = ({ resume }: { resume: IResume; onToggleFavorite: (id: number) => void }) => {
  const handleOpenResumeClick = useUnit(openResumeClicked);

  const viewer = useUnit($viewer);
  const companyId = viewer?.company?._id ?? "";

  return (
    <Card key={resume._id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {/* Видео превью (2/3 карточки) */}
        <div className="aspect-video bg-muted relative">
          {/* Здесь будет видео */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground"></div>

          {/* Кнопка избранного */}
          {/*<Button*/}
          {/*  variant="ghost"*/}
          {/*  size="icon"*/}
          {/*  className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"*/}
          {/*  onClick={(e) => {*/}
          {/*    e.stopPropagation();*/}
          {/*    onToggleFavorite(resume._id);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {resume.isFavorite ? (*/}
          {/*    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />*/}
          {/*  ) : (*/}
          {/*    <StarOff className="h-5 w-5" />*/}
          {/*  )}*/}
          {/*</Button>*/}
        </div>

        {/* Аватар по центру */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
          <div className="rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
            <img
              src={resume?.photo}
              alt={resume.fullName.firstName}
              className="h-20 w-20 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Информация о соискателе */}
      <CardContent className="pt-12 pb-4 px-4 text-center">
        {/*  /!* Статус *!/*/}
        {/*  <div className="mb-2">*/}
        {/*    <span*/}
        {/*      className={`*/}
        {/*      inline-block px-3 py-1 rounded-full text-xs font-medium*/}
        {/*      ${*/}
        {/*        resume.status === JobseekerStatus.ActiveSearch*/}
        {/*          ? "bg-green-100 text-green-800"*/}
        {/*          : resume.status === JobseekerStatus.OpenToOffers*/}
        {/*            ? "bg-blue-100 text-blue-800"*/}
        {/*            : resume.status === JobseekerStatus.Considering*/}
        {/*              ? "bg-yellow-100 text-yellow-800"*/}
        {/*              : "bg-gray-100 text-gray-800"*/}
        {/*      }*/}
        {/*    `}*/}
        {/*    >*/}
        {/*      {resume.status}*/}
        {/*    </span>*/}
        {/*  </div>*/}

        {/* Имя и должность */}
        <h3 className="font-semibold text-lg">
          <pre>{resume.fullName.firstName}</pre>
        </h3>
        <p className="text-muted-foreground mb-3">{resume.position}</p>

        {/* Теги с информацией */}
        {/*<div className="flex flex-wrap justify-center gap-1 mb-4">*/}
        {/*  {resume.income?.amount && (*/}
        {/*    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">*/}
        {/*      от {resume.income.amount} {resume.income.currency || "₽"}*/}
        {/*    </span>*/}
        {/*  )}*/}
        {/*  {resume.city && (*/}
        {/*    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded flex items-center">*/}
        {/*      <MapPin className="h-3 w-3 mr-1" />*/}
        {/*      {resume.city}*/}
        {/*    </span>*/}
        {/*  )}*/}
        {/*  {resume?.skills?.slice(0, 2).map((skill, index) => (*/}
        {/*    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">*/}
        {/*      {skill}*/}
        {/*    </span>*/}
        {/*  ))}*/}
        {/*  {resume?.skills?.length > 2 && (*/}
        {/*    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">*/}
        {/*      +{resume?.skills?.length - 2}*/}
        {/*    </span>*/}
        {/*  )}*/}
        {/*</div>*/}

        {/* Контекстное меню */}
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Действия
                <MoreVertical className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem onClick={() => handleOpenResumeClick({ resumeId: resume._id })}>
                <User className="mr-2 h-4 w-4" />
                <span>Отрыкть резюме</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setFormMeta({
                    companyId,
                    jobseekerId: resume.jobseekerId,
                    initiator: UserRole.Company,
                    resumeId: resume._id,
                  });

                  openModal();
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Пригласить в чат</span>
              </DropdownMenuItem>
              {/*<DropdownMenuItem onClick={() => onToggleFavorite(resume._id)}>*/}
              {/*  {resume.isFavorite ? (*/}
              {/*    <>*/}
              {/*      <Star className="mr-2 h-4 w-4 text-yellow-500 fill-yellow-500" />*/}
              {/*      <span>Удалить из закладок</span>*/}
              {/*    </>*/}
              {/*  ) : (*/}
              {/*    <>*/}
              {/*      <StarOff className="mr-2 h-4 w-4" />*/}
              {/*      <span>Добавить в закладки</span>*/}
              {/*    </>*/}
              {/*  )}*/}
              {/*</DropdownMenuItem>*/}
              {/*<DropdownMenuItem>*/}
              {/*  <Send className="mr-2 h-4 w-4" />*/}
              {/*  <span>Отправить вакансию</span>*/}
              {/*</DropdownMenuItem>*/}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

// Компонент для отображения пустого состояния
const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="rounded-full bg-gray-100 p-4 mb-4">
      <Search className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold mb-2">Соискатели не найдены</h3>
    <p className="text-muted-foreground max-w-md">
      Попробуйте изменить параметры поиска или сбросить фильтры
    </p>
    <Button variant="outline" className="mt-4" onClick={onReset}>
      Сбросить все фильтры
    </Button>
  </div>
);

// Компонент для отображения состояния загрузки
const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array(6)
      .fill(0)
      .map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="aspect-video" />
          <CardContent className="pt-12 pb-4 px-4 text-center">
            <div className="flex justify-center mb-4">
              <Skeleton className="h-20 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24 mx-auto mb-2" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto mb-2" />
            <div className="flex justify-center gap-2 mb-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-8 w-24 mx-auto" />
          </CardContent>
        </Card>
      ))}
  </div>
);

// Компонент фильтров для десктопа
// Компонент фильтров для десктопа
const DesktopFilters = () => {
  const [city, experience, employmentTypes, salaryMin, salaryMax, skills] = useUnit([
    $city,
    $experience,
    $employmentTypes,
    $salaryMin,
    $salaryMax,
    $skills,
  ]);

  const [handleCityChange, handleSkillsChange, handleResetFilters] = useUnit([
    cityChanged,
    skillsChanged,
    resetFilters,
  ]);

  // Подсчет активных фильтров
  const activeFiltersCount = [
    city,
    experience,
    employmentTypes.length > 0,
    salaryMin !== null,
    salaryMax !== null,
    skills,
  ].filter(Boolean).length;

  // Состояние для валюты
  return (
    <Card className="sticky top-4">
      <CardContent className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Фильтры
          </h3>
          {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
        </div>

        {/* Фильтр "только закладки" */}
        {/*<div className="flex items-center space-x-2">*/}
        {/*  <Checkbox*/}
        {/*    id="favorites-desktop"*/}
        {/*    checked={onlyFavorites}*/}
        {/*    onCheckedChange={(checked) => setOnlyFavorites(!!checked)}*/}
        {/*  />*/}
        {/*  <Label htmlFor="favorites-desktop">Только закладки</Label>*/}
        {/*</div>*/}

        {/* Фильтр по региону */}
        <div className="space-y-2">
          <Label htmlFor="city-desktop">Город</Label>
          <Input
            id="city-desktop"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            placeholder="Введите город"
          />
        </div>

        {/* Фильтр по зарплате */}
        {/*<div className="space-y-2">*/}
        {/*  <Label>Зарплата</Label>*/}
        {/*  <div className="grid grid-cols-8 gap-2">*/}
        {/*    <Input*/}
        {/*      type="number"*/}
        {/*      placeholder="От"*/}
        {/*      value={salaryMin === null ? "" : salaryMin}*/}
        {/*      onChange={(e) =>*/}
        {/*        handleSalaryMinChange(e.target.value ? Number(e.target.value) : null)*/}
        {/*      }*/}
        {/*      className="col-span-3"*/}
        {/*    />*/}
        {/*    <Input*/}
        {/*      type="number"*/}
        {/*      placeholder="До"*/}
        {/*      value={salaryMax === null ? "" : salaryMax}*/}
        {/*      onChange={(e) =>*/}
        {/*        handleSalaryMaxChange(e.target.value ? Number(e.target.value) : null)*/}
        {/*      }*/}
        {/*      className="col-span-3"*/}
        {/*    />*/}
        {/*    <Select value={currency} onValueChange={(value) => setCurrency(value)}>*/}
        {/*      <SelectTrigger className="col-span-2 w-full">*/}
        {/*        <SelectValue placeholder="₽" />*/}
        {/*      </SelectTrigger>*/}
        {/*      <SelectContent>*/}
        {/*        <SelectItem value="rub">₽</SelectItem>*/}
        {/*        <SelectItem value="usd">$</SelectItem>*/}
        {/*        <SelectItem value="eur">€</SelectItem>*/}
        {/*      </SelectContent>*/}
        {/*    </Select>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Фильтр по типу занятости */}
        {/*<div className="space-y-2">*/}
        {/*  <Label>Тип занятости</Label>*/}
        {/*  <div className="space-y-2">*/}
        {/*    {Object.values(EmploymentType).map((type) => (*/}
        {/*      <div key={type} className="flex items-center space-x-2">*/}
        {/*        <Checkbox*/}
        {/*          id={`employment-${type}`}*/}
        {/*          checked={employmentTypes.includes(type)}*/}
        {/*          onCheckedChange={(checked) => {*/}
        {/*            if (checked) {*/}
        {/*              handleEmploymentTypesChange([...employmentTypes, type]);*/}
        {/*            } else {*/}
        {/*              handleEmploymentTypesChange(employmentTypes.filter((t) => t !== type));*/}
        {/*            }*/}
        {/*          }}*/}
        {/*        />*/}
        {/*        <Label htmlFor={`employment-${type}`}>{type}</Label>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Фильтр по статусу */}
        {/*<div className="space-y-2">*/}
        {/*  <Label>Статус соискателя</Label>*/}
        {/*  <RadioGroup*/}
        {/*    value={selectedStatus || ""}*/}
        {/*    onValueChange={(value) => setSelectedStatus(value ? (value as JobseekerStatus) : null)}*/}
        {/*  >*/}
        {/*    {Object.values(JobseekerStatus).map((status) => (*/}
        {/*      <div key={status} className="flex items-center space-x-2">*/}
        {/*        <RadioGroupItem value={status} id={`status-${status}`} />*/}
        {/*        <Label htmlFor={`status-${status}`}>{status}</Label>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*    <div className="flex items-center space-x-2">*/}
        {/*      <RadioGroupItem value="" id="status-all" />*/}
        {/*      <Label htmlFor="status-all">Все статусы</Label>*/}
        {/*    </div>*/}
        {/*  </RadioGroup>*/}
        {/*</div>*/}

        {/* Фильтр по периоду */}
        {/*<div className="space-y-2">*/}
        {/*  <Label>Период размещения</Label>*/}
        {/*  <RadioGroup*/}
        {/*    value={selectedPeriod}*/}
        {/*    onValueChange={(value) => setSelectedPeriod(value as PostingPeriod)}*/}
        {/*  >*/}
        {/*    {Object.values(PostingPeriod).map((period) => (*/}
        {/*      <div key={period} className="flex items-center space-x-2">*/}
        {/*        <RadioGroupItem value={period} id={`period-${period}`} />*/}
        {/*        <Label htmlFor={`period-${period}`}>{period}</Label>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </RadioGroup>*/}
        {/*</div>*/}

        {/* Фильтр по навыкам */}
        <div className="space-y-2">
          <Label htmlFor="skills-desktop">Навыки</Label>
          <Input
            id="skills-desktop"
            value={skills}
            onChange={(e) => handleSkillsChange(e.target.value)}
            placeholder="Введите навыки через запятую"
          />
        </div>

        {/* Кнопка сброса фильтров */}
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={handleResetFilters} className="w-full">
            Сбросить фильтры
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const CompanySearchPage = () => {
  const [
    resumeList,
    pending,
    searchQuery,
    city,
    experience,
    employmentTypes,
    salaryMin,
    salaryMax,
    skills,
  ] = useUnit([
    $resumeList,
    $pending,
    $searchQuery,
    $city,
    $experience,
    $employmentTypes,
    $salaryMin,
    $salaryMax,
    $skills,
  ]);

  const viewer = useUnit($viewer);

  const vacancyList = viewer?.company?.vacancies ?? [];

  const [handleSearchChange, handleResetFilters] = useUnit([searchChanged, resetFilters]);

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Подсчет активных фильтров
  const activeFiltersCount = [
    city,
    experience,
    employmentTypes.length > 0,
    salaryMin !== null,
    salaryMax !== null,
    skills,
  ].filter(Boolean).length;

  // Функция для добавления/удаления из избранного
  const toggleFavorite = (resumeId: number) => {
    // Здесь будет логика добавления/удаления из избранного
    console.log("Toggle favorite for resume ID:", resumeId);
  };

  // Обработчик прокрутки для отображения/скрытия кнопки "к началу страницы"
  useEffect(() => {
    const handleScroll = () => {
      // Показываем кнопку, когда прокрутка больше 300px
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Функция для прокрутки к началу страницы
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="container mx-auto py-6 px-4">
        {/* Заголовок и поисковая строка */}
        <div className="flex flex-col items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Поиск соискателей</h1>

          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени или должности"
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => handleSearchChange("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Кнопка фильтров для мобильных */}
          <div className="md:hidden">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Фильтры</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Фильтры для десктопа */}
          <div className="hidden lg:block">
            <DesktopFilters />
          </div>

          {/* Список соискателей */}
          <div className="lg:col-span-3">
            {pending ? (
              <LoadingState />
            ) : resumeList.length === 0 ? (
              <EmptyState onReset={handleResetFilters} />
            ) : (
              <>
                {/* Информация о результатах */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">
                    Найдено резюме: <strong>{resumeList.length}</strong>
                  </p>

                  {/* Сортировка (можно реализовать в будущем) */}
                  {/* <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters({ ...filters, sortBy: value as any })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Сортировка" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">По релевантности</SelectItem>
                      <SelectItem value="date">По дате</SelectItem>
                      <SelectItem value="salary">По зарплате</SelectItem>
                    </SelectContent>
                  </Select> */}
                </div>

                {/* Сетка с карточками соискателей */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resumeList.map((resume) => (
                    <ResumeCard
                      key={resume._id}
                      resume={resume}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <InviteToChatModal role={UserRole.Company} vacancies={vacancyList} />

      {/* Кнопка "к началу страницы" */}
      {showScrollToTop && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-md z-50"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};
