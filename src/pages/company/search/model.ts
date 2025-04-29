import { createEvent, createStore, sample } from "effector";
import { debounce } from "patronum";

import { getResumeListQuery } from "@/shared/api/resume";
import { routes } from "@/shared/routing";
import { IResume, ResumeSearchParams } from "@/shared/types/resume.interface.ts";
import { EmploymentType, Experience } from "@/shared/types/vacancy.interface.ts";
import { chainAuthenticated } from "@/shared/viewer";

export const currentRoute = routes.company.search;

export const authenticatedRoute = chainAuthenticated(currentRoute);

/*
   todo
    - Подсчет активных фильтров [activeFiltersCount]
    - Обработчик для добавления/удаления из избранного
    - toggleFavorite
    - resume.status: Активный поиск | Готов к предложениям
 */

// События для изменения параметров поиска
export const searchChanged = createEvent<string>();
export const cityChanged = createEvent<string>();
export const experienceChanged = createEvent<string | null>();
export const employmentTypesChanged = createEvent<EmploymentType[]>();
export const salaryMinChanged = createEvent<number | null>();
export const salaryMaxChanged = createEvent<number | null>();
export const skillsChanged = createEvent<string>();
export const onlyFavoritesChanged = createEvent<boolean>();
export const postingPeriodChanged = createEvent<string>();
export const jobseekerStatusChanged = createEvent<string | null>();
export const resetFilters = createEvent();

// Сторы для параметров поиска
export const $searchQuery = createStore<string>("");
export const $city = createStore<string>("");
export const $experience = createStore<string | null>(null);
export const $employmentTypes = createStore<EmploymentType[]>([]);
export const $salaryMin = createStore<number | null>(null);
export const $salaryMax = createStore<number | null>(null);
export const $skills = createStore<string>("");
export const $onlyFavorites = createStore<boolean>(false);
export const $postingPeriod = createStore<string>("За все время");
export const $jobseekerStatus = createStore<string | null>(null);

// Обновление сторов при изменении параметров
$searchQuery.on(searchChanged, (_, query) => query);
$city.on(cityChanged, (_, city) => city);
$experience.on(experienceChanged, (_, experience) => experience);
$employmentTypes.on(employmentTypesChanged, (_, types) => types);
$salaryMin.on(salaryMinChanged, (_, min) => min);
$salaryMax.on(salaryMaxChanged, (_, max) => max);
$skills.on(skillsChanged, (_, skills) => skills);
$onlyFavorites.on(onlyFavoritesChanged, (_, value) => value);
$postingPeriod.on(postingPeriodChanged, (_, period) => period);
$jobseekerStatus.on(jobseekerStatusChanged, (_, status) => status);

// Сброс всех фильтров
sample({
  clock: resetFilters,
  target: [
    $searchQuery.reinit,
    $city.reinit,
    $experience.reinit,
    $employmentTypes.reinit,
    $salaryMin.reinit,
    $salaryMax.reinit,
    $skills.reinit,
    $onlyFavorites.reinit,
    $postingPeriod.reinit,
    $jobseekerStatus.reinit,
  ],
});

export const $searchParams = createStore<ResumeSearchParams>({});

sample({
  source: {
    query: $searchQuery,
    city: $city,
    experience: $experience,
    employmentTypes: $employmentTypes,
    salaryMin: $salaryMin,
    salaryMax: $salaryMax,
    skills: $skills,
    onlyFavorites: $onlyFavorites,
    postingPeriod: $postingPeriod,
    jobseekerStatus: $jobseekerStatus,
  },
  fn: (params) => {
    const searchParams: ResumeSearchParams = {};

    if (params.query) searchParams.query = params.query;
    if (params.city) searchParams.city = params.city;
    if (params.experience) searchParams.experience = params.experience as Experience;
    if (params.employmentTypes.length > 0) {
      // Передаем массив напрямую, без преобразования в строку
      searchParams.employmentTypes = params.employmentTypes;
    }
    if (params.salaryMin !== null) searchParams.salaryMin = params.salaryMin;
    if (params.salaryMax !== null) searchParams.salaryMax = params.salaryMax;
    if (params.skills) searchParams.skills = params.skills;
    // if (params.onlyFavorites) searchParams.onlyFavorites = params.onlyFavorites;
    // if (params.postingPeriod !== "За все время") searchParams.postingPeriod = params.postingPeriod;
    // if (params.jobseekerStatus) searchParams.jobseekerStatus = params.jobseekerStatus;

    return searchParams;
  },
  target: $searchParams,
});

export const $resumeList = createStore<IResume[]>([]);
export const $pending = getResumeListQuery.$pending;

$resumeList.on(getResumeListQuery.finished.success, (_, { result }) => result);

export const debouncedSearchChanged = debounce({
  source: searchChanged,
  timeout: 300,
});

sample({
  clock: currentRoute.opened,
  source: $searchParams,
  target: getResumeListQuery.start,
});

// Запрос при изменении параметров поиска (с debounce для поискового запроса)
sample({
  clock: [
    debouncedSearchChanged,
    cityChanged,
    experienceChanged,
    employmentTypesChanged,
    salaryMinChanged,
    salaryMaxChanged,
    skillsChanged,
    onlyFavoritesChanged,
    postingPeriodChanged,
    jobseekerStatusChanged,
    resetFilters,
  ],
  source: $searchParams,
  target: getResumeListQuery.start,
});
