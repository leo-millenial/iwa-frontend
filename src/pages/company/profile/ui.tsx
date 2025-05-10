import { useUnit } from "effector-react";
import { Edit, Loader2, PlusCircle, Save, Trash2, X } from "lucide-react";

import { UploadPhoto } from "@/features/upload/";
import { UploadDocuments } from "@/features/upload/documents/ui";

import { CompanyProfileView } from "@/entities/company/profile/view/ui.tsx";

import { FileType } from "@/shared/types/file.interface";
import { UserRole } from "@/shared/types/user.interface";
import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs.tsx";
import { Textarea } from "@/shared/ui/textarea.tsx";
import { $viewer } from "@/shared/viewer";

import {
  $brands,
  $certificateUrls,
  $city,
  $company,
  $description,
  $documentUrls,
  $employeesCount,
  $inn,
  $isEditing,
  $logoUrl,
  $name,
  $pending,
  $phone,
  $region,
  $websiteUrl,
  brandAdded,
  brandRemoved,
  brandUpdated,
  certificateRemoved,
  companyFieldChanged,
  documentRemoved,
  editingCancelled,
  editingStarted,
  formSubmitted,
} from "./model.ts";

// Компонент для редактирования информации о компании
const CompanyProfileEdit = () => {
  const [
    name,
    region,
    city,
    inn,
    phone,
    employeesCount,
    websiteUrl,
    logoUrl,
    description,
    brands,
    certificateUrls,
    documentUrls,
    pending,
    handleSave,
    handleCancel,
    handleNameChange,
    handleRegionChange,
    handleCityChange,
    handleInnChange,
    handlePhoneChange,
    handleEmployeesCountChange,
    handleWebsiteUrlChange,
    handleDescriptionChange,
    handleBrandAdd,
    handleBrandRemove,
    handleBrandUpdate,
    handleCertificateRemove,
    handleDocumentRemove,
    handleLogoFileUploaded,
    handleCertificateFileUploaded,
    handleDocumentFileUploaded,
  ] = useUnit([
    $name,
    $region,
    $city,
    $inn,
    $phone,
    $employeesCount,
    $websiteUrl,
    $logoUrl,
    $description,
    $brands,
    $certificateUrls,
    $documentUrls,
    $pending,
    formSubmitted,
    editingCancelled,
    companyFieldChanged.name,
    companyFieldChanged.region,
    companyFieldChanged.city,
    companyFieldChanged.inn,
    companyFieldChanged.phone,
    companyFieldChanged.employeesCount,
    companyFieldChanged.websiteUrl,
    companyFieldChanged.description,
    brandAdded,
    brandRemoved,
    brandUpdated,
    certificateRemoved,
    documentRemoved,
    companyFieldChanged.logoFile,
    companyFieldChanged.certificateFile,
    companyFieldChanged.documentFile,
  ]);

  const viewer = useUnit($viewer);

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Редактирование профиля</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={pending}>
            <X className="mr-2 h-4 w-4" />
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general" disabled={pending}>
            Основная информация
          </TabsTrigger>
          <TabsTrigger value="media" disabled={pending}>
            Медиа и документы
          </TabsTrigger>
        </TabsList>

        {/* Вкладка с основной информацией */}
        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Левая колонка с логотипом */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Логотип компании</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-muted flex items-center justify-center">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`Логотип ${name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground text-center p-4">Нет логотипа</div>
                  )}
                </div>

                <div className="w-full">
                  <UploadPhoto
                    entityId={viewer?.company?._id}
                    entityType={UserRole.Company}
                    fileType={FileType.LOGO}
                    onSuccess={handleLogoFileUploaded}
                    className="mb-4"
                    disabled={pending}
                  />

                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    Рекомендуемый размер: 400x400 пикселей
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Правая колонка с основной информацией */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Информация о компании</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Название компании</Label>
                  <Input
                    id="company-name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="ООО 'Название компании'"
                    required
                    disabled={pending}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-region">Регион</Label>
                    <Input
                      id="company-region"
                      value={region}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      placeholder="Например: Московская область"
                      required
                      disabled={pending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-city">Город</Label>
                    <Input
                      id="company-city"
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      placeholder="Например: Москва"
                      required
                      disabled={pending}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-inn">ИНН</Label>
                    <Input
                      id="company-inn"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={inn}
                      onChange={(e) => {
                        // Разрешаем только цифры
                        if (/^\d*$/.test(e.target.value)) {
                          handleInnChange(Number(e.target.value));
                        }
                      }}
                      placeholder="10 или 12 цифр"
                      required
                      disabled={pending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Телефон</Label>
                    <Input
                      id="company-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+7 (XXX) XXX-XX-XX"
                      required
                      disabled={pending}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-website">Веб-сайт</Label>
                    <Input
                      id="company-website"
                      type="url"
                      value={websiteUrl || ""}
                      onChange={(e) => handleWebsiteUrlChange(e.target.value)}
                      placeholder="https://example.com"
                      disabled={pending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-members">Количество сотрудников</Label>
                    <Input
                      id="company-members"
                      type="number"
                      value={employeesCount || ""}
                      onChange={(e) => handleEmployeesCountChange(Number(e.target.value))}
                      placeholder="Например: 150"
                      disabled={pending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-description">Описание компании</Label>
                  <Textarea
                    id="company-description"
                    value={description || ""}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder="Расскажите о вашей компании..."
                    rows={4}
                    disabled={pending}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Бренды компании</Label>
                  {brands?.map((brand, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        value={brand}
                        onChange={(e) =>
                          handleBrandUpdate({
                            index,
                            value: e.target.value,
                          })
                        }
                        placeholder="Название бренда"
                        disabled={pending}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleBrandRemove(index)}
                        disabled={pending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleBrandAdd}
                    className="mt-2"
                    disabled={pending}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить бренд
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Вкладка с медиа и документами */}
        <TabsContent value="media">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Сертификаты - заменяем на UploadDocuments */}
            <UploadDocuments
              entityId={viewer?.company?._id ?? ""}
              entityType={UserRole.Company}
              fileType={FileType.CERTIFICATE}
              title="Сертификаты компании"
              initialFiles={certificateUrls?.map((url, index) => ({
                id: `cert-${index}`,
                name: `Сертификат ${index + 1}`,
                url,
                size: 0,
                type: "image/jpeg",
              }))}
              onSuccess={(files) => {
                files.forEach((file) => {
                  handleCertificateFileUploaded(file.url);
                });
              }}
              onDelete={(fileId) => {
                const index = certificateUrls?.findIndex((_, idx) => `cert-${idx}` === fileId);
                if (index !== undefined && index >= 0) {
                  handleCertificateRemove(index);
                }
              }}
              disabled={pending}
              className="md:col-span-1"
            />

            {/* Документы - заменяем на UploadDocuments */}
            <UploadDocuments
              entityId={viewer?.company?._id ?? ""}
              entityType={UserRole.Company}
              fileType={FileType.DOCUMENT}
              title="Документы компании"
              initialFiles={documentUrls?.map((url, index) => ({
                id: `doc-${index}`,
                name: `Документ ${index + 1}`,
                url,
                size: 0,
                type: "application/pdf",
              }))}
              onSuccess={(files) => {
                files.forEach((file) => {
                  handleDocumentFileUploaded(file.url);
                });
              }}
              onDelete={(fileId) => {
                const index = documentUrls?.findIndex((_, idx) => `doc-${idx}` === fileId);
                if (index !== undefined && index >= 0) {
                  handleDocumentRemove(index);
                }
              }}
              disabled={pending}
              className="md:col-span-1"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const CompanyProfilePage = () => {
  const [company, isEditing, handleStartEditing] = useUnit([$company, $isEditing, editingStarted]);

  if (isEditing) {
    return <CompanyProfileEdit />;
  }

  if (!company) {
    return (
      <div className="container mx-auto py-6 px-4 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Профиль компании</h1>
        <Button onClick={handleStartEditing}>
          <Edit className="mr-2 h-4 w-4" />
          Редактировать
        </Button>
      </div>

      <CompanyProfileView company={company} />
    </div>
  );
};
