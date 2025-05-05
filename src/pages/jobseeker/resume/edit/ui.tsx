import { format } from "date-fns";
import { Plus, Save, Trash2, Upload, Video, X } from "lucide-react";
import { useState } from "react";

import { LayoutJobseeker } from "@/layouts/jobseeker-layout";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";

// Вспомогательные функции и константы
enum Gender {
  Male = "Male",
  Female = "Female",
}

enum EmploymentType {
  FullTime = "FullTime",
  PartTime = "PartTime",
  Remote = "Remote",
  Office = "Office",
  Hybrid = "Hybrid",
}

enum SkillLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

enum LanguageLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Native = "Native",
}

interface Income {
  amount: number;
  currency: string | number;
}

interface IFullName {
  firstName: string;
  lastName?: string;
  patronymic?: string;
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

type WorkExperienceEndDate = Date | null;

interface IWorkExperience {
  position?: string;
  company?: string;
  employmentType?: EmploymentType;
  startDate?: Date;
  endDate?: WorkExperienceEndDate;
  website?: string;
  responsibilitiesDescription?: string;
}

interface IResume {
  photo: string;
  video: string; // URL видео
  jobseekerId?: string;
  position?: string;
  income?: Income;
  fullName?: IFullName;
  gender?: Gender;
  birthday?: Date;
  email?: string;
  phone?: string;
  city?: string;
  workExperience?: IWorkExperience[];
  education?: IEducation[];
  skills?: ISkill[];
  aboutMe?: string;
  languages?: ILanguage[];
  certificates?: string[];
}

// Вспомогательные компоненты
const employmentTypeLabels: Record<EmploymentType, string> = {
  [EmploymentType.FullTime]: "Полная занятость",
  [EmploymentType.PartTime]: "Частичная занятость",
  [EmploymentType.Remote]: "Удаленная работа",
  [EmploymentType.Office]: "Работа в офисе",
  [EmploymentType.Hybrid]: "Гибридный формат",
};

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};

const formatFullName = (fullName: IFullName | undefined) => {
  if (!fullName) return "";
  return `${fullName.lastName || ""} ${fullName.firstName || ""} ${fullName.patronymic || ""}`.trim();
};

// Моковые данные для демонстрации
const mockResume: IResume = {
  photo: "https://i.pravatar.cc/300",
  video: "https://example.com/video",
  position: "Frontend-разработчик",
  income: {
    amount: 150000,
    currency: "RUB",
  },
  fullName: {
    firstName: "Иван",
    lastName: "Иванов",
    patronymic: "Иванович",
  },
  gender: Gender.Male,
  birthday: new Date(1990, 5, 15),
  email: "ivan.ivanov@example.com",
  phone: "+7 (999) 123-45-67",
  city: "Москва",
  workExperience: [
    {
      position: "Senior Frontend Developer",
      company: "ООО Технологии будущего",
      employmentType: EmploymentType.Remote,
      startDate: new Date(2020, 2, 1),
      endDate: null,
      website: "https://future-tech.ru",
      responsibilitiesDescription:
        "Разработка и поддержка высоконагруженных веб-приложений. Внедрение современных технологий и методологий разработки. Менторство и код-ревью.",
    },
    {
      position: "Middle Frontend Developer",
      company: "Инновационные решения",
      employmentType: EmploymentType.Hybrid,
      startDate: new Date(2018, 6, 1),
      endDate: new Date(2020, 1, 28),
      website: "https://inno-solutions.ru",
      responsibilitiesDescription:
        "Разработка пользовательских интерфейсов. Оптимизация производительности. Интеграция с REST API.",
    },
  ],
  education: [
    {
      university: "Московский Государственный Университет",
      faculty: "Факультет вычислительной математики и кибернетики",
      degree: "Магистр",
      graduationDate: new Date(2016, 5, 30),
    },
  ],
  skills: [
    { plan: "React", level: SkillLevel.Advanced },
    { plan: "TypeScript", level: SkillLevel.Advanced },
    { plan: "JavaScript", level: SkillLevel.Advanced },
    { plan: "HTML/CSS", level: SkillLevel.Advanced },
    { plan: "Redux", level: SkillLevel.Intermediate },
    { plan: "Node.js", level: SkillLevel.Intermediate },
  ],
  aboutMe:
    "Опытный frontend-разработчик с более чем 5-летним стажем работы. Специализируюсь на создании современных, производительных и удобных веб-приложений. Имею глубокие знания JavaScript, TypeScript и React. Постоянно изучаю новые технологии и подходы к разработке.",
  languages: [
    { plan: "Русский", level: LanguageLevel.Native },
    { plan: "Английский", level: LanguageLevel.Advanced },
    { plan: "Немецкий", level: LanguageLevel.Beginner },
  ],
  certificates: ["https://example.com/cert1", "https://example.com/cert2"],
};

