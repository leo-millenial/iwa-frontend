import { combine, createEvent, createStore, sample } from "effector";

import { getCompanyByIdQuery, updateCompanyMutation } from "@/shared/api/company";
import { showErrorToast, showSuccessToast } from "@/shared/lib/toast";
import { routes } from "@/shared/routing";
import { ICompany } from "@/shared/types/company.interface.ts";
import { $viewer } from "@/shared/viewer";

export const currentRoute = routes.company.profile;

// export const authenticatedRoute = chainAuthenticated(currentRoute, {
//   requiredRole: UserRole.Company,
// });

// События (Events)
export const editingStarted = createEvent();
export const editingCancelled = createEvent();
export const formSubmitted = createEvent();

// Создаем объект с событиями для изменения полей компании
export const companyFieldChanged = {
  name: createEvent<string>(),
  region: createEvent<string>(),
  city: createEvent<string>(),
  inn: createEvent<number>(),
  phone: createEvent<string>(),
  employeesCount: createEvent<number>(),
  websiteUrl: createEvent<string>(),
  description: createEvent<string>(),
  logoFile: createEvent<string>(),
  certificateFile: createEvent<string>(),
  documentFile: createEvent<string>(),
};

// Для обратной совместимости оставляем отдельные события
export const nameChanged = companyFieldChanged.name;
export const regionChanged = companyFieldChanged.region;
export const cityChanged = companyFieldChanged.city;
export const innChanged = companyFieldChanged.inn;
export const phoneChanged = companyFieldChanged.phone;
export const employeesCountChanged = companyFieldChanged.employeesCount;
export const websiteUrlChanged = companyFieldChanged.websiteUrl;
export const logoUrlChanged = createEvent<string>();
export const descriptionChanged = companyFieldChanged.description;

export const brandAdded = createEvent();
export const brandRemoved = createEvent<number>();
export const brandUpdated = createEvent<{ index: number; value: string }>();

export const certificateAdded = createEvent();
export const certificateRemoved = createEvent<number>();
export const certificateUpdated = createEvent<{ index: number; value: string }>();

export const documentAdded = createEvent();
export const documentRemoved = createEvent<number>();
export const documentUpdated = createEvent<{ index: number; value: string }>();

// Получаем ID компании из данных пользователя
const $companyId = $viewer.map((viewer) => viewer?.company?._id ?? "");

export const $company = createStore<ICompany | null>(null)
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company ?? null)
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result ?? null);

// Сторы для полей компании
export const $name = createStore("")
  .on(companyFieldChanged.name, (_, name) => name)
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.name ?? "")
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.name ?? "")
  .reset(editingCancelled);

export const $region = createStore("")
  .on(companyFieldChanged.region, (_, region) => region)
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.region ?? "")
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.region ?? "")
  .reset(editingCancelled);

export const $city = createStore("")
  .on(companyFieldChanged.city, (_, city) => city)
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.city ?? "")
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.city ?? "")
  .reset(editingCancelled);

export const $inn = createStore<number>(0)
  .on(companyFieldChanged.inn, (_, inn) => inn)
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.inn ?? 0)
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.inn ?? 0)
  .reset(editingCancelled);

export const $phone = createStore("")
  .on(companyFieldChanged.phone, (_, phone) => phone)
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.phone ?? "")
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.phone ?? "")
  .reset(editingCancelled);

export const $employeesCount = createStore<number>(0)
  .on(companyFieldChanged.employeesCount, (_, count) => count)
  .on(
    updateCompanyMutation.finished.success,
    (_, { result }) => result?.company.employeesCount ?? 0,
  )
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.employeesCount ?? 0)
  .reset(editingCancelled);

export const $websiteUrl = createStore("")
  .on(companyFieldChanged.websiteUrl, (_, url) => url)
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.websiteUrl ?? "")
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.websiteUrl ?? "")
  .reset(editingCancelled);

export const $logoUrl = createStore("")
  .on(logoUrlChanged, (_, url) => url)
  .on(companyFieldChanged.logoFile, (_, logoUrl) => logoUrl)
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.logoUrl ?? "")
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.logoUrl ?? "")
  .reset(editingCancelled);

export const $description = createStore("")
  .on(companyFieldChanged.description, (_, description) => description)
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.description ?? "")
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.description ?? "")
  .reset(editingCancelled);

export const $brands = createStore<string[]>([])
  .on(brandAdded, (state) => [...state, ""])
  .on(brandRemoved, (state, index) => {
    const newBrands = [...state];
    newBrands.splice(index, 1);
    return newBrands;
  })
  .on(brandUpdated, (state, { index, value }) => {
    const newBrands = [...state];
    newBrands[index] = value;
    return newBrands;
  })
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.brands ?? [])
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.brands ?? [])
  .reset(editingCancelled);

