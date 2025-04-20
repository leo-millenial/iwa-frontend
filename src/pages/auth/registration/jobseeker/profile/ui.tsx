import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Upload } from "lucide-react";
import { useState } from "react";

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
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [gender, setGender] = useState("male");
  const [currency, setCurrency] = useState("RUB");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Форма отправлена");
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Фото профиля */}
              <div className="space-y-2">
                <Label>Фото профиля</Label>
                <div className="flex justify-center">
                  <div className="relative w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-input">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>

              {/* Пол */}
              <div className="space-y-2">
                <Label>Пол</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Мужчина</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
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
                      selected={birthDate}
                      onSelect={setBirthDate}
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
                <Input id="lastName" name="lastName" placeholder="Введите фамилию" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">Имя</Label>
                <Input id="firstName" name="firstName" placeholder="Введите имя" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Отчество</Label>
                <Input id="middleName" name="middleName" placeholder="Введите отчество" />
              </div>

              {/* Желаемая должность */}
              <div className="space-y-2">
                <Label htmlFor="position">Желаемая должность</Label>
                <Input id="position" name="position" placeholder="Введите желаемую должность" />
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
                  />

                  <Select value={currency} onValueChange={setCurrency}>
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
