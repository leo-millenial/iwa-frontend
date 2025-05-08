import { useUnit } from "effector-react";

import { $aboutMe, aboutMeChanged } from "@/pages/jobseeker/resume/create/model";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

interface AdditionalInfoTabProps {
  onPrev: () => void;
}

export const AdditionalInfoTab = ({ onPrev }: AdditionalInfoTabProps) => {
  const [aboutMe, handleAboutMeChange] = useUnit([$aboutMe, aboutMeChanged]);

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
            value={aboutMe}
            onChange={(e) => handleAboutMeChange(e.target.value)}
            placeholder="Расскажите о себе, своих сильных сторонах и достижениях"
            className="min-h-[150px]"
          />
          <p className="text-sm text-muted-foreground">
            Это поле поможет работодателям лучше узнать вас как специалиста. Расскажите о своих
            профессиональных качествах, достижениях и целях.
          </p>
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
