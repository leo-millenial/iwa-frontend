import {
  Bookmark,
  ChevronUp,
  Filter,
  MapPin,
  MoreVertical,
  Search,
  Send,
  Star,
  StarOff,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/ui/sheet";
import { Skeleton } from "@/shared/ui/skeleton";

// Перечисления для статусов соискателя
enum JobseekerStatus {
  ActiveSearch = "Активный поиск",
  OpenToOffers = "Готов к предложениям",
  NotSearching = "Не ищу работу",
  Considering = "Рассматриваю предложения",
}

// Перечисления для периодов размещения
enum PostingPeriod {
  Day = "За последние 24 часа",
  Week = "За последнюю неделю",
  Month = "За последний месяц",
  ThreeMonths = "За последние 3 месяца",
  All = "За все время",
}

// Интерфейс для соискателя
interface IJobseeker {
  id: number;
  name: string;
  position: string;
  status: JobseekerStatus;
  salary: number;
  age: number;
  city: string;
  skills: string[];
  videoUrl: string;
  avatarUrl: string;
  isFavorite: boolean;
}

// Интерфейс для фильтров
interface IFilters {
  searchQuery: string;
  onlyFavorites: boolean;
  selectedPeriod: PostingPeriod;
  selectedStatus: JobseekerStatus | null;
  salaryRange: { min: string; max: string };
  currency: "rub" | "usd" | "eur";
  sortBy: "relevance" | "date" | "salary";
  city: string;
}

// Моковые данные для примера
const mockJobseekers: IJobseeker[] = [
  {
    id: 1,
    name: "Иванов Иван",
    position: "Frontend-разработчик",
    status: JobseekerStatus.ActiveSearch,
    salary: 150000,
    age: 28,
    city: "Москва",
    skills: ["React", "TypeScript", "JavaScript"],
    videoUrl: "https://example.com/video1.mp4",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    isFavorite: false,
  },
  {
    id: 2,
    name: "Петрова Анна",
    position: "UX/UI дизайнер",
    status: JobseekerStatus.OpenToOffers,
    salary: 120000,
    age: 25,
    city: "Санкт-Петербург",
    skills: ["Figma", "Adobe XD", "Sketch"],
    videoUrl: "https://example.com/video2.mp4",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    isFavorite: true,
  },
  {
    id: 3,
    name: "Сидоров Алексей",
    position: "Backend-разработчик",
    status: JobseekerStatus.Considering,
    salary: 180000,
    age: 32,
    city: "Новосибирск",
    skills: ["Node.js", "Python", "PostgreSQL"],
    videoUrl: "https://example.com/video3.mp4",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    isFavorite: false,
  },
  {
    id: 4,
    name: "Козлова Мария",
    position: "Project Manager",
    status: JobseekerStatus.ActiveSearch,
    salary: 200000,
    age: 30,
    city: "Екатеринбург",
    skills: ["Agile", "Scrum", "Jira"],
    videoUrl: "https://example.com/video4.mp4",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    isFavorite: false,
  },
];

// Компонент карточки соискателя
const JobseekerCard = ({
  jobseeker,
  onToggleFavorite,
}: {
  jobseeker: IJobseeker;
  onToggleFavorite: (id: number) => void;
}) => {
  return (
    <Card key={jobseeker.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {/* Видео превью (2/3 карточки) */}
        <div className="aspect-video bg-muted relative">
          {/* Здесь будет видео */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Видео превью
          </div>

          {/* Кнопка избранного */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(jobseeker.id);
            }}
          >
            {jobseeker.isFavorite ? (
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Аватар по центру */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10">
          <div className="rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
            <img
              src={jobseeker.avatarUrl}
              alt={jobseeker.name}
              className="h-20 w-20 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Информация о соискателе */}
      <CardContent className="pt-12 pb-4 px-4 text-center">
        {/* Статус */}
        <div className="mb-2">
          <span
            className={`
            inline-block px-3 py-1 rounded-full text-xs font-medium
            ${
              jobseeker.status === JobseekerStatus.ActiveSearch
                ? "bg-green-100 text-green-800"
                : jobseeker.status === JobseekerStatus.OpenToOffers
                  ? "bg-blue-100 text-blue-800"
                  : jobseeker.status === JobseekerStatus.Considering
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
            }
          `}
          >
            {jobseeker.status}
          </span>
        </div>

        {/* Имя и должность */}
        <h3 className="font-semibold text-lg">{jobseeker.name}</h3>
        <p className="text-muted-foreground mb-3">{jobseeker.position}</p>

        {/* Теги с информацией */}
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            от {jobseeker.salary.toLocaleString()} ₽
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {jobseeker.age} лет
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {jobseeker.city}
          </span>
          {jobseeker.skills.slice(0, 2).map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
          {jobseeker.skills.length > 2 && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              +{jobseeker.skills.length - 2}
            </span>
          )}
        </div>

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
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Перейти в профиль</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFavorite(jobseeker.id)}>
                <Bookmark className="mr-2 h-4 w-4" />
                <span>{jobseeker.isFavorite ? "Удалить из закладок" : "Добавить в закладки"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                <span>Отправить вакансию</span>
              </DropdownMenuItem>
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
const DesktopFilters = ({
  filters,
  setFilters,
  activeFiltersCount,
  resetFilters,
}: {
  filters: IFilters;
  setFilters: (filters: IFilters) => void;
  activeFiltersCount: number;
  resetFilters: () => void;
}) => (
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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="favorites-desktop"
          checked={filters.onlyFavorites}
          onCheckedChange={(checked) =>
            setFilters({ ...filters, onlyFavorites: checked as boolean })
          }
        />
        <Label htmlFor="favorites-desktop">Только закладки</Label>
      </div>

      {/* Фильтр по региону */}
      <div className="space-y-2">
        <Label htmlFor="city-desktop">Город</Label>
        <Input
          id="city-desktop"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          placeholder="Введите город"
        />
      </div>

      {/* Фильтр по зарплате */}
      <div className="space-y-2">
        <Label>Зарплата</Label>
        <div className="grid grid-cols-8 gap-2">
          <Input
            type="number"
            placeholder="От"
            value={filters.salaryRange.min}
            onChange={(e) =>
              setFilters({
                ...filters,
                salaryRange: { ...filters.salaryRange, min: e.target.value },
              })
            }
            className="col-span-3"
          />
          <Input
            type="number"
            placeholder="До"
            value={filters.salaryRange.max}
            onChange={(e) =>
              setFilters({
                ...filters,
                salaryRange: { ...filters.salaryRange, max: e.target.value },
              })
            }
            className="col-span-3"
          />
          <Select
            value={filters.currency}
            onValueChange={(value) => setFilters({ ...filters, currency: value })}
          >
            <SelectTrigger className="col-span-2 w-full">
              <SelectValue placeholder="₽" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rub">₽</SelectItem>
              <SelectItem value="usd">$</SelectItem>
              <SelectItem value="eur">€</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Фильтр по статусу */}
      <div className="space-y-2">
        <Label>Статус соискателя</Label>
        <RadioGroup
          value={filters.selectedStatus || ""}
          onValueChange={(value) =>
            setFilters({
              ...filters,
              selectedStatus: value ? (value as JobseekerStatus) : null,
            })
          }
        >
          {Object.values(JobseekerStatus).map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <RadioGroupItem value={status} id={`status-${status}`} />
              <Label htmlFor={`status-${status}`}>{status}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="status-all" />
            <Label htmlFor="status-all">Все статусы</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Фильтр по периоду */}
      <div className="space-y-2">
        <Label>Период размещения</Label>
        <RadioGroup
          value={filters.selectedPeriod}
          onValueChange={(value) =>
            setFilters({ ...filters, selectedPeriod: value as PostingPeriod })
          }
        >
          {Object.values(PostingPeriod).map((period) => (
            <div key={period} className="flex items-center space-x-2">
              <RadioGroupItem value={period} id={`period-${period}`} />
              <Label htmlFor={`period-${period}`}>{period}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Кнопка сброса фильтров */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={resetFilters} className="w-full">
          Сбросить фильтры
        </Button>
      )}
    </CardContent>
  </Card>
);

// Компонент фильтров для мобильных устройств
const MobileFilters = ({
  filters,
  setFilters,
  activeFiltersCount,
  resetFilters,
  isOpen,
  setIsOpen,
}: {
  filters: IFilters;
  setFilters: (filters: IFilters) => void;
  activeFiltersCount: number;
  resetFilters: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => (
  <Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetContent side="bottom" className="h-[80vh]">
      <SheetHeader className="mb-4">
        <SheetTitle className="flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Фильтры
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </SheetTitle>
        <SheetDescription>Настройте параметры поиска соискателей</SheetDescription>
      </SheetHeader>

      <ScrollArea className="h-[calc(80vh-120px)] pr-4">
        <div className="space-y-6 pb-8">
          {/* Фильтр "только закладки" */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorites-mobile"
              checked={filters.onlyFavorites}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, onlyFavorites: checked as boolean })
              }
            />
            <Label htmlFor="favorites-mobile">Только закладки</Label>
          </div>

          {/* Фильтр по региону */}
          <div className="space-y-2">
            <Label htmlFor="city-mobile">Город</Label>
            <Input
              id="city-mobile"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              placeholder="Введите город"
            />
          </div>

          {/* Фильтр по зарплате */}
          <div className="space-y-2">
            <Label>Зарплата</Label>
            <div className="grid grid-cols-7 gap-2">
              <Input
                type="number"
                placeholder="От"
                value={filters.salaryRange.min}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    salaryRange: { ...filters.salaryRange, min: e.target.value },
                  })
                }
                className="col-span-3"
              />
              <Input
                type="number"
                placeholder="До"
                value={filters.salaryRange.max}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    salaryRange: { ...filters.salaryRange, max: e.target.value },
                  })
                }
                className="col-span-3"
              />
              <Select
                value={filters.currency}
                onValueChange={(value) => setFilters({ ...filters, currency: value })}
              >
                <SelectTrigger className="col-span-1 w-full">
                  <SelectValue placeholder="₽" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rub">₽</SelectItem>
                  <SelectItem value="usd">$</SelectItem>
                  <SelectItem value="eur">€</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Фильтр по статусу */}
          <div className="space-y-2">
            <Label>Статус соискателя</Label>
            <RadioGroup
              value={filters.selectedStatus || ""}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  selectedStatus: value ? (value as JobseekerStatus) : null,
                })
              }
            >
              {Object.values(JobseekerStatus).map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <RadioGroupItem value={status} id={`status-mobile-${status}`} />
                  <Label htmlFor={`status-mobile-${status}`}>{status}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="status-mobile-all" />
                <Label htmlFor="status-mobile-all">Все статусы</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Фильтр по периоду */}
          <div className="space-y-2">
            <Label>Период размещения</Label>
            <RadioGroup
              value={filters.selectedPeriod}
              onValueChange={(value) =>
                setFilters({ ...filters, selectedPeriod: value as PostingPeriod })
              }
            >
              {Object.values(PostingPeriod).map((period) => (
                <div key={period} className="flex items-center space-x-2">
                  <RadioGroupItem value={period} id={`period-mobile-${period}`} />
                  <Label htmlFor={`period-mobile-${period}`}>{period}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-4">
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={resetFilters} className="flex-1">
            Сбросить
          </Button>
        )}
        <Button onClick={() => setIsOpen(false)} className="flex-1">
          Применить
        </Button>
      </div>
    </SheetContent>
  </Sheet>
);

