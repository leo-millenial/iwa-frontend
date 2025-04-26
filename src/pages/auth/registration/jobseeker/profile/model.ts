import { createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/session";
import { and } from "patronum";

import {
  firstNameChanged as registrationFirstNameChanged,
  lastNameChanged as registrationLastNameChanged,
} from "@/pages/auth/registration/full-name/model.ts";
import { PERSIST_KEYS } from "@/pages/auth/registration/jobseeker/profile/consts.ts";

import { appStarted } from "@/shared/init";
import { routes } from "@/shared/routing";
import { Gender } from "@/shared/types/resume.interface.ts";

export const currentRoute = routes.auth.registrationFlow.jobseeker.profile;

export type ProfileFormError =
  | null
  | "EMPTY_FORM"
  | "INVALID_NAME"
  | "INVALID_BIRTH_DATE"
  | "INVALID_POSITION"
  | "INVALID_SALARY"
  | "SERVER_ERROR";

export const formSubmitted = createEvent();
export const genderChanged = createEvent<Gender>();
export const birthDateChanged = createEvent<Date | undefined>();
export const lastNameChanged = createEvent<string>();
export const firstNameChanged = createEvent<string>();
export const middleNameChanged = createEvent<string>();
export const positionChanged = createEvent<string>();
export const salaryChanged = createEvent<string>();
export const currencyChanged = createEvent<string>();
export const setFormError = createEvent<ProfileFormError>();
export const cityChanged = createEvent<string>();
export const regionChanged = createEvent<string>();

export const $gender = createStore<Gender>(Gender.Male);
export const $birthDate = createStore<Date | null>(null);
export const $firstName = createStore<string>("");
export const $lastName = createStore<string>("");
export const $middleName = createStore<string>("");
export const $position = createStore<string>("");
export const $salary = createStore<string>("");
export const $currency = createStore<string>("RUB");
export const $formError = createStore<ProfileFormError>(null);
export const $city = createStore("");
export const $region = createStore("");

persist({
  store: $gender,
  key: PERSIST_KEYS.GENDER,
  pickup: appStarted,
});

persist({
  store: $birthDate,
  key: PERSIST_KEYS.BIRTH_DATE,
  pickup: appStarted,
});

persist({
  store: $firstName,
  key: PERSIST_KEYS.FIRST_NAME,
  pickup: appStarted,
});

persist({
  store: $lastName,
  key: PERSIST_KEYS.LAST_NAME,
  pickup: appStarted,
});

persist({
  store: $middleName,
  key: PERSIST_KEYS.MIDDLE_NAME,
  pickup: appStarted,
});

persist({
  store: $position,
  key: PERSIST_KEYS.POSITION,
  pickup: appStarted,
});

persist({
  store: $salary,
  key: PERSIST_KEYS.SALARY,
  pickup: appStarted,
});

persist({
  store: $currency,
  key: PERSIST_KEYS.CURRENCY,
  pickup: appStarted,
});

$gender.on(genderChanged, (_, gender) => gender);
$birthDate.on(birthDateChanged, (_, birthDate) => birthDate);
$firstName
  .on(firstNameChanged, (_, firstName) => firstName)
  .on(registrationFirstNameChanged, (_, firstName) => firstName);
$lastName
  .on(lastNameChanged, (_, lastName) => lastName)
  .on(registrationLastNameChanged, (_, lastName) => lastName);
$middleName.on(middleNameChanged, (_, middleName) => middleName);
$position.on(positionChanged, (_, position) => position);
$salary.on(salaryChanged, (_, salary) => salary);
$currency.on(currencyChanged, (_, currency) => currency);
$formError.on(setFormError, (_, error) => error);
$city.on(cityChanged, (_, city) => city);
$region.on(regionChanged, (_, region) => region);

$formError.reset(
  genderChanged,
  birthDateChanged,
  lastNameChanged,
  firstNameChanged,
  middleNameChanged,
  positionChanged,
  salaryChanged,
  currencyChanged,
);

const $lastNameValid = $lastName.map((lastName) => Boolean(lastName.trim()));
const $firstNameValid = $firstName.map((firstName) => Boolean(firstName.trim()));
const $birthDateValid = $birthDate.map((birthDate) => Boolean(birthDate));
const $positionValid = $position.map((position) => Boolean(position.trim()));
const $salaryValid = $salary.map((salary) => !isNaN(Number(salary)) && Number(salary) > 0);

sample({
  clock: formSubmitted,
  source: {
    lastNameValid: $lastNameValid,
    firstNameValid: $firstNameValid,
    birthDateValid: $birthDateValid,
    positionValid: $positionValid,
    salaryValid: $salaryValid,
  },
  filter: ({ lastNameValid, firstNameValid, birthDateValid, positionValid, salaryValid }) =>
    !lastNameValid || !firstNameValid || !birthDateValid || !positionValid || !salaryValid,
  fn: ({ lastNameValid, firstNameValid, birthDateValid, positionValid, salaryValid }) => {
    if (!lastNameValid || !firstNameValid) return "INVALID_NAME";
    if (!birthDateValid) return "INVALID_BIRTH_DATE";
    if (!positionValid) return "INVALID_POSITION";
    if (!salaryValid) return "INVALID_SALARY";
    return "EMPTY_FORM";
  },
  target: setFormError,
});

export const $formIsValid = and(
  $lastNameValid,
  $firstNameValid,
  $birthDateValid,
  $positionValid,
  $salaryValid,
);

sample({
  clock: formSubmitted,
  filter: $formIsValid,
  target: routes.auth.registrationFlow.jobseeker.experience.open,
});
