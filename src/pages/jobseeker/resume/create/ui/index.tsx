import { useState } from "react";

import { LayoutJobseeker } from "@/layouts/jobseeker-layout.tsx";

import { Gender, IResume, LanguageLevel, SkillLevel } from "@/shared/types/resume.interface.ts";
import { EmploymentType } from "@/shared/types/vacancy.interface.ts";
import { Button } from "@/shared/ui/button.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs.tsx";

import { AdditionalInfoTab } from "./additional-info-tab";
import { EducationTab } from "./education-tab";
import { ExperienceTab } from "./experience-tab";
import { LanguagesTab } from "./languages-tab";
import { PersonalInfoTab } from "./personal-info-tab";
import { SkillsTab } from "./skills-tab";

export const employmentTypeLabels = {
  [EmploymentType.FullTime]: "Полная занятость",
  [EmploymentType.PartTime]: "Частичная занятость",
  [EmploymentType.Remote]: "Удаленная работа",
  [EmploymentType.Office]: "Работа в офисе",
  [EmploymentType.Hybrid]: "Гибридный формат",
};

export const genderLabels = {
  [Gender.Male]: "Мужской",
  [Gender.Female]: "Женский",
};

export const skillLevelLabels = {
  [SkillLevel.Beginner]: "Начинающий",
  [SkillLevel.Intermediate]: "Средний",
  [SkillLevel.Advanced]: "Продвинутый",
};

export const languageLevelLabels = {
  [LanguageLevel.Beginner]: "Начальный",
  [LanguageLevel.Intermediate]: "Средний",
  [LanguageLevel.Advanced]: "Продвинутый",
  [LanguageLevel.Native]: "Родной",
};

export const JobseekerResumeCreatePage = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [resume, setResume] = useState<IResume>({
    workExperience: [],
    education: [],
    skills: [],
    languages: [],
    certificates: [],
  });

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Отправка резюме:", resume);
    // Здесь будет логика отправки данных на сервер
  };

  // Функция для перехода к следующему табу
  const goToNextTab = (current: string) => {
    const tabs = ["personal", "experience", "education", "skills", "languages", "additional"];
    const currentIndex = tabs.indexOf(current);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  // Функция для перехода к предыдущему табу
  const goToPrevTab = (current: string) => {
    const tabs = ["personal", "experience", "education", "skills", "languages", "additional"];
    const currentIndex = tabs.indexOf(current);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <LayoutJobseeker>
      <div className="container mx-auto py-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Создание резюме</h1>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
              <TabsTrigger value="personal">Основное</TabsTrigger>
              <TabsTrigger value="experience">Опыт работы</TabsTrigger>
              <TabsTrigger value="education">Образование</TabsTrigger>
              <TabsTrigger value="skills">Навыки</TabsTrigger>
              <TabsTrigger value="languages">Языки</TabsTrigger>
              <TabsTrigger value="additional">Дополнительно</TabsTrigger>
            </TabsList>

            {/* Основная информация */}
            <TabsContent value="personal">
              <PersonalInfoTab
                resume={resume}
                setResume={setResume}
                onNext={() => goToNextTab("personal")}
              />
            </TabsContent>

            {/* Опыт работы */}
            <TabsContent value="experience">
              <ExperienceTab
                resume={resume}
                setResume={setResume}
                onNext={() => goToNextTab("experience")}
                onPrev={() => goToPrevTab("experience")}
              />
            </TabsContent>

            {/* Образование */}
            <TabsContent value="education">
              <EducationTab
                resume={resume}
                setResume={setResume}
                onNext={() => goToNextTab("education")}
                onPrev={() => goToPrevTab("education")}
              />
            </TabsContent>

            {/* Навыки */}
            <TabsContent value="skills">
              <SkillsTab
                resume={resume}
                setResume={setResume}
                onNext={() => goToNextTab("skills")}
                onPrev={() => goToPrevTab("skills")}
              />
            </TabsContent>

            {/* Языки */}
            <TabsContent value="languages">
              <LanguagesTab
                resume={resume}
                setResume={setResume}
                onNext={() => goToNextTab("languages")}
                onPrev={() => goToPrevTab("languages")}
              />
            </TabsContent>

            {/* Дополнительная информация */}
            <TabsContent value="additional">
              <AdditionalInfoTab
                resume={resume}
                setResume={setResume}
                onPrev={() => goToPrevTab("additional")}
                onSubmit={handleSubmit}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button type="submit">Сохранить резюме</Button>
          </div>
        </form>
      </div>
    </LayoutJobseeker>
  );
};
