import { combine, createEvent, createStore, sample } from "effector";

import { getCompanyByIdQuery, updateCompanyMutation } from "@/shared/api/company";
import { fileUrlByFileId } from "@/shared/config";
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
  .on(companyFieldChanged.logoFile, (_, fileId) => fileUrlByFileId(fileId))
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
  .on(companyFieldChanged.certificateFile, (state, fileId) => [...state, fileUrlByFileId(fileId)])
  .on(
    updateCompanyMutation.finished.success,
    (_, { result }) => result?.company.certificateUrls ?? [],
  )
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.certificateUrls ?? [])
  .reset(editingCancelled);

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
  .on(companyFieldChanged.documentFile, (state, fileId) => [...state, `/api/files/${fileId}`])
  .on(updateCompanyMutation.finished.success, (_, { result }) => result?.company.documentUrls ?? [])
  .on(getCompanyByIdQuery.finished.success, (_, { result }) => result?.documentUrls ?? [])
  .reset(editingCancelled);

// Стор для отслеживания состояния редактирования
export const $isEditing = createStore(false)
  .on(editingStarted, () => true)
  .on(editingCancelled, () => false)
  .on(updateCompanyMutation.finished.success, () => false);

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
