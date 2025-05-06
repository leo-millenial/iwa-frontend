import { X } from "lucide-react";
import { useState } from "react";

import { IResume } from "@/shared/types/resume.interface.ts";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

interface AdditionalInfoTabProps {
  resume: IResume;
  setResume: React.Dispatch<React.SetStateAction<IResume>>;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AdditionalInfoTab = ({ resume, setResume, onPrev }: AdditionalInfoTabProps) => {
  const [newCertificate, setNewCertificate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Обработчик добавления сертификата
  const handleAddCertificate = () => {
    if (!newCertificate.trim()) {
      setErrors({ certificate: "Введите название сертификата" });
      return;
    }

    setResume((prev) => ({
      ...prev,
      certificates: [...(prev.certificates || []), newCertificate.trim()],
    }));
    setNewCertificate("");
    setErrors({});
  };

  // Обработчик удаления сертификата
  const handleRemoveCertificate = (index: number) => {
    setResume((prev) => ({
      ...prev,
      certificates: prev.certificates?.filter((_, i) => i !== index),
    }));
  };

  // Обработчик изменения поля "О себе"
  const handleAboutMeChange = (value: string) => {
    setResume((prev) => ({
      ...prev,
      aboutMe: value,
    }));
  };

  // Обработчик нажатия Enter в поле ввода сертификата
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCertificate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Дополнительная информация</CardTitle>
        <CardDescription>
          Добавьте информацию о себе и ваших сертификатах, чтобы выделиться среди других кандидатов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* О себе */}
        <div className="space-y-2">
          <Label htmlFor="aboutMe">О себе</Label>
          <Textarea
            id="aboutMe"
            value={resume.aboutMe || ""}
            onChange={(e) => handleAboutMeChange(e.target.value)}
            placeholder="Расскажите о себе, своих сильных сторонах и достижениях"
            className="min-h-[150px]"
          />
          <p className="text-sm text-muted-foreground">
            Это поле поможет работодателям лучше узнать вас как специалиста. Расскажите о своих
            профессиональных качествах, достижениях и целях.
          </p>
        </div>

        {/* Сертификаты */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="certificates">Сертификаты и курсы</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Добавьте информацию о пройденных курсах и полученных сертификатах
            </p>
          </div>

          {/* Список добавленных сертификатов */}
          {resume.certificates && resume.certificates.length > 0 && (
            <div className="space-y-2">
              {resume.certificates.map((certificate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <span>{certificate}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCertificate(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Форма добавления сертификата */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="newCertificate"
                value={newCertificate}
                onChange={(e) => setNewCertificate(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Например: Сертификат React Developer"
                className={errors.certificate ? "border-red-500" : ""}
              />
              {errors.certificate && (
                <p className="text-red-500 text-sm mt-1">{errors.certificate}</p>
              )}
            </div>
            <Button type="button" onClick={handleAddCertificate}>
              Добавить
            </Button>
          </div>
        </div>

        {/* Кнопки навигации */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrev}>
            Назад
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