export const JobseekerResumeEditPage = () => {
  const [resume, setResume] = useState<IResume>(mockResume);
  const [activeTab, setActiveTab] = useState("personal");

  // Обработчики изменения полей
  const handlePersonalInfoChange = (field: keyof IResume, value: unknown) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  const handleFullNameChange = (field: keyof IFullName, value: string) => {
    setResume((prev) => ({
      ...prev,
      fullName: { ...prev.fullName, [field]: value } as IFullName,
    }));
  };

  const handleIncomeChange = (field: keyof Income, value: unknown) => {
    setResume((prev) => ({
      ...prev,
      income: { ...prev.income, [field]: value } as Income,
    }));
  };

  // Обработчики для опыта работы
  const addWorkExperience = () => {
    setResume((prev) => ({
      ...prev,
      workExperience: [
        ...(prev.workExperience || []),
        {
          position: "",
          company: "",
          employmentType: EmploymentType.FullTime,
          startDate: new Date(),
          endDate: null,
          website: "",
          responsibilitiesDescription: "",
        },
      ],
    }));
  };

  const updateWorkExperience = (index: number, field: keyof IWorkExperience, value: unknown) => {
    setResume((prev) => {
      const updatedExperience = [...(prev.workExperience || [])];
      updatedExperience[index] = { ...updatedExperience[index], [field]: value };
      return { ...prev, workExperience: updatedExperience };
    });
  };

  const removeWorkExperience = (index: number) => {
    setResume((prev) => ({
      ...prev,
      workExperience: prev.workExperience?.filter((_, i) => i !== index),
    }));
  };

  // Обработчики для образования
  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          university: "",
          faculty: "",
          degree: "",
          graduationDate: new Date(),
        },
      ],
    }));
  };

  const updateEducation = (index: number, field: keyof IEducation, value: unknown) => {
    setResume((prev) => {
      const updatedEducation = [...(prev.education || [])];
      updatedEducation[index] = { ...updatedEducation[index], [field]: value };
      return { ...prev, education: updatedEducation };
    });
  };

  const removeEducation = (index: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index),
    }));
  };

  // Обработчики для навыков
  const addSkill = () => {
    setResume((prev) => ({
      ...prev,
      skills: [
        ...(prev.skills || []),
        {
          plan: "",
          level: SkillLevel.Beginner,
        },
      ],
    }));
  };

  const updateSkill = (index: number, field: keyof ISkill, value: unknown) => {
    setResume((prev) => {
      const updatedSkills = [...(prev.skills || [])];
      updatedSkills[index] = { ...updatedSkills[index], [field]: value };
      return { ...prev, skills: updatedSkills };
    });
  };

  const removeSkill = (index: number) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index),
    }));
  };

  // Обработчики для языков
  const addLanguage = () => {
    setResume((prev) => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        {
          plan: "",
          level: LanguageLevel.Beginner,
        },
      ],
    }));
  };

  const updateLanguage = (index: number, field: keyof ILanguage, value: unknown) => {
    setResume((prev) => {
      const updatedLanguages = [...(prev.languages || [])];
      updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
      return { ...prev, languages: updatedLanguages };
    });
  };

  const removeLanguage = (index: number) => {
    setResume((prev) => ({
      ...prev,
      languages: prev.languages?.filter((_, i) => i !== index),
    }));
  };

  // Обработчики для сертификатов
  const addCertificate = () => {
    setResume((prev) => ({
      ...prev,
      certificates: [...(prev.certificates || []), ""],
    }));
  };

  const updateCertificate = (index: number, value: string) => {
    setResume((prev) => {
      const updatedCertificates = [...(prev.certificates || [])];
      updatedCertificates[index] = value;
      return { ...prev, certificates: updatedCertificates };
    });
  };

  const removeCertificate = (index: number) => {
    setResume((prev) => ({
      ...prev,
      certificates: prev.certificates?.filter((_, i) => i !== index),
    }));
  };

  // Обработчик загрузки видео
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера файла (30 МБ)
    const maxSize = 30 * 1024 * 1024; // 30 МБ в байтах
    if (file.size > maxSize) {
      alert("Размер файла превышает 30 МБ. Пожалуйста, выберите файл меньшего размера.");
      e.target.value = "";
      return;
    }

    // Проверка формата файла
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      alert("Неподдерживаемый формат файла. Пожалуйста, используйте MP4, WebM или MOV.");
      e.target.value = "";
      return;
    }

    // Создаем URL для предпросмотра видео
    const videoURL = URL.createObjectURL(file);
    handlePersonalInfoChange("video", videoURL);

    // В реальном приложении здесь будет загрузка на сервер
    // и сохранение полученного URL в состоянии

    // Сбрасываем значение input для возможности повторной загрузки того же файла
    e.target.value = "";
  };

  // Обработчик сохранения формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Сохраняем резюме:", resume);
    // Здесь будет логика отправки данных на сервер
    alert("Резюме успешно сохранено!");
  };

  return (
    <LayoutJobseeker>
      <div className="container mx-auto py-6 max-w-5xl">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Редактирование резюме</h1>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Отмена
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="personal">Личная информация</TabsTrigger>
              <TabsTrigger value="experience">Опыт работы</TabsTrigger>
              <TabsTrigger value="education">Образование</TabsTrigger>
              <TabsTrigger value="skills">Навыки</TabsTrigger>
              <TabsTrigger value="languages">Языки</TabsTrigger>
              <TabsTrigger value="certificates">Сертификаты</TabsTrigger>
            </TabsList>

            {/* Личная информация */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 mb-4">
                      <AvatarImage src={resume.photo} alt={formatFullName(resume.fullName)} />
                      <AvatarFallback>
                        {resume.fullName?.firstName?.charAt(0) || ""}
                        {resume.fullName?.lastName?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Загрузить фото
                    </Button>
                  </div>

                  {/* Добавляем блок для видео */}
                  <div className="mt-6 border-t pt-6">
                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-medium mb-2">Видео-презентация</h3>

                      {resume.video ? (
                        <div className="w-full max-w-md mb-4">
                          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                            <video
                              src={resume.video}
                              controls
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handlePersonalInfoChange("video", "")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 text-center">
                            Видео-презентация поможет работодателям лучше узнать вас
                          </p>
                        </div>
                      ) : (
                        <div className="w-full max-w-md mb-4">
                          <div
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg aspect-video flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => document.getElementById("video-upload")?.click()}
                          >
                            <Video className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground text-center">
                              Загрузите видео-презентацию о себе (до 30 МБ)
                            </p>
                            <p className="text-xs text-muted-foreground text-center mt-1">
                              Поддерживаемые форматы: MP4, WebM, MOV
                            </p>
                          </div>
                          <input
                            type="file"
                            id="video-upload"
                            className="hidden"
                            accept="video/mp4,video/webm,video/quicktime"
                            onChange={(e) => handleVideoUpload(e)}
                          />
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("video-upload")?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {resume.video ? "Заменить видео" : "Загрузить видео"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Фамилия</Label>
                      <Input
                        id="lastName"
                        value={resume.fullName?.lastName || ""}
                        onChange={(e) => handleFullNameChange("lastName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Имя</Label>
                      <Input
                        id="firstName"
                        value={resume.fullName?.firstName || ""}
                        onChange={(e) => handleFullNameChange("firstName", e.target.value)}
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
                    <div className="space-y-2">
                      <Label htmlFor="gender">Пол</Label>
                      <Select
                        value={resume.gender}
                        onValueChange={(value) =>
                          handlePersonalInfoChange("gender", value as Gender)
                        }
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Выберите пол" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Gender.Male}>Мужской</SelectItem>
                          <SelectItem value={Gender.Female}>Женский</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthday">Дата рождения</Label>
                      <Input
                        id="birthday"
                        type="date"
                        value={formatDate(resume.birthday)}
                        onChange={(e) =>
                          handlePersonalInfoChange("birthday", new Date(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Город</Label>
                      <Input
                        id="city"
                        value={resume.city || ""}
                        onChange={(e) => handlePersonalInfoChange("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resume.email || ""}
                        onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={resume.phone || ""}
                        onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Профессиональная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="position">Желаемая должность</Label>
                    <Input
                      id="position"
                      value={resume.position || ""}
                      onChange={(e) => handlePersonalInfoChange("position", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Желаемая зарплата</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={resume.income?.amount || ""}
                        onChange={(e) =>
                          handleIncomeChange("amount", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Валюта</Label>
                      <Select
                        value={resume.income?.currency?.toString() || "RUB"}
                        onValueChange={(value) => handleIncomeChange("currency", value)}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Выберите валюту" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RUB">₽ (Рубль)</SelectItem>
                          <SelectItem value="USD">$ (Доллар)</SelectItem>
                          <SelectItem value="EUR">€ (Евро)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aboutMe">О себе</Label>
                    <Textarea
                      id="aboutMe"
                      rows={5}
                      value={resume.aboutMe || ""}
                      onChange={(e) => handlePersonalInfoChange("aboutMe", e.target.value)}
                      placeholder="Расскажите о своем опыте, навыках и достижениях"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Опыт работы */}
            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Опыт работы</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addWorkExperience}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить опыт работы
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.workExperience && resume.workExperience.length > 0 ? (
                    resume.workExperience.map((experience, index) => (
                      <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0"
                          onClick={() => removeWorkExperience(index)}
                        >
                          <Trash2 className="h-2 w-2 text-destructive" />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`position-${index}`}>Должность</Label>
                            <Input
                              id={`position-${index}`}
                              value={experience.position || ""}
                              onChange={(e) =>
                                updateWorkExperience(index, "position", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`company-${index}`}>Компания</Label>
                            <Input
                              id={`company-${index}`}
                              value={experience.company || ""}
                              onChange={(e) =>
                                updateWorkExperience(index, "company", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`employmentType-${index}`}>Тип занятости</Label>
                            <Select
                              value={experience.employmentType}
                              onValueChange={(value) =>
                                updateWorkExperience(
                                  index,
                                  "employmentType",
                                  value as EmploymentType,
                                )
                              }
                            >
                              <SelectTrigger id={`employmentType-${index}`}>
                                <SelectValue placeholder="Выберите тип занятости" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(employmentTypeLabels).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`website-${index}`}>Сайт компании</Label>
                            <Input
                              id={`website-${index}`}
                              value={experience.website || ""}
                              onChange={(e) =>
                                updateWorkExperience(index, "website", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`startDate-${index}`}>Дата начала</Label>
                            <Input
                              id={`startDate-${index}`}
                              type="date"
                              value={formatDate(experience.startDate)}
                              onChange={(e) =>
                                updateWorkExperience(index, "startDate", new Date(e.target.value))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`endDate-${index}`}>Дата окончания</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id={`endDate-${index}`}
                                type="date"
                                value={formatDate(experience.endDate as Date)}
                                onChange={(e) =>
                                  updateWorkExperience(index, "endDate", new Date(e.target.value))
                                }
                                disabled={experience.endDate === null}
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`currentJob-${index}`}
                                  checked={experience.endDate === null}
                                  onChange={(e) =>
                                    updateWorkExperience(
                                      index,
                                      "endDate",
                                      e.target.checked ? null : new Date(),
                                    )
                                  }
                                  className="mr-1"
                                />
                                <Label htmlFor={`currentJob-${index}`} className="text-sm">
                                  По настоящее время
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`responsibilities-${index}`}>
                            Обязанности и достижения
                          </Label>
                          <Textarea
                            id={`responsibilities-${index}`}
                            rows={3}
                            value={experience.responsibilitiesDescription || ""}
                            onChange={(e) =>
                              updateWorkExperience(
                                index,
                                "responsibilitiesDescription",
                                e.target.value,
                              )
                            }
                            placeholder="Опишите ваши обязанности и достижения на этой позиции"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>У вас пока нет добавленного опыта работы</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={addWorkExperience}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить опыт работы
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Образование */}
            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Образование</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить образование
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.education && resume.education.length > 0 ? (
                    resume.education.map((education, index) => (
                      <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeEducation(index)}
                        >
                          <Trash2 className="h-2 w-2 text-destructive" />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`university-${index}`}>Учебное заведение</Label>
                            <Input
                              id={`university-${index}`}
                              value={education.university || ""}
                              onChange={(e) => updateEducation(index, "university", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`faculty-${index}`}>Факультет</Label>
                            <Input
                              id={`faculty-${index}`}
                              value={education.faculty || ""}
                              onChange={(e) => updateEducation(index, "faculty", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`degree-${index}`}>Степень/Квалификация</Label>
                            <Input
                              id={`degree-${index}`}
                              value={education.degree || ""}
                              onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`graduationDate-${index}`}>Дата окончания</Label>
                            <Input
                              id={`graduationDate-${index}`}
                              type="date"
                              value={formatDate(education.graduationDate)}
                              onChange={(e) =>
                                updateEducation(index, "graduationDate", new Date(e.target.value))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>У вас пока нет добавленного образования</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={addEducation}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить образование
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Навыки */}
            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Навыки</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить навык
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resume.skills && resume.skills.length > 0 ? (
                      resume.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex-1">
                            <Input
                              value={skill.name || ""}
                              onChange={(e) => updateSkill(index, "name", e.target.value)}
                              placeholder="Название навыка"
                            />
                          </div>
                          <div className="w-40 relative">
                            <Select
                              value={skill.level}
                              onValueChange={(value) =>
                                updateSkill(index, "level", value as SkillLevel)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Уровень" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={SkillLevel.Beginner}>Начинающий</SelectItem>
                                <SelectItem value={SkillLevel.Intermediate}>Средний</SelectItem>
                                <SelectItem value={SkillLevel.Advanced}>Продвинутый</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSkill(index)}
                          >
                            <Trash2 className="h-2 w-2 text-destructive" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>У вас пока нет добавленных навыков</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={addSkill}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Добавить навык
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Языки */}
            <TabsContent value="languages" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Языки</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addLanguage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить язык
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resume.languages && resume.languages.length > 0 ? (
                      resume.languages.map((language, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex-1">
                            <Input
                              value={language.name || ""}
                              onChange={(e) => updateLanguage(index, "name", e.target.value)}
                              placeholder="Название языка"
                            />
                          </div>
                          <div className="w-40">
                            <Select
                              value={language.level}
                              onValueChange={(value) =>
                                updateLanguage(index, "level", value as LanguageLevel)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Уровень" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={LanguageLevel.Beginner}>
                                  A1 (Начальный)
                                </SelectItem>
                                <SelectItem value={LanguageLevel.Intermediate}>
                                  B1 (Средний)
                                </SelectItem>
                                <SelectItem value={LanguageLevel.Advanced}>
                                  C1 (Продвинутый)
                                </SelectItem>
                                <SelectItem value={LanguageLevel.Native}>Родной</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLanguage(index)}
                          >
                            <Trash2 className="h-2 w-2 text-destructive" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>У вас пока нет добавленных языков</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={addLanguage}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Добавить язык
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Сертификаты */}
            <TabsContent value="certificates" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Сертификаты</CardTitle>
                  <Button type="button" variant="outline" size="sm" onClick={addCertificate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить сертификат
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resume.certificates && resume.certificates.length > 0 ? (
                      resume.certificates.map((certificate, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex-1">
                            <Input
                              value={certificate || ""}
                              onChange={(e) => updateCertificate(index, e.target.value)}
                              placeholder="Ссылка на сертификат"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCertificate(index)}
                          >
                            <Trash2 className="h-2 w-2 text-destructive" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>У вас пока нет добавленных сертификатов</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={addCertificate}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Добавить сертификат
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </LayoutJobseeker>
  );
};
