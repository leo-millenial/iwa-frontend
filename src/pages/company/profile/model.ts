import { combine, createEffect, createEvent, createStore, sample } from "effector";

import { routes } from "@/shared/routing";
import { ICompany } from "@/shared/types/company.interface.ts";
import { UserRole } from "@/shared/types/user.interface.ts";
import { chainAuthenticated } from "@/shared/viewer";

export const currentRoute = routes.company.profile;

export const authenticatedRoute = chainAuthenticated(currentRoute, {
  requiredRole: UserRole.Company,
});

// События (Events)
export const editingStarted = createEvent();
export const editingCancelled = createEvent();
export const formSubmitted = createEvent();

export const nameChanged = createEvent<string>();
export const regionChanged = createEvent<string>();
export const cityChanged = createEvent<string>();
export const innChanged = createEvent<number>();
export const phoneChanged = createEvent<string>();
export const employeesCountChanged = createEvent<number>();
export const websiteUrlChanged = createEvent<string>();
export const logoUrlChanged = createEvent<string>();
export const descriptionChanged = createEvent<string>();

export const brandAdded = createEvent();
export const brandRemoved = createEvent<number>();
export const brandUpdated = createEvent<{ index: number; value: string }>();

export const certificateAdded = createEvent();
export const certificateRemoved = createEvent<number>();
export const certificateUpdated = createEvent<{ index: number; value: string }>();

export const documentAdded = createEvent();
export const documentRemoved = createEvent<number>();
export const documentUpdated = createEvent<{ index: number; value: string }>();

export const fetchCompanyProfileFx = createEffect(async () => {
  // В реальном приложении здесь будет запрос к API
  // Возвращаем моковые данные для примера
  return {
    name: "ООО Рога и Копыта",
    region: "Московская область",
    city: "Москва",
    inn: 7712345678,
    phone: "+7 (999) 123-45-67",
    brands: ["Бренд 1", "Бренд 2"],
    employeesCount: 150,
    websiteUrl: "https://example.com",
    logoUrl: "https://via.placeholder.com/150",
    certificateUrls: ["https://via.placeholder.com/300x400"],
    documentUrls: ["https://via.placeholder.com/300x400"],
    description: "Наша компания занимается разработкой инновационных решений в области IT.",
  } as ICompany;
});

export const updateCompanyProfileFx = createEffect(async (company: ICompany) => {
  console.log("Отправка данных на сервер:", company);
  return company;
});

export const $name = createStore("")
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.name)
  .on(nameChanged, (_, name) => name)
  .on(updateCompanyProfileFx.doneData, (_, company) => company.name)
  .reset(editingCancelled);

export const $region = createStore("")
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.region)
  .on(regionChanged, (_, region) => region)
  .on(updateCompanyProfileFx.doneData, (_, company) => company.region)
  .reset(editingCancelled);

export const $city = createStore("")
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.city)
  .on(cityChanged, (_, city) => city)
  .on(updateCompanyProfileFx.doneData, (_, company) => company.city)
  .reset(editingCancelled);

export const $inn = createStore<number>(0)
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.inn)
  .on(innChanged, (_, inn) => inn)
  .on(updateCompanyProfileFx.doneData, (_, company) => company.inn)
  .reset(editingCancelled);

export const $phone = createStore("")
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.phone)
  .on(phoneChanged, (_, phone) => phone)
  .on(updateCompanyProfileFx.doneData, (_, company) => company.phone)
  .reset(editingCancelled);

export const $employeesCount = createStore<number>(0)
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.employeesCount || 0)
  .on(employeesCountChanged, (_, count) => count)
  .on(updateCompanyProfileFx.doneData, (_, company) => company.employeesCount || 0)
  .reset(editingCancelled);

export const $websiteUrl = createStore("")
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.websiteUrl || "")
  .on(websiteUrlChanged, (_, url) => url)
  .on(updateCompanyProfileFx.doneData, (_, company) => company.websiteUrl || "")
  .reset(editingCancelled);

export const $logoUrl = createStore("")
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.logoUrl || "")
  .on(logoUrlChanged, (_, url) => url)
  .on(updateCompanyProfileFx.doneData, (_, company) => company.logoUrl || "")
  .reset(editingCancelled);

export const $description = createStore("")
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.description || "")
  .on(descriptionChanged, (_, description) => description)
  .on(updateCompanyProfileFx.doneData, (_, company) => company.description || "")
  .reset(editingCancelled);

export const $brands = createStore<string[]>([])
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.brands || [])
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
  .on(updateCompanyProfileFx.doneData, (_, company) => company.brands || [])
  .reset(editingCancelled);

export const $certificateUrls = createStore<string[]>([])
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.certificateUrls || [])
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
  .on(updateCompanyProfileFx.doneData, (_, company) => company.certificateUrls || [])
  .reset(editingCancelled);

export const $documentUrls = createStore<string[]>([])
  .on(fetchCompanyProfileFx.doneData, (_, company) => company.documentUrls || [])
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
  .on(updateCompanyProfileFx.doneData, (_, company) => company.documentUrls || [])
  .reset(editingCancelled);

export const $isEditing = createStore(false)
  .on(editingStarted, () => true)
  .on(editingCancelled, () => false)
  .on(updateCompanyProfileFx.done, () => false);

export const $pending = createStore(false).on(
  [fetchCompanyProfileFx.pending, updateCompanyProfileFx.pending],
  (_, pending) => pending,
);

// Комбинированные хранилища
export const $company = combine({
  name: $name,
  region: $region,
  city: $city,
  inn: $inn,
  phone: $phone,
  employeesCount: $employeesCount,
  websiteUrl: $websiteUrl,
  logoUrl: $logoUrl,
  description: $description,
  brands: $brands,
  certificateUrls: $certificateUrls,
  documentUrls: $documentUrls,
});

// Связи (Samples)
sample({
  clock: formSubmitted,
  source: $company,
  target: updateCompanyProfileFx,
});

// Инициализация данных при загрузке страницы
sample({
  clock: currentRoute.opened,
  target: fetchCompanyProfileFx,
});

// Сэмплы для обработки событий
sample({
  clock: authenticatedRoute.opened,
  target: fetchCompanyProfileFx,
});

export const companyFieldChanged = {
  name: nameChanged,
  region: regionChanged,
  city: cityChanged,
  inn: innChanged,
  phone: phoneChanged,
  employeesCount: employeesCountChanged,
  websiteUrl: websiteUrlChanged,
  logoUrl: logoUrlChanged,
  description: descriptionChanged,
};
