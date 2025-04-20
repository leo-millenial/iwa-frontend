import { Edit, ExternalLink, PlusCircle, Save, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";

import { LayoutCompany } from "@/layouts/company-layout.tsx";

import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { Separator } from "@/shared/ui/separator.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs.tsx";
import { Textarea } from "@/shared/ui/textarea.tsx";

// Интерфейс для подписки компании
interface ICompanySubscription {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// Интерфейс компании
interface ICompany {
  logoUrl?: string;
  certificateUrls?: string[];
  documentUrls?: string[];
  video?: string; // видео презентация о компании
  name: string;
  region: string;
  city: string;
  inn: number | string;
  brands?: string[];
  phone: string;
  subscriptions?: ICompanySubscription[];
  membersCount: number; // количество сотрудников
  websiteUrl: string;
  description?: string;
}

export const CompanyProfilePage = () => {
  // Начальные данные компании (в реальном приложении будут загружаться с сервера)
  const [company, setCompany] = useState<ICompany>({
    name: "ООО Рога и Копыта",
    region: "Московская область",
    city: "Москва",
    inn: "7712345678",
    phone: "+7 (999) 123-45-67",
    brands: ["Бренд 1", "Бренд 2"],
    membersCount: 150,
    websiteUrl: "https://example.com",
    logoUrl: "https://via.placeholder.com/150",
    certificateUrls: ["https://via.placeholder.com/300x400"],
    documentUrls: ["https://via.placeholder.com/300x400"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Наша компания занимается разработкой инновационных решений в области IT.",
    subscriptions: [
      {
        id: "1",
        name: "Базовый план",
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 11, 31),
        isActive: true,
      },
    ],
  });

  // Состояние для режима редактирования
  const [isEditing, setIsEditing] = useState(false);

  // Временное состояние для редактирования
  const [editedCompany, setEditedCompany] = useState<ICompany>({ ...company });

  // Обработчик изменения полей
  const handleInputChange = (field: keyof ICompany, value: unknown) => {
    setEditedCompany({ ...editedCompany, [field]: value });
  };

  // Обработчики для брендов
  const addBrand = () => {
    setEditedCompany({
      ...editedCompany,
      brands: [...(editedCompany.brands || []), ""],
    });
  };

  const removeBrand = (index: number) => {
    const newBrands = [...(editedCompany.brands || [])];
    newBrands.splice(index, 1);
    setEditedCompany({
      ...editedCompany,
      brands: newBrands,
    });
  };

  const updateBrand = (index: number, value: string) => {
    const newBrands = [...(editedCompany.brands || [])];
    newBrands[index] = value;
    setEditedCompany({
      ...editedCompany,
      brands: newBrands,
    });
  };

  // Обработчики для сертификатов и документов
  const addCertificate = () => {
    setEditedCompany({
      ...editedCompany,
      certificateUrls: [...(editedCompany.certificateUrls || []), ""],
    });
  };

  const removeCertificate = (index: number) => {
    const newCertificates = [...(editedCompany.certificateUrls || [])];
    newCertificates.splice(index, 1);
    setEditedCompany({
      ...editedCompany,
      certificateUrls: newCertificates,
    });
  };

  const updateCertificate = (index: number, value: string) => {
    const newCertificates = [...(editedCompany.certificateUrls || [])];
    newCertificates[index] = value;
    setEditedCompany({
      ...editedCompany,
      certificateUrls: newCertificates,
    });
  };

  const addDocument = () => {
    setEditedCompany({
      ...editedCompany,
      documentUrls: [...(editedCompany.documentUrls || []), ""],
    });
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...(editedCompany.documentUrls || [])];
    newDocuments.splice(index, 1);
    setEditedCompany({
      ...editedCompany,
      documentUrls: newDocuments,
    });
  };

  const updateDocument = (index: number, value: string) => {
    const newDocuments = [...(editedCompany.documentUrls || [])];
    newDocuments[index] = value;
    setEditedCompany({
      ...editedCompany,
      documentUrls: newDocuments,
    });
  };

  // Начать редактирование
  const startEditing = () => {
    setEditedCompany({ ...company });
    setIsEditing(true);
  };

  // Сохранить изменения
  const saveChanges = () => {
    // Фильтруем пустые бренды перед сохранением
    const filteredBrands = editedCompany.brands?.filter((brand) => brand.trim() !== "") || [];

    // Обновляем данные компании
    setCompany({
      ...editedCompany,
      brands: filteredBrands,
    });

    setIsEditing(false);

    // Здесь будет логика отправки данных на сервер
    console.log("Сохранены данные компании:", editedCompany);
  };

  // Отменить редактирование
  const cancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <LayoutCompany>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Профиль компании</h1>
          {!isEditing ? (
            <Button onClick={startEditing}>
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={cancelEditing}>
                <X className="mr-2 h-4 w-4" />
                Отмена
              </Button>
              <Button onClick={saveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </Button>
            </div>
          )}
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
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={`Логотип ${company.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground text-center p-4">Нет логотипа</div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="w-full">
                      <Label htmlFor="logo-url">URL логотипа</Label>
                      <Input
                        id="logo-url"
                        value={editedCompany.logoUrl || ""}
                        onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="mb-2"
                      />
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Загрузить логотип
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Правая колонка с основной информацией */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Информация о компании</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Название компании</Label>
                        <Input
                          id="company-name"
                          value={editedCompany.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="ООО 'Название компании'"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company-region">Регион</Label>
                          <Input
                            id="company-region"
                            value={editedCompany.region}
                            onChange={(e) => handleInputChange("region", e.target.value)}
                            placeholder="Например: Московская область"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company-city">Город</Label>
                          <Input
                            id="company-city"
                            value={editedCompany.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
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
                            value={editedCompany.inn}
                            onChange={(e) => {
                              // Разрешаем только цифры
                              if (/^\d*$/.test(e.target.value)) {
                                handleInputChange("inn", e.target.value);
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
                            value={editedCompany.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
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
                            value={editedCompany.websiteUrl}
                            onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                            placeholder="https://example.com"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company-members">Количество сотрудников</Label>
                          <Input
                            id="company-members"
                            type="number"
                            value={editedCompany.membersCount}
                            onChange={(e) =>
                              handleInputChange("membersCount", parseInt(e.target.value))
                            }
                            placeholder="Например: 150"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company-description">Описание компании</Label>
                        <Textarea
                          id="company-description"
                          value={editedCompany.description || ""}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Расскажите о вашей компании..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Бренды компании</Label>
                        {editedCompany.brands?.map((brand, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                            <Input
                              value={brand}
                              onChange={(e) => updateBrand(index, e.target.value)}
                              placeholder="Название бренда"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBrand(index)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addBrand} className="mt-2">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Добавить бренд
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Название
                          </h3>
                          <p className="text-base">{company.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Местоположение
                          </h3>
                          <p className="text-base">
                            {company.city}, {company.region}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">ИНН</h3>
                          <p className="text-base">{company.inn}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Телефон
                          </h3>
                          <p className="text-base">{company.phone}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Веб-сайт
                          </h3>
                          <a
                            href={company.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base text-primary flex items-center hover:underline"
                          >
                            {company.websiteUrl}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">
                            Количество сотрудников
                          </h3>
                          <p className="text-base">{company.membersCount}</p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">
                          Описание компании
                        </h3>
                        <p className="text-base">{company.description || "Описание отсутствует"}</p>
                      </div>

                      {company.brands && company.brands.length > 0 && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">
                              Бренды компании
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {company.brands.map((brand, index) => (
                                <div
                                  key={index}
                                  className="bg-muted px-3 py-1 rounded-full text-sm"
                                >
                                  {brand}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Вкладка с медиа и документами */}
          <TabsContent value="media">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Видео презентация */}
              <Card>
                <CardHeader>
                  <CardTitle>Видео презентация</CardTitle>
                  <CardDescription>
                    Видео о вашей компании для привлечения соискателей
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="company-video">URL видео (YouTube, Vimeo и т.д.)</Label>
                      <Input
                        id="company-video"
                        value={editedCompany.video || ""}
                        onChange={(e) => handleInputChange("video", e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Укажите ссылку на видео в формате embed URL
                      </p>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-md overflow-hidden bg-muted">
                      {company.video ? (
                        <iframe
                          src={company.video}
                          title="Видео презентация компании"
                          className="w-full h-full"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          Видео не добавлено
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Сертификаты */}
              <Card>
                <CardHeader>
                  <CardTitle>Сертификаты</CardTitle>
                  <CardDescription>Сертификаты и награды вашей компании</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      {editedCompany.certificateUrls?.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <Input
                            value={url}
                            onChange={(e) => updateCertificate(index, e.target.value)}
                            placeholder="URL сертификата"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCertificate(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addCertificate}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить сертификат
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {company.certificateUrls && company.certificateUrls.length > 0 ? (
                        company.certificateUrls.map((url, index) => (
                          <div
                            key={index}
                            className="aspect-[3/4] bg-muted rounded-md overflow-hidden"
                          >
                            <img
                              src={url}
                              alt={`Сертификат ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 flex items-center justify-center h-40 text-muted-foreground bg-muted rounded-md">
                          Сертификаты не добавлены
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Документы */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Документы компании</CardTitle>
                  <CardDescription>Юридические документы и лицензии</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      {editedCompany.documentUrls?.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <Input
                            value={url}
                            onChange={(e) => updateDocument(index, e.target.value)}
                            placeholder="URL документа"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDocument(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addDocument}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить документ
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {company.documentUrls && company.documentUrls.length > 0 ? (
                        company.documentUrls.map((url, index) => (
                          <div
                            key={index}
                            className="aspect-[3/4] bg-muted rounded-md overflow-hidden"
                          >
                            <img
                              src={url}
                              alt={`Документ ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-4 flex items-center justify-center h-40 text-muted-foreground bg-muted rounded-md">
                          Документы не добавлены
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutCompany>
  );
};
