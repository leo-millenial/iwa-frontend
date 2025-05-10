import { useUnit } from "effector-react";
import { Edit, Loader2, PlusCircle, Save, Trash2, X } from "lucide-react";

import { UploadPhoto } from "@/features/upload/";

import { CompanyProfileView } from "@/entities/company/profile/view/ui.tsx";

import { FileType } from "@/shared/types/file.interface";
import { UserRole } from "@/shared/types/user.interface";
import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card.tsx";
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
  certificateAdded,
  certificateRemoved,
  certificateUpdated,
  companyFieldChanged,
  documentAdded,
  documentRemoved,
  documentUpdated,
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
    handleCertificateAdd,
    handleCertificateRemove,
    handleCertificateUpdate,
    handleDocumentAdd,
    handleDocumentRemove,
    handleDocumentUpdate,
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
    certificateAdded,
    certificateRemoved,
    certificateUpdated,
    documentAdded,
    documentRemoved,
    documentUpdated,
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
          {/*<TabsTrigger value="media" disabled={pending}>*/}
          {/*  Медиа и документы*/}
          {/*</TabsTrigger>*/}
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
            {/* Сертификаты */}
            <Card>
              <CardHeader>
                <CardTitle>Сертификаты</CardTitle>
                <CardDescription>
                  Добавьте сертификаты, лицензии и другие документы, подтверждающие квалификацию
                  вашей компании
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {certificateUrls?.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={url}
                      onChange={(e) =>
                        handleCertificateUpdate({
                          index,
                          value: e.target.value,
                        })
                      }
                      placeholder="URL сертификата"
                      disabled={pending}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCertificateRemove(index)}
                      disabled={pending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCertificateAdd}
                    className="w-full"
                    disabled={pending}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить URL сертификата
                  </Button>

                  <div className="text-sm text-muted-foreground mb-2">или загрузите файл:</div>

                  <UploadPhoto
                    entityType={UserRole.Company}
                    fileType={FileType.CERTIFICATE}
                    onSuccess={handleCertificateFileUploaded}
                    className="w-full"
                    disabled={pending}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Документы */}
            <Card>
              <CardHeader>
                <CardTitle>Документы</CardTitle>
                <CardDescription>
                  Добавьте документы, которые могут быть полезны для соискателей (презентации,
                  брошюры и т.д.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {documentUrls?.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={url}
                      onChange={(e) =>
                        handleDocumentUpdate({
                          index,
                          value: e.target.value,
                        })
                      }
                      placeholder="URL документа"
                      disabled={pending}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDocumentRemove(index)}
                      disabled={pending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDocumentAdd}
                    className="w-full"
                    disabled={pending}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить URL документа
                  </Button>

                  <div className="text-sm text-muted-foreground mb-2">или загрузите файл:</div>

                  <UploadPhoto
                    entityType={UserRole.Company}
                    fileType={FileType.DOCUMENT}
                    onSuccess={handleDocumentFileUploaded}
                    className="w-full"
                    disabled={pending}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Основной компонент страницы профиля компании
export const CompanyProfilePage = () => {
  const [isEditing, pending, handleEditStart] = useUnit([$isEditing, $pending, editingStarted]);

  const company = useUnit($company);

  // Загружаем данные компании при монтировании компонента

  if (isEditing) {
    return <CompanyProfileEdit />;
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Профиль компании</h1>
        <Button onClick={handleEditStart} disabled={pending}>
          <Edit className="mr-2 h-4 w-4" />
          Редактировать
        </Button>
      </div>

      {company ? (
        <CompanyProfileView company={company} />
      ) : (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};
