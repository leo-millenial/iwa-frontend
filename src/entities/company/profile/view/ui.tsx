import { Separator } from "@radix-ui/react-select";
import { ExternalLink } from "lucide-react";

import { ICompany } from "@/shared/types/company.interface.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs.tsx";

export const CompanyProfileView = ({ company }: { company: ICompany }) => {
  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
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
              </CardContent>
            </Card>

            {/* Правая колонка с основной информацией */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Информация о компании</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Название</h3>
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
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Телефон</h3>
                    <p className="text-base">{company.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Веб-сайт</h3>
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
                    <p className="text-base">{company.employeesCount}</p>
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
                          <div key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
                            {brand}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
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
                <CardDescription>Сертификаты и награды вашей компании</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {company.certificateUrls && company.certificateUrls.length > 0 ? (
                    company.certificateUrls.map((url, index) => (
                      <div key={index} className="aspect-[3/4] bg-muted rounded-md overflow-hidden">
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
              </CardContent>
            </Card>

            {/* Документы */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Документы компании</CardTitle>
                <CardDescription>Юридические документы и лицензии</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {company.documentUrls && company.documentUrls.length > 0 ? (
                    company.documentUrls.map((url, index) => (
                      <div key={index} className="aspect-[3/4] bg-muted rounded-md overflow-hidden">
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
