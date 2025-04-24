import { useUnit } from "effector-react";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { InnInput } from "@/shared/ui/inn-input.tsx";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PhoneInput } from "@/shared/ui/phone-input.tsx";

import {
  $brands,
  $city,
  $formError,
  $name,
  $pending,
  $region,
  CompanyFormError,
  brandsChanged,
  cityChanged,
  innChanged,
  nameChanged,
  phoneChanged,
  regionChanged,
  saveClicked,
} from "./model";

export interface ICompany {
  name: string;
  region: string;
  city: string;
  inn: number | string;
  brands?: string[];
  phone: string;
}

export const getCompanyErrorMessage = (error: CompanyFormError): string | null => {
  if (!error) return null;

  const errorMessages: Record<Exclude<CompanyFormError, null>, string> = {
    NAME_REQUIRED: "Название компании обязательно для заполнения",
    NAME_TOO_SHORT: "Название компании должно содержать не менее 3 символов",
    CITY_REQUIRED: "Город обязателен для заполнения",
    REGION_REQUIRED: "Регион обязателен для заполнения",
    INN_REQUIRED: "ИНН обязателен для заполнения",
    INN_INVALID_FORMAT: "ИНН должен содержать 10 цифр для юр. лиц или 12 цифр для ИП",
    BRANDS_INVALID: "Укажите хотя бы 1 бренд",
    PHONE_REQUIRED: "Номер телефона обязателен для заполнения",
    PHONE_INVALID_FORMAT: "Введите корректный российский номер телефона",
  };

  return errorMessages[error];
};

export const AuthRegistrationCompanyAboutPage = () => {
  const [name, city, region, brands, formError, pending] = useUnit([
    $name,
    $city,
    $region,
    $brands,
    $formError,
    $pending,
  ]);

  const [
    handleNameChange,
    handleCityChange,
    handleRegionChange,
    handleInnChange,
    handlePhoneChange,
    handleBrandsChange,
    handleSaveClick,
  ] = useUnit([
    nameChanged,
    cityChanged,
    regionChanged,
    innChanged,
    phoneChanged,
    brandsChanged,
    saveClicked,
  ]);

  // Обработчики для брендов
  const addBrand = () => {
    handleBrandsChange([...brands, ""]);
  };

  const removeBrand = (index: number) => {
    const newBrands = [...brands];
    newBrands.splice(index, 1);
    handleBrandsChange(newBrands);
  };

  const updateBrand = (index: number, value: string) => {
    const newBrands = [...brands];
    newBrands[index] = value;
    handleBrandsChange(newBrands);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveClick();
  };

  const errorMessage = getCompanyErrorMessage(formError);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Информация о компании</h1>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
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

                <InnInput id="company-inn" required onChange={(value) => handleInnChange(value)} />

                <p className="text-xs text-muted-foreground">
                  ИНН должен содержать 10 цифр для юридических лиц или 12 цифр для ИП
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-phone">Телефон</Label>
                <PhoneInput id="phone" onChange={(value) => handlePhoneChange(value)} />
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
              {brands.map((brand, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={brand}
                    onChange={(e) => updateBrand(index, e.target.value)}
                    placeholder={`Бренд ${index + 1}`}
                  />
                  {brands.length > 1 && (
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
          <Button disabled={pending} type="submit" className="w-full">
            {pending && <Loader2 className="animate-spin" />}
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
};
