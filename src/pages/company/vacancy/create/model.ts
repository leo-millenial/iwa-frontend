import { combine, createEvent, createStore, sample } from "effector";
import { reset } from "patronum";

import { createVacancyMutation } from "@/shared/api/vacancy";
import { routes } from "@/shared/routing";
import { EmploymentType, Experience } from "@/shared/types/vacancy.interface.ts";
import { $companyId } from "@/shared/viewer";

export const currentRoute = routes.company.vacancy.create;

// export const authenticatedRoute = chainAuthenticated(currentRoute, {
//   otherwise: routes.auth.signIn.open,
// });

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
export const skillsTextChanged = createEvent<string>();
export const brandsChanged = createEvent<string>();

export const $title = createStore("");
export const $description = createStore("");
export const $salaryMin = createStore("");
export const $salaryMax = createStore("");
export const $currency = createStore("RUB");
export const $city = createStore("");
export const $skillsText = createStore("");
export const $experience = createStore<Experience>(Experience.Middle);
export const $employmentTypes = createStore<EmploymentType[]>([EmploymentType.FullTime]);
export const $brandsInput = createStore("");
export const $brands = createStore<string[]>([]);
export const $pending = createVacancyMutation.$pending;

$title.on(titleChanged, (_, title) => title);
$description.on(descriptionChanged, (_, description) => description);
$salaryMin.on(salaryMinChanged, (_, salaryMin) => salaryMin);
$salaryMax.on(salaryMaxChanged, (_, salaryMax) => salaryMax);
$currency.on(currencyChanged, (_, currency) => currency);
$city.on(cityChanged, (_, city) => city);
$experience.on(experienceChanged, (_, experience) => experience);
$skillsText.on(skillsTextChanged, (_, skillsText) => skillsText);
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

const $formData = combine({
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
  skillsText: $skillsText,
  brands: $brands,
});

sample({
  // @ts-expect-error
  clock: formSubmitted,
  source: $formData,
  target: createVacancyMutation.start,
});

sample({
  clock: createVacancyMutation.$succeeded,
  source: currentRoute.$params,
  fn: ({ companyId }) => ({ params: { companyId } }),
  target: routes.company.vacancies.open,
});

sample({
  clock: createVacancyMutation.finished.failure,
  fn: (response) => console.log("Vacancy created failure", response),
});

reset({
  clock: currentRoute.closed,
  target: [
    $title,
    $description,
    $salaryMin,
    $salaryMax,
    $currency,
    $city,
    $skillsText,
    $experience,
    $employmentTypes,
    $brandsInput,
    $brands,
  ],
});
