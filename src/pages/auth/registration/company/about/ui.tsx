import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export interface ICompany {
  name: string;
  region: string;
  city: string;
  inn: number | string;
  brands?: string[];
  phone: string;
}

export const AuthRegistrationCompanyAboutPage = () => {
  // Состояние для формы
  const [company, setCompany] = useState<ICompany>({
    name: "",
    region: "",
    city: "",
    inn: "",
    brands: [""],
    phone: "",
  });

  // Обработчики изменения полей
  const handleInputChange = (field: keyof ICompany, value: string) => {
    setCompany({ ...company, [field]: value });
  };

  // Обработчики для брендов
  const addBrand = () => {
    setCompany({
      ...company,
      brands: [...(company.brands || []), ""],
    });
  };

  const removeBrand = (index: number) => {
    const newBrands = [...(company.brands || [])];
    newBrands.splice(index, 1);
    setCompany({
      ...company,
      brands: newBrands,
    });
  };

  const updateBrand = (index: number, value: string) => {
    const newBrands = [...(company.brands || [])];
    newBrands[index] = value;
    setCompany({
      ...company,
      brands: newBrands,
    });
  };

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Фильтруем пустые бренды перед отправкой
    const filteredBrands = company.brands?.filter((brand) => brand.trim() !== "") || [];

    // Преобразуем ИНН в число, если это возможно
    const formattedCompany = {
      ...company,
      brands: filteredBrands,
      inn: company.inn ? Number(company.inn) : "",
    };

    console.log("Данные компании:", formattedCompany);
    // Здесь будет логика отправки данных на сервер
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Информация о компании</h1>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Название компании</Label>
              <Input
                id="company-name"
                value={company.name}
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
                  value={company.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  placeholder="Например: Московская область"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-city">Город</Label>
                <Input
                  id="company-city"
                  value={company.city}
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
                  value={company.inn}
                  onChange={(e) => {
                    // Разрешаем только цифры
                    if (/^\d*$/.test(e.target.value)) {
                      handleInputChange("inn", e.target.value);
                    }
                  }}
                  placeholder="10 или 12 цифр"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  ИНН должен содержать 10 цифр для юридических лиц или 12 цифр для ИП
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-phone">Телефон</Label>
                <Input
                  id="company-phone"
                  type="tel"
                  value={company.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+7 (XXX) XXX-XX-XX"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Бренды компании</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Укажите бренды, под которыми работает ваша компания (если есть)
            </p>

            <div className="max-h-[200px] overflow-y-auto pr-1 space-y-2 rounded-md">
              {company.brands &&
                company.brands.map((brand, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={brand}
                      onChange={(e) => updateBrand(index, e.target.value)}
                      placeholder={`Бренд ${index + 1}`}
                    />
                    {company.brands && company.brands.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBrand(index)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
            </div>

            <Button type="button" variant="outline" onClick={addBrand} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить бренд
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4">
          <Button type="submit" className="w-full">
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
};