export const CompanySearchPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [jobseekers, setJobseekers] = useState<IJobseeker[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false); // Состояние для отображения кнопки

  // Состояние фильтров
  const [filters, setFilters] = useState<IFilters>({
    searchQuery: "",
    onlyFavorites: false,
    selectedPeriod: PostingPeriod.All,
    selectedStatus: null,
    salaryRange: { min: "", max: "" },
    currency: "rub",
    sortBy: "relevance",
    city: "",
  });

  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setJobseekers(mockJobseekers);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Обработчик для добавления/удаления из избранного
  const toggleFavorite = (id: number) => {
    setJobseekers(
      jobseekers.map((jobseeker) =>
        jobseeker.id === id ? { ...jobseeker, isFavorite: !jobseeker.isFavorite } : jobseeker,
      ),
    );
  };

  // Сброс всех фильтров
  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      onlyFavorites: false,
      selectedPeriod: PostingPeriod.All,
      selectedStatus: null,
      salaryRange: { min: "", max: "" },
      currency: "rub",
      sortBy: "relevance",
      city: "",
    });
  };

  // Подсчет активных фильтров
  const countActiveFilters = () => {
    let count = 0;
    if (filters.onlyFavorites) count++;
    if (filters.searchQuery) count++;
    if (filters.selectedStatus) count++;
    if (filters.selectedPeriod !== PostingPeriod.All) count++;
    if (filters.salaryRange.min) count++;
    if (filters.salaryRange.max) count++;
    if (filters.city) count++;
    return count;
  };

  const activeFiltersCount = countActiveFilters();

  // Фильтрация соискателей
  const filteredJobseekers = jobseekers.filter((jobseeker) => {
    // Фильтр по избранному
    if (filters.onlyFavorites && !jobseeker.isFavorite) return false;

    // Фильтр по поисковому запросу
    if (
      filters.searchQuery &&
      !jobseeker.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !jobseeker.position.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !jobseeker.skills.some((skill) =>
        skill.toLowerCase().includes(filters.searchQuery.toLowerCase()),
      )
    ) {
      return false;
    }

    // Фильтр по городу
    if (filters.city && !jobseeker.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }

    // Фильтр по зарплате с учетом валюты
    if (filters.salaryRange.min && jobseeker.salary < parseInt(filters.salaryRange.min)) {
      return false;
    }
    if (filters.salaryRange.max && jobseeker.salary > parseInt(filters.salaryRange.max)) {
      return false;
    }
    // В реальном приложении здесь также нужно учитывать конвертацию валют
    // Например: if (filters.currency !== jobseeker.currency) { ... конвертация ... }

    // Фильтр по статусу
    if (filters.selectedStatus && jobseeker.status !== filters.selectedStatus) {
      return false;
    }

    // Фильтр по периоду (в реальном приложении здесь будет проверка даты)
    // Для примера просто пропускаем этот фильтр, так как у нас нет даты в моковых данных

    return true;
  });

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
    <LayoutCompany>
      <div className="container mx-auto py-6 px-4">
        {/* Заголовок и поисковая строка */}
        <div className="flex flex-col items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Поиск соискателей</h1>

          <div className="w-full max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени, должности или навыкам"
              className="pl-10 pr-10"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
            {filters.searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setFilters({ ...filters, searchQuery: "" })}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Кнопка фильтров для мобильных */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
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
            <DesktopFilters
              filters={filters}
              setFilters={setFilters}
              activeFiltersCount={activeFiltersCount}
              resetFilters={resetFilters}
            />
          </div>

          {/* Список соискателей */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <LoadingState />
            ) : filteredJobseekers.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <>
                {/* Информация о результатах */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">
                    Найдено соискателей: <strong>{filteredJobseekers.length}</strong>
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
                  {filteredJobseekers.map((jobseeker) => (
                    <JobseekerCard
                      key={jobseeker.id}
                      jobseeker={jobseeker}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Мобильные фильтры */}
      <MobileFilters
        filters={filters}
        setFilters={setFilters}
        activeFiltersCount={activeFiltersCount}
        resetFilters={resetFilters}
        isOpen={isMobileFiltersOpen}
        setIsOpen={setIsMobileFiltersOpen}
      />

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
    </LayoutCompany>
  );
};
