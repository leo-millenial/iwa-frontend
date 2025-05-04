import { useUnit } from "effector-react";
import { Edit, PlusCircle, Save, Trash2, Upload, X } from "lucide-react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { CompanyProfileView } from "@/entities/company/profile";

import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs.tsx";
import { Textarea } from "@/shared/ui/textarea.tsx";

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
    handleSave,
    handleCancel,
    handleNameChange,
    handleRegionChange,
    handleCityChange,
    handleInnChange,
    handlePhoneChange,
    handleEmployeesCountChange,
    handleWebsiteUrlChange,
    handleLogoUrlChange,
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
    formSubmitted,
    editingCancelled,
    companyFieldChanged.name,
    companyFieldChanged.region,
    companyFieldChanged.city,
    companyFieldChanged.inn,
    companyFieldChanged.phone,
    companyFieldChanged.employeesCount,
    companyFieldChanged.websiteUrl,
    companyFieldChanged.logoUrl,
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
  ]);

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Редактирование профиля</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Отмена
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Сохранить
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Основная информация</TabsTrigger>
          <TabsTrigger value="media">Медиа и документы</TabsTrigger>
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
                  <Label htmlFor="logo-url">URL логотипа</Label>
                  <Input
                    id="logo-url"
                    value={logoUrl || ""}
                    onChange={(e) => handleLogoUrlChange(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="mb-2"
                  />
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Загрузить логотип
                  </Button>
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
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleBrandRemove(index)}
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCertificateRemove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCertificateAdd}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Добавить сертификат
                </Button>
              </CardContent>
            </Card>

            {/* Документы */}
            <Card>
              <CardHeader>
                <CardTitle>Документы</CardTitle>
                <CardDescription>
                  Добавьте юридические документы, презентации и другие материалы о вашей компании
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDocumentRemove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDocumentAdd}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Добавить документ
                </Button>
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
  const [company, isEditing, handleEditClick] = useUnit([$company, $isEditing, editingStarted]);

  if (!company) {
    return (
      <LayoutCompany>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">Загрузка профиля компании...</h2>
                <p className="text-muted-foreground">Пожалуйста, подождите</p>
              </div>
            </div>
          </div>
        </div>
      </LayoutCompany>
    );
  }

  return (
    <LayoutCompany>
      {isEditing ? (
        <CompanyProfileEdit />
      ) : (
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Профиль компании</h1>
            <Button onClick={handleEditClick}>
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </Button>
          </div>

          <CompanyProfileView company={company} />
        </div>
      )}
    </LayoutCompany>
  );
};
