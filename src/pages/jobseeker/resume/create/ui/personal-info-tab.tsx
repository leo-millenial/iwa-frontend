import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Upload, Video, X } from "lucide-react";
import { useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import { IFullName, IResume, Income, genderLabels } from "../ui";

interface PersonalInfoTabProps {
  resume: IResume;
  setResume: React.Dispatch<React.SetStateAction<IResume>>;
  onNext: () => void;
}

export const PersonalInfoTab = ({ resume, setResume, onNext }: PersonalInfoTabProps) => {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Обработчики изменения основных данных резюме
  const handlePersonalInfoChange = (field: keyof IResume, value: any) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  const handleFullNameChange = (field: keyof IFullName, value: string) => {
    setResume((prev) => ({
      ...prev,
      fullName: { ...prev.fullName, [field]: value } as IFullName,
    }));
  };

  const handleIncomeChange = (field: keyof Income, value: any) => {
    setResume((prev) => ({
      ...prev,
      income: { ...prev.income, [field]: value } as Income,
    }));
  };

  // Обработчик загрузки фото профиля
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];

    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      setPhotoError("Пожалуйста, загрузите изображение");
      return;
    }

    // Проверка размера файла (не более 5 МБ)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Размер файла не должен превышать 5 МБ");
      return;
    }

    // Создаем локальный URL для изображения
    const photoUrl = URL.createObjectURL(file);
    handlePersonalInfoChange("photo", photoUrl);
  };

  // Обработчик удаления фото профиля
  const handleRemovePhoto = () => {
    // Если фото было создано через URL.createObjectURL, нужно освободить ресурсы
    if (resume.photo && resume.photo.startsWith("blob:")) {
      URL.revokeObjectURL(resume.photo);
    }
    handlePersonalInfoChange("photo", undefined);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  // Обработчик загрузки видео
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoError(null);
    const file = e.target.files?.[0];

    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith("video/")) {
      setVideoError("Пожалуйста, загрузите видео");
      return;
    }

    // Проверка размера файла (не более 50 МБ)
    if (file.size > 50 * 1024 * 1024) {
      setVideoError("Размер файла не должен превышать 50 МБ");
      return;
    }

    // Для видео создаем локальный URL
    const videoUrl = URL.createObjectURL(file);
    handlePersonalInfoChange("video", videoUrl);
  };

  // Обработчик удаления видео
  const handleRemoveVideo = () => {
    // Если видео было создано через URL.createObjectURL, нужно освободить ресурсы
    if (resume.video && resume.video.startsWith("blob:")) {
      URL.revokeObjectURL(resume.video);
    }
    handlePersonalInfoChange("video", undefined);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  // Получение инициалов для аватара
  const getInitials = () => {
    const firstName = resume.fullName?.firstName || "";
    const lastName = resume.fullName?.lastName || "";

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    }

    return "U";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Личная информация</CardTitle>
        <CardDescription>Укажите основную информацию о себе для работодателей</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Блок для загрузки фото профиля */}
        <div className="space-y-4">
          <Label>Фото профиля</Label>
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={resume.photo} />
                <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
              </Avatar>
              {resume.photo && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 rounded-full h-6 w-6"
                  onClick={handleRemovePhoto}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex flex-col items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => photoInputRef.current?.click()}
                className="mb-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {resume.photo ? "Заменить фото" : "Загрузить фото"}
              </Button>
              <input
                type="file"
                ref={photoInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
              {photoError && <p className="text-destructive text-sm mt-1">{photoError}</p>}
              <p className="text-xs text-muted-foreground text-center mt-1">
                Рекомендуемый формат: JPG, PNG. Размер до 5 МБ.
              </p>
            </div>
          </div>
        </div>

        {/* Блок для загрузки видео */}
        <div className="space-y-4">
          <Label>Видео-презентация</Label>
          <div className="flex flex-col items-center">
            {resume.video ? (
              <div className="relative w-full max-w-md mb-4">
                <video
                  src={resume.video}
                  controls
                  className="w-full aspect-video object-cover rounded-md border border-input"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={handleRemoveVideo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="w-full max-w-md aspect-video bg-muted flex flex-col items-center justify-center mb-4 rounded-md border border-input">
                <Video className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Загрузите видео-презентацию о себе</p>
              </div>
            )}

            <div className="flex flex-col items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                className="mb-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {resume.video ? "Заменить видео" : "Загрузить видео"}
              </Button>
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleVideoUpload}
                accept="video/*"
                className="hidden"
              />
              {videoError && <p className="text-destructive text-sm mt-1">{videoError}</p>}
              <p className="text-xs text-muted-foreground text-center mt-1">
                Короткое видео о себе, до 50 МБ. Расскажите о своих навыках и опыте.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Имя *</Label>
            <Input
              id="firstName"
              value={resume.fullName?.firstName || ""}
              onChange={(e) => handleFullNameChange("firstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Фамилия</Label>
            <Input
              id="lastName"
              value={resume.fullName?.lastName || ""}
              onChange={(e) => handleFullNameChange("lastName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patronymic">Отчество</Label>
            <Input
              id="patronymic"
              value={resume.fullName?.patronymic || ""}
              onChange={(e) => handleFullNameChange("patronymic", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="position">Желаемая должность *</Label>
            <Input
              id="position"
              value={resume.position || ""}
              onChange={(e) => handlePersonalInfoChange("position", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Город проживания</Label>
            <Input
              id="city"
              value={resume.city || ""}
              onChange={(e) => handlePersonalInfoChange("city", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="birthDate">Дата рождения</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !resume.birthDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {resume.birthDate ? (
                    format(resume.birthDate, "PPP", { locale: ru })
                  ) : (
                    <span>Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={resume.birthDate}
                  onSelect={(date) => handlePersonalInfoChange("birthDate", date)}
                  initialFocus
                  locale={ru}
                  captionLayout="dropdown-buttons"
                  fromYear={1940}
                  toYear={new Date().getFullYear() - 14}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Пол</Label>
            <RadioGroup
              value={resume.gender?.toString() || ""}
              onValueChange={(value) =>
                handlePersonalInfoChange("gender", value ? parseInt(value) : undefined)
              }
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={resume.email || ""}
              onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              value={resume.phone || ""}
              onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Желаемая зарплата</Label>
            <div className="grid grid-cols-7 gap-2">
              <Input
                type="number"
                placeholder="Сумма"
                value={resume.income?.amount || ""}
                onChange={(e) => handleIncomeChange("amount", Number(e.target.value))}
                className="col-span-5"
              />
              <Select
                value={resume.income?.currency?.toString() || "RUB"}
                onValueChange={(value) => handleIncomeChange("currency", value)}
                className="col-span-2"
              >
                <SelectTrigger>
                  <SelectValue placeholder="₽" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUB">₽</SelectItem>
                  <SelectItem value="USD">$</SelectItem>
                  <SelectItem value="EUR">€</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aboutMe">О себе</Label>
          <Textarea
            id="aboutMe"
            placeholder="Расскажите о себе, своих навыках и опыте работы"
            value={resume.aboutMe || ""}
            onChange={(e) => handlePersonalInfoChange("aboutMe", e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={onNext}>
            Далее
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
