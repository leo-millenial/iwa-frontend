import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useUnit } from "effector-react";
import { CalendarIcon } from "lucide-react";

import {
  $birthday,
  $city,
  $email,
  $fullName,
  $gender,
  $income,
  $phone,
  $photo,
  $position,
  birthdayChanged,
  cityChanged,
  emailChanged,
  genderChanged,
  incomeAmountChanged,
  incomeCurrencyChanged,
  phoneChanged,
  photoChanged,
  positionChanged,
  updateFullName,
} from "@/pages/jobseeker/resume/create/model.ts";
import { genderLabels } from "@/pages/jobseeker/resume/create/ui/index.tsx";

import { UploadPhoto } from "@/features/upload";

import { FileType } from "@/shared/types/file.interface.ts";
import { Gender } from "@/shared/types/resume.interface.ts";
import { UserRole } from "@/shared/types/user.interface.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { $viewer } from "@/shared/viewer";

interface PersonalInfoTabProps {
  onNext: () => void;
}

export const PersonalInfoTab = ({ onNext }: PersonalInfoTabProps) => {
  const viewer = useUnit($viewer);
  const [
    photo,
    position,
    gender,
    birthday,
    email,
    phone,
    city,
    fullName,
    income,
    handlePositionChange,
    handleGenderChange,
    handleBirthdayChange,
    handleEmailChange,
    handlePhoneChange,
    handleCityChange,
    handleUpdateFullName,
    handlePhotoChange,
    handleIncomeAmountChange,
    handleIncomeCurrencyChange,
  ] = useUnit([
    $photo,
    $position,
    $gender,
    $birthday,
    $email,
    $phone,
    $city,
    $fullName,
    $income,
    positionChanged,
    genderChanged,
    birthdayChanged,
    emailChanged,
    phoneChanged,
    cityChanged,
    updateFullName,
    photoChanged,
    incomeAmountChanged,
    incomeCurrencyChanged,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Основная информация</CardTitle>
        <CardDescription>Заполните основную информацию о себе для создания резюме</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Фото профиля */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={photo} alt={fullName?.firstName} />
            <AvatarFallback>
              {fullName?.firstName?.[0]}
              {fullName?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <UploadPhoto
            entityId={viewer?.jobseeker?._id}
            fileType={FileType.Photo}
            entityType={UserRole.Jobseeker}
            onSuccess={(photoId) => handlePhotoChange(photoId)}
          />
        </div>

        {/* ФИО */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Имя *</Label>
            <Input
              id="firstName"
              value={fullName?.firstName || ""}
              onChange={(e) => handleUpdateFullName({ field: "firstName", value: e.target.value })}
              placeholder="Иван"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Фамилия *</Label>
            <Input
              id="lastName"
              value={fullName?.lastName || ""}
              onChange={(e) => handleUpdateFullName({ field: "lastName", value: e.target.value })}
              placeholder="Иванов"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patronymic">Отчество</Label>
            <Input
              id="patronymic"
              value={fullName?.patronymic || ""}
              onChange={(e) => handleUpdateFullName({ field: "patronymic", value: e.target.value })}
              placeholder="Иванович"
            />
          </div>
        </div>

        {/* Пол и дата рождения */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Пол</Label>
            <RadioGroup
              value={gender || ""}
              onValueChange={(value) => handleGenderChange(value as Gender)}
              className="flex space-x-4"
            >
              {Object.entries(genderLabels).map(([value, label]) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={`gender-${value}`} />
                  <Label htmlFor={`gender-${value}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthday">Дата рождения</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="birthday"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthday && "text-muted-foreground",
                  )}
                >
                  {birthday ? (
                    format(new Date(birthday), "dd MMMM yyyy", { locale: ru })
                  ) : (
                    <span>Выберите дату</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthday ? new Date(birthday) : undefined}
                  onSelect={(date) =>
                    date ? handleBirthdayChange(date) : handleBirthdayChange(null)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email || ""}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="example@mail.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              value={phone || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>
        </div>

        {/* Город и желаемая должность */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Город *</Label>
            <Input
              id="city"
              value={city || ""}
              onChange={(e) => handleCityChange(e.target.value)}
              placeholder="Москва"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Желаемая должность *</Label>
            <Input
              id="position"
              value={position || ""}
              onChange={(e) => handlePositionChange(e.target.value)}
              placeholder="Инженер-строитель"
              required
            />
          </div>
        </div>

        {/* Зарплата */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salary">Желаемая зарплата</Label>
            <Input
              id="salary"
              type="number"
              value={income?.amount || ""}
              onChange={(event) => handleIncomeAmountChange(Number(event.target.value))}
              placeholder="200000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Валюта</Label>
            <Select
              value={income?.currency || "RUB"}
              onValueChange={(currency) => handleIncomeCurrencyChange(currency)}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Выберите валюту" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RUB">₽ Рубль</SelectItem>
                <SelectItem value="USD">$ Доллар</SelectItem>
                <SelectItem value="EUR">€ Евро</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="button" onClick={onNext}>
            Далее
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
