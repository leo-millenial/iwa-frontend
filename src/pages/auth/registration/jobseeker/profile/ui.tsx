import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useUnit } from "effector-react";
import { CalendarIcon } from "lucide-react";

import {
  $birthDate,
  $city,
  $currency,
  $firstName,
  $formError,
  $gender,
  $lastName,
  $middleName,
  $position,
  $region,
  $salary,
  birthDateChanged,
  cityChanged,
  currencyChanged,
  firstNameChanged,
  formSubmitted,
  genderChanged,
  lastNameChanged,
  middleNameChanged,
  positionChanged,
  regionChanged,
  salaryChanged,
} from "@/pages/auth/registration/jobseeker/profile/model.ts";

import { Gender } from "@/shared/types/resume.interface.ts";
import { Button } from "@/shared/ui/button.tsx";
import { Calendar } from "@/shared/ui/calendar.tsx";
import { Input } from "@/shared/ui/input.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { LogoLink } from "@/shared/ui/logo-link.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover.tsx";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select.tsx";

export const AuthRegistrationJobseekerProfilePage = () => {
  const {
    birthDate,
    gender,
    currency,
    firstName,
    lastName,
    middleName,
    position,
    salary,
    formError,
    city,
    region,
    handleBirthDateChange,
    handleGenderChange,
    handleCurrencyChange,
    handleFirstNameChange,
    handleLastNameChange,
    handleMiddleNameChange,
    handlePositionChange,
    handleSalaryChange,
    handleSubmit,
    handleRegionChange,
    handleCityChange,
  } = useUnit({
    birthDate: $birthDate,
    gender: $gender,
    currency: $currency,
    firstName: $firstName,
    lastName: $lastName,
    middleName: $middleName,
    position: $position,
    salary: $salary,
    formError: $formError,
    city: $city,
    region: $region,
    handleBirthDateChange: birthDateChanged,
    handleGenderChange: genderChanged,
    handleCurrencyChange: currencyChanged,
    handleFirstNameChange: firstNameChanged,
    handleLastNameChange: lastNameChanged,
    handleMiddleNameChange: middleNameChanged,
    handlePositionChange: positionChanged,
    handleSalaryChange: salaryChanged,
    handleSubmit: formSubmitted,
    handleCityChange: cityChanged,
    handleRegionChange: regionChanged,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center p-4 bg-background/80 backdrop-blur-sm z-10">
        <LogoLink />
      </header>

      <div className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('images/blue-background.jpg')",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 space-y-6 bg-card rounded-lg shadow-md">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Регистрация</h1>
            </div>

            {formError && (
              <div className="p-3 bg-destructive/15 text-destructive rounded-md text-sm">
                {formError === "EMPTY_FORM" && "Пожалуйста, заполните все обязательные поля"}
                {formError === "INVALID_NAME" && "Пожалуйста, введите корректные ФИО"}
                {formError === "INVALID_BIRTH_DATE" && "Пожалуйста, выберите дату рождения"}
                {formError === "INVALID_POSITION" && "Пожалуйста, укажите желаемую должность"}
                {formError === "INVALID_SALARY" && "Пожалуйста, укажите корректный доход"}
                {formError === "SERVER_ERROR" && "Произошла ошибка при отправке данных"}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Пол */}
              <div className="space-y-2">
                <Label>Пол</Label>
                <RadioGroup
                  value={gender}
                  onValueChange={handleGenderChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={Gender.Male} id="male" />
                    <Label htmlFor="male">Мужчина</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={Gender.Female} id="female" />
                    <Label htmlFor="female">Женщина</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Дата рождения */}
              <div className="space-y-2">
                <Label>Дата рождения</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !birthDate && "text-muted-foreground",
                      )}
                      type="button"
                    >
                      {birthDate ? (
                        format(birthDate, "dd.MM.yyyy", { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={birthDate || undefined}
                      onSelect={handleBirthDateChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      locale={ru}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* ФИО */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Фамилия</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Введите фамилию"
                  value={lastName}
                  onChange={(e) => handleLastNameChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">Имя</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Введите имя"
                  value={firstName}
                  onChange={(e) => handleFirstNameChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Отчество</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  placeholder="Введите отчество"
                  value={middleName}
                  onChange={(e) => handleMiddleNameChange(e.target.value)}
                />
              </div>

              {/* Желаемая должность */}
              <div className="space-y-2">
                <Label htmlFor="position">Желаемая должность</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Введите желаемую должность"
                  value={position}
                  onChange={(e) => handlePositionChange(e.target.value)}
                />
              </div>

              {/* Доход и валюта */}
              <div className="space-y-2">
                <Label htmlFor="salary">Желаемый доход</Label>
                <div className="flex space-x-2">
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    placeholder="Введите сумму"
                    className="flex-1"
                    value={salary}
                    onChange={(e) => handleSalaryChange(e.target.value)}
                  />

                  <Select value={currency} onValueChange={handleCurrencyChange}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Валюта" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RUB">RUB</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Регион и город */}
              <div className="space-y-2">
                <Label htmlFor="region">Регион</Label>
                <Input
                  id="region"
                  name="region"
                  placeholder="Введите регион"
                  value={region}
                  onChange={(e) => handleRegionChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Город</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Введите город"
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Далее
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