// Обновляем логику для $certificateUrls
export const $certificateUrls = createStore<string[]>([])
  .on(certificateAdded, (state) => [...state, ""])
  .on(certificateRemoved, (state, index) => {
    const newCertificates = [...state];
    newCertificates.splice(index, 1);
    return newCertificates;
  })
  .on(certificateUpdated, (state, { index, value }) => {
    const newCertificates = [...state];
    newCertificates[index] = value;
    return newCertificates;
  })
  .on(companyFieldChanged.certificateFile, (state, fileUrl) => {
    if (state.includes(fileUrl)) {
      return state;
    }
    return [...state, fileUrl];
  })
  .on(
    updateCompanyMutation.finished.success,
    (_, { result }) => result?.company.certificateUrls ?? [],
  )
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.certificateUrls ?? [])
  .reset(editingCancelled);

// Обновляем логику для $documentUrls
export const $documentUrls = createStore<string[]>([])
  .on(documentAdded, (state) => [...state, ""])
  .on(documentRemoved, (state, index) => {
    const newDocuments = [...state];
    newDocuments.splice(index, 1);
    return newDocuments;
  })
  .on(documentUpdated, (state, { index, value }) => {
    const newDocuments = [...state];
    newDocuments[index] = value;
    return newDocuments;
  })
  .on(companyFieldChanged.documentFile, (state, fileUrl) => {
    if (state.includes(fileUrl)) {
      return state;
    }
    return [...state, fileUrl];
  })
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.documentUrls ?? [])
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.documentUrls ?? [])
  .reset(editingCancelled);

// Добавляем стор для хранения оригинальных значений всех полей компании
export const $originalCompanyForm = createStore<{
  name: string;
  region: string;
  city: string;
  inn: number;
  phone: string;
  employeesCount: number;
  websiteUrl: string;
  description: string;
  brands: string[];
  certificateUrls: string[];
  documentUrls: string[];
  logoUrl: string;
}>({
  name: "",
  region: "",
  city: "",
  inn: 0,
  phone: "",
  employeesCount: 0,
  websiteUrl: "",
  description: "",
  brands: [],
  certificateUrls: [],
  documentUrls: [],
  logoUrl: "",
}).on(getCompanyByIdQuery.finished.success, (_, { result }) => ({
  name: result?.name ?? "",
  region: result?.region ?? "",
  city: result?.city ?? "",
  inn: result?.inn ?? 0,
  phone: result?.phone ?? "",
  employeesCount: result?.employeesCount ?? 0,
  websiteUrl: result?.websiteUrl ?? "",
  description: result?.description ?? "",
  brands: result?.brands ?? [],
  certificateUrls: result?.certificateUrls ?? [],
  documentUrls: result?.documentUrls ?? [],
  logoUrl: result?.logoUrl ?? "",
}));

// Сохраняем оригинальные значения при начале редактирования
sample({
  // @ts-expect-error
  clock: editingStarted,
  source: $company,
  filter: Boolean,
  target: $originalCompanyForm,
});

// Добавляем обработчик для отправки запроса при отмене редактирования
sample({
  clock: editingCancelled,
  source: {
    id: $companyId,
    data: $originalCompanyForm,
  },
  filter: ({ id }) => Boolean(id),
  target: updateCompanyMutation.start,
});

// Стор для отслеживания состояния редактирования
export const $isEditing = createStore(false)
  .on(editingStarted, () => true)
  .on(editingCancelled, () => false)
  .on(updateCompanyMutation.finished.success, () => false);

// Объединяем все поля формы в один стор
export const $companyForm = combine({
  name: $name,
  region: $region,
  city: $city,
  inn: $inn,
  phone: $phone,
  employeesCount: $employeesCount,
  websiteUrl: $websiteUrl,
  description: $description,
  brands: $brands,
  certificateUrls: $certificateUrls,
  documentUrls: $documentUrls,
  logoUrl: $logoUrl,
});

// Стор для отслеживания состояния загрузки
export const $pending = updateCompanyMutation.$pending;
export const $requestSource = createStore<"save" | "cancel" | null>(null)
  .on(formSubmitted, () => "save")
  .on(editingCancelled, () => "cancel")
  .reset(updateCompanyMutation.$finished);

// Загрузка данных компании при открытии страницы
sample({
  clock: currentRoute.opened,
  source: $companyId,
  filter: (companyId) => Boolean(companyId),
  target: getCompanyByIdQuery.start,
});

sample({
  clock: formSubmitted,
  source: {
    id: $companyId,
    data: $companyForm,
  },
  target: updateCompanyMutation.start,
});

sample({
  clock: updateCompanyMutation.finished.success,
  fn: () => ({
    message: "Успешно!",
    description: "Данные компании успешно изменены",
  }),
  target: showSuccessToast,
});
sample({
  clock: updateCompanyMutation.finished.failure,
  fn: () => ({
    message: "Ошибка!",
    description: "Не удалось изменить данные компании",
  }),
  target: showErrorToast,
});
