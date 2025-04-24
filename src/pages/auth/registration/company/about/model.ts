import { invoke } from "@withease/factories";
import { combine, createEvent, createStore, sample } from "effector";
import { and, not, or, reset } from "patronum";

import {
  $completedStep,
  $sessionId,
  RegistrationStep,
  registrationResponseSucceed,
} from "@/pages/auth/registration/model.ts";

import { completeRegistrationMutation, step5Mutation } from "@/shared/api/registration";
import { createPhoneValidation } from "@/shared/lib/phone/phone-validation";
import { routes } from "@/shared/routing";
import { ICompany } from "@/shared/types/company.interface.ts";
import { PhoneError } from "@/shared/ui/phone-input.tsx";

export const currentRoute = routes.auth.registrationFlow.company.about;

export type CompanyRegistration = Pick<
  ICompany,
  "name" | "phone" | "city" | "region" | "inn" | "brands"
>;

// Типы ошибок для каждого поля
export type CompanyNameError = null | "NAME_REQUIRED" | "NAME_TOO_SHORT";
export type CompanyCityError = null | "CITY_REQUIRED";
export type CompanyRegionError = null | "REGION_REQUIRED";
export type CompanyInnError = null | "INN_REQUIRED" | "INN_INVALID_FORMAT";
export type CompanyBrandsError = null | "BRANDS_INVALID";

export type CompanyFormError =
  | CompanyNameError
  | CompanyCityError
  | CompanyRegionError
  | CompanyInnError
  | CompanyBrandsError
  | PhoneError;

const saveClicked = createEvent();

const nameChanged = createEvent<string>();
const cityChanged = createEvent<string>();
const regionChanged = createEvent<string>();
const innChanged = createEvent<string>();
const brandsChanged = createEvent<string[]>();
const validateForm = createEvent<void>();

const $pending = or(step5Mutation.$pending, completeRegistrationMutation.$pending);
const $name = createStore("");
const $city = createStore("");
const $region = createStore("");
const $inn = createStore("");
const $brands = createStore<string[]>([]);

const $nameError = createStore<CompanyNameError>(null);
const $cityError = createStore<CompanyCityError>(null);
const $regionError = createStore<CompanyRegionError>(null);
const $innError = createStore<CompanyInnError>(null);
const $brandsError = createStore<CompanyBrandsError>(null);
const $formError = createStore<CompanyFormError>(null);

const {
  phoneChanged,
  validatePhone,
  $error: $phoneError,
  $normalizedPhone,
} = invoke(createPhoneValidation);

$name.on(nameChanged, (_, name) => name);
$city.on(cityChanged, (_, city) => city);
$region.on(regionChanged, (_, region) => region);
$inn.on(innChanged, (_, inn) => inn);
$brands.on(brandsChanged, (_, brands) => brands);

sample({
  clock: saveClicked,
  target: [validateForm, validatePhone],
});

sample({
  clock: validateForm,
  source: $name,
  fn: (name) => {
    if (!name.trim()) return "NAME_REQUIRED";
    if (name.trim().length < 3) return "NAME_TOO_SHORT";
    return null;
  },
  target: $nameError,
});

// Логика валидации для города
sample({
  clock: validateForm,
  source: $city,
  fn: (city) => {
    if (!city.trim()) return "CITY_REQUIRED";
    return null;
  },
  target: $cityError,
});

// Логика валидации для региона
sample({
  clock: validateForm,
  source: $region,
  fn: (region) => {
    if (!region.trim()) return "REGION_REQUIRED";
    return null;
  },
  target: $regionError,
});

// Логика валидации для ИНН
sample({
  clock: validateForm,
  source: $inn,
  fn: (inn) => {
    if (!inn.trim()) return "INN_REQUIRED";
    // ИНН должен содержать 10 или 12 цифр
    if (!/^(\d{10}|\d{12})$/.test(inn.trim())) return "INN_INVALID_FORMAT";
    return null;
  },
  target: $innError,
});

// Логика валидации для брендов
sample({
  clock: validateForm,
  source: $brands,
  fn: (brands) => {
    // Проверяем, что все бренды валидны (не пустые строки)
    const invalidBrands = brands.some((brand) => brand.trim() === "");
    if (invalidBrands) return "BRANDS_INVALID" as CompanyBrandsError;
    return null;
  },
  target: $brandsError,
});

sample({
  clock: [$nameError, $cityError, $regionError, $innError, $brandsError, $phoneError],
  source: combine({
    nameError: $nameError,
    cityError: $cityError,
    regionError: $regionError,
    innError: $innError,
    brandsError: $brandsError,
    phoneError: $phoneError,
  }),
  fn: ({ nameError, cityError, regionError, innError, brandsError, phoneError }) => {
    // Возвращаем первую найденную ошибку
    return nameError || cityError || regionError || innError || brandsError || phoneError;
  },
  target: $formError,
});

// Флаг валидности формы
export const $formValid = and(
  not($nameError.map(Boolean)),
  not($cityError.map(Boolean)),
  not($regionError.map(Boolean)),
  not($innError.map(Boolean)),
  not($brandsError.map(Boolean)),
  not($phoneError.map(Boolean)),
);

const $companyDto = combine(
  {
    name: $name,
    phone: $normalizedPhone,
    city: $city,
    region: $region,
    inn: $inn,
    brands: $brands,
  },
  ({ name, phone, city, region, inn, brands }) => ({
    name,
    phone,
    city,
    region,
    inn: Number(inn),
    brands: brands.filter((brand) => brand.trim() !== ""),
  }),
);

sample({
  clock: saveClicked,
  source: { sessionId: $sessionId, company: $companyDto },
  filter: $formValid,
  target: step5Mutation.start,
});

sample({
  clock: step5Mutation.finished.success,
  fn: ({ result }) => ({
    currentStep: result.currentStep,
    sessionId: result.sessionId,
  }),
  target: registrationResponseSucceed,
});

sample({
  clock: $completedStep,
  source: { sessionId: $sessionId },
  filter: (_, step) => step === RegistrationStep.SendDataSucceed,
  target: completeRegistrationMutation.start,
});

sample({
  clock: completeRegistrationMutation.$succeeded,
  target: routes.auth.finish.open,
});

reset({
  clock: [nameChanged, cityChanged, regionChanged, innChanged, brandsChanged, phoneChanged],
  target: [$formError],
});

export {
  saveClicked,
  nameChanged,
  phoneChanged,
  cityChanged,
  regionChanged,
  innChanged,
  brandsChanged,
  validateForm,
  $name,
  $city,
  $region,
  $inn,
  $brands,
  $formError,
  $pending,
};
