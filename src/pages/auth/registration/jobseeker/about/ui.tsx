import { PlusCircle, Trash2, Upload } from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

// Определение типов
enum SkillLevel {
  Beginner = "Начинающий",
  Intermediate = "Средний",
  Advanced = "Продвинутый",
  Expert = "Эксперт",
}

enum LanguageLevel {
  Beginner = "Начинающий",
  Intermediate = "Средний",
  Advanced = "Продвинутый",
  Native = "Родной",
}

interface IEducation {
  university: string;
  faculty: string;
  degree: string;
  graduationDate: Date;
}

interface ISkill {
  name: string;
  level: SkillLevel;
}

interface ILanguage {
  name: string;
  level: LanguageLevel;
}

type Sertificate = string;

export const AuthRegistrationJobseekerAboutPage = () => {
  // Состояния для формы
  const [educations, setEducations] = useState<IEducation[]>([
    {
      university: "",
      faculty: "",
      degree: "",
      graduationDate: new Date(),
    },
  ]);

  const [skills, setSkills] = useState<ISkill[]>([
    {
      name: "",
      level: SkillLevel.Beginner,
    },
  ]);

  const [languages, setLanguages] = useState<ILanguage[]>([
    {
      name: "",
      level: LanguageLevel.Beginner,
    },
  ]);

  const [aboutMe, setAboutMe] = useState("");
  const [certificates, setCertificates] = useState<Sertificate[]>([]);

  // Обработчики для добавления/удаления элементов
  const addEducation = () => {
    setEducations([
      ...educations,
      { university: "", faculty: "", degree: "", graduationDate: new Date() },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    setSkills([...skills, { name: "", level: SkillLevel.Beginner }]);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    setLanguages([...languages, { name: "", level: LanguageLevel.Beginner }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // В реальном приложении здесь будет загрузка файла на сервер
      // и получение URL. Для примера просто добавляем имя файла
      const newCertificates = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setCertificates([...certificates, ...newCertificates]);
    }
  };

  const removeCertificate = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки данных
    console.log({
      educations,
      skills,
      languages,
      aboutMe,
      certificates,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Расскажите о себе</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Образование */}
        <Card>
          <CardHeader>
            <CardTitle>Образование</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {educations.map((education, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Образование #{index + 1}</h3>
                  {educations.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`university-${index}`}>Учебное заведение</Label>
                    <Input
                      id={`university-${index}`}
                      value={education.university}
                      onChange={(e) => {
                        const newEducations = [...educations];
                        newEducations[index].university = e.target.value;
                        setEducations(newEducations);
                      }}
                      placeholder="Название университета"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`faculty-${index}`}>Факультет</Label>
                    <Input
                      id={`faculty-${index}`}
                      value={education.faculty}
                      onChange={(e) => {
                        const newEducations = [...educations];
                        newEducations[index].faculty = e.target.value;
                        setEducations(newEducations);
                      }}
                      placeholder="Факультет"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`degree-${index}`}>Степень</Label>
                    <Input
                      id={`degree-${index}`}
                      value={education.degree}
                      onChange={(e) => {
                        const newEducations = [...educations];
                        newEducations[index].degree = e.target.value;
                        setEducations(newEducations);
                      }}
                      placeholder="Бакалавр, магистр и т.д."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`graduation-${index}`}>Год окончания</Label>
                    <Input
                      id={`graduation-${index}`}
                      type="date"
                      value={
                        education.graduationDate instanceof Date
                          ? education.graduationDate.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const newEducations = [...educations];
                        newEducations[index].graduationDate = new Date(e.target.value);
                        setEducations(newEducations);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addEducation} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить образование
            </Button>
          </CardContent>
        </Card>

        {/* Навыки */}
        <Card>
          <CardHeader>
            <CardTitle>Навыки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Отображение добавленных навыков в виде тегов */}
            {skills.some((skill) => skill.name.trim()) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {skills
                  .filter((skill) => skill.name.trim())
                  .map((skill, index) => (
                    <div
                      key={index}
                      className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                      ${
                        skill.level === SkillLevel.Beginner
                          ? "bg-blue-100 text-blue-800"
                          : skill.level === SkillLevel.Intermediate
                            ? "bg-green-100 text-green-800"
                            : skill.level === SkillLevel.Advanced
                              ? "bg-purple-100 text-purple-800"
                              : "bg-red-100 text-red-800"
                      }
                    `}
                    >
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs opacity-75">• {skill.level}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 p-0 hover:bg-white/20"
                        onClick={() => removeSkill(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}

            {/* Форма добавления нового навыка */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Добавить новый навык</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-skill-name">Название навыка</Label>
                  <Input
                    id="new-skill-name"
                    placeholder="Например: TypeScript, Photoshop"
                    value={skills[skills.length - 1].name}
                    onChange={(e) => {
                      const newSkills = [...skills];
                      newSkills[newSkills.length - 1].name = e.target.value;
                      setSkills(newSkills);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-skill-level">Уровень владения</Label>
                  <Select
                    value={skills[skills.length - 1].level}
                    onValueChange={(value) => {
                      const newSkills = [...skills];
                      newSkills[newSkills.length - 1].level = value as SkillLevel;
                      setSkills(newSkills);
                    }}
                  >
                    <SelectTrigger id="new-skill-level">
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SkillLevel).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addSkill}
                className="w-full mt-4"
                disabled={!skills[skills.length - 1].name.trim()}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить навык
              </Button>
            </div>

            {/* Подсказка */}
            <div className="text-xs text-gray-500 mt-2">
              Добавьте ваши профессиональные навыки и укажите уровень владения каждым из них. Это
              поможет работодателям лучше оценить вашу квалификацию.
            </div>
          </CardContent>
        </Card>

        {/* Языки */}
        <Card>
          <CardHeader>
            <CardTitle>Языки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Отображение добавленных языков в виде тегов */}
            {languages.some((language) => language.name.trim()) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {languages
                  .filter((language) => language.name.trim())
                  .map((language, index) => (
                    <div
                      key={index}
                      className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
                      ${
                        language.level === LanguageLevel.Beginner
                          ? "bg-yellow-100 text-yellow-800"
                          : language.level === LanguageLevel.Intermediate
                            ? "bg-orange-100 text-orange-800"
                            : language.level === LanguageLevel.Advanced
                              ? "bg-teal-100 text-teal-800"
                              : "bg-indigo-100 text-indigo-800"
                      }
                    `}
                    >
                      <span className="font-medium">{language.name}</span>
                      <span className="text-xs opacity-75">• {language.level}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 p-0 hover:bg-white/20"
                        onClick={() => removeLanguage(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}

            {/* Форма добавления нового языка */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-3">Добавить новый язык</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-language-name">Язык</Label>
                  <Input
                    id="new-language-name"
                    placeholder="Например: Английский, Испанский"
                    value={languages[languages.length - 1].name}
                    onChange={(e) => {
                      const newLanguages = [...languages];
                      newLanguages[newLanguages.length - 1].name = e.target.value;
                      setLanguages(newLanguages);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-language-level">Уровень владения</Label>
                  <Select
                    value={languages[languages.length - 1].level}
                    onValueChange={(value) => {
                      const newLanguages = [...languages];
                      newLanguages[newLanguages.length - 1].level = value as LanguageLevel;
                      setLanguages(newLanguages);
                    }}
                  >
                    <SelectTrigger id="new-language-level">
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(LanguageLevel).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addLanguage}
                className="w-full mt-4"
                disabled={!languages[languages.length - 1].name.trim()}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить язык
              </Button>
            </div>

            {/* Подсказка */}
            <div className="text-xs text-gray-500 mt-2">
              Укажите языки, которыми вы владеете, и уровень владения каждым из них. Это важная
              информация для многих работодателей.
            </div>
          </CardContent>
        </Card>

        {/* О себе */}
        <Card>
          <CardHeader>
            <CardTitle>О себе</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              placeholder="Расскажите о своем опыте, интересах и целях"
              className="min-h-[150px]"
            />
          </CardContent>
        </Card>

        {/* Сертификаты */}
        <Card>
          <CardHeader>
            <CardTitle>Сертификаты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certificates.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {certificates.map((cert, index) => (
                  <div key={index} className="relative">
                    <img
                      src={cert}
                      alt={`Сертификат ${index + 1}`}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeCertificate(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              <label
                htmlFor="certificate-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Загрузите сертификаты</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, PDF до 10MB</span>
                <input
                  id="certificate-upload"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleCertificateUpload}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Кнопка завершения регистрации */}
        <div className="flex justify-center mt-8">
          <Button type="submit" size="lg" className="px-8">
            Завершить регистрацию
          </Button>
        </div>
      </form>
    </div>
  );
};
