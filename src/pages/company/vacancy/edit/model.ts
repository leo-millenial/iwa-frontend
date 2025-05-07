import { combine, createEvent, createStore, sample } from "effector";

import { getVacancyByIdQuery, updateVacancyMutation } from "@/shared/api/vacancy";
import { showErrorToast, showSuccessToast } from "@/shared/lib/toast";
import { routes } from "@/shared/routing";
import { EmploymentType, Experience } from "@/shared/types/vacancy.interface";
import { $companyId } from "@/shared/viewer";

export const currentRoute = routes.company.vacancy.edit;

// export const authenticatedRoute = chainAuthenticated(currentRoute, {
//   otherwise: routes.auth.signIn.open,
// });

// События для формы
export const formSubmitted = createEvent();
export const titleChanged = createEvent<string>();
export const descriptionChanged = createEvent<string>();
export const salaryMinChanged = createEvent<string>();
export const salaryMaxChanged = createEvent<string>();
export const currencyChanged = createEvent<string>();
export const cityChanged = createEvent<string>();
export const experienceChanged = createEvent<Experience>();
export const employmentTypesChanged = createEvent<EmploymentType[]>();
export const employmentTypeToggled = createEvent<EmploymentType>();
export const brandsChanged = createEvent<string>();

// Сторы для формы
export const $title = createStore("");
export const $description = createStore("");
export const $salaryMin = createStore("");
export const $salaryMax = createStore("");
export const $currency = createStore("RUB");
export const $city = createStore("");
export const $experience = createStore<Experience>(Experience.Middle);
export const $employmentTypes = createStore<EmploymentType[]>([EmploymentType.FullTime]);
export const $brandsInput = createStore("");
export const $brands = createStore<string[]>([]);
export const $vacancyId = currentRoute.$params.map((params) => params.vacancyId || "");
export const $pending = updateVacancyMutation.$pending;

$title.on(titleChanged, (_, title) => title);
$description.on(descriptionChanged, (_, description) => description);
$salaryMin.on(salaryMinChanged, (_, salaryMin) => salaryMin);
$salaryMax.on(salaryMaxChanged, (_, salaryMax) => salaryMax);
$currency.on(currencyChanged, (_, currency) => currency);
$city.on(cityChanged, (_, city) => city);
$experience.on(experienceChanged, (_, experience) => experience);
$employmentTypes
  .on(employmentTypesChanged, (_, employmentTypes) => employmentTypes)
  .on(employmentTypeToggled, (types, type) => {
    if (types.includes(type)) {
      return types.filter((t) => t !== type);
    } else {
      return [...types, type];
    }
  });
$brandsInput.on(brandsChanged, (_, brandsString) => brandsString);

sample({
  source: $brandsInput,
  fn: (brandsString) =>
    brandsString
      .split(",")
      .map((brand) => brand.trim())
      .filter((brand) => brand !== ""),
  target: $brands,
});

sample({
  clock: currentRoute.opened,
  source: $vacancyId,
  target: getVacancyByIdQuery.start,
});

sample({
  clock: getVacancyByIdQuery.finished.success,
  fn: ({ result }) => result.title,
  target: $title,
});

sample({
  clock: getVacancyByIdQuery.finished.success,
  fn: ({ result }) => result.description,
  target: $description,
});

sample({
  clock: getVacancyByIdQuery.finished.success,
  fn: ({ result }) => result.salary.amount.min.toString(),
  target: $salaryMin,
});

sample({
  clock: getVacancyByIdQuery.finished.success,
  fn: ({ result }) => result.salary.amount.max.toString(),
  target: $salaryMax,
});

sample({
  clock: getVacancyByIdQuery.finished.success,
  fn: ({ result }) => String(result.salary.currency),
  target: $currency,
});

sample({
  clock: getVacancyByIdQuery.finished.success,
  fn: ({ result }) => result.city,
  target: $city,
});

sample({
  clock: getVacancyByIdQuery.finished.success,
  fn: ({ result }) => result.experience,
  target: $experience,
});

sample({
  clock: getVacancyByIdQuery.finished.success,
  fn: ({ result }) => result.employmentTypes,
  target: $employmentTypes,
});

sample({
  clock: getVacancyByIdQuery.finished.success,
  fn: ({ result }) => result.brands?.join(", ") ?? "",
  target: $brandsInput,
});

const $formData = combine({
  id: $vacancyId,
  companyId: $companyId,
  title: $title,
  description: $description,
  salary: combine({
    amount: combine([$salaryMin, $salaryMax], ([min, max]) => ({
      min: Number(min),
      max: Number(max),
    })),
    currency: $currency,
  }),
  city: $city,
  experience: $experience,
  employmentTypes: $employmentTypes,
  brands: $brands,
});

sample({
  clock: formSubmitted,
  source: $formData,
  fn: ({ id, companyId, ...formData }) => ({ id, companyId, data: formData }),
  target: updateVacancyMutation.start,
});

sample({
  clock: updateVacancyMutation.finished.success,
  fn: () => ({
    message: "Успешно!",
    description: "Вакансия успешно обновлена",
  }),
  target: showSuccessToast,
});

sample({
  clock: updateVacancyMutation.$succeeded,
  source: { companyId: $companyId, vacancyId: $vacancyId },
  fn: ({ companyId, vacancyId }) => ({ params: { companyId, vacancyId } }),
  target: routes.company.vacancy.view.open,
});

sample({
  clock: updateVacancyMutation.finished.failure,
  fn: () => ({
    message: "Ошибка!",
    description: "Не удалось обновить вакансию",
  }),
  target: showErrorToast,
});

sample({
  clock: updateVacancyMutation.finished.failure,
  fn: (response) => console.log("Vacancy update failure", response),
});
