import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, FileText, Globe, GraduationCap, Mail, MapPin, Phone } from "lucide-react";

import { LayoutJobseeker } from "@/layouts/jobseeker-layout";

import { IFullName, IResume, LanguageLevel, SkillLevel } from "@/shared/types/resume.interface.ts";
import { EmploymentType } from "@/shared/types/vacancy.interface.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Separator } from "@/shared/ui/separator";

// Вспомогательные компоненты
const employmentTypeLabels: Record<EmploymentType, string> = {
  [EmploymentType.FullTime]: "Полная занятость",
  [EmploymentType.PartTime]: "Частичная занятость",
  [EmploymentType.Remote]: "Удаленная работа",
  [EmploymentType.Office]: "Работа в офисе",
  [EmploymentType.Hybrid]: "Гибридный формат",
};

const skillLevelLabels: Record<SkillLevel, string> = {
  [SkillLevel.Beginner]: "Начинающий",
  [SkillLevel.Intermediate]: "Средний",
  [SkillLevel.Advanced]: "Продвинутый",
};

const languageLevelLabels: Record<LanguageLevel, string> = {
  [LanguageLevel.Beginner]: "Начальный",
  [LanguageLevel.Intermediate]: "Средний",
  [LanguageLevel.Advanced]: "Продвинутый",
  [LanguageLevel.Native]: "Родной",
};

const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return format(date, "LLLL yyyy", { locale: ru });
};

const formatFullName = (fullName: IFullName | undefined) => {
  if (!fullName) return "";
  return `${fullName.lastName || ""} ${fullName.firstName || ""} ${fullName.patronymic || ""}`.trim();
};

const getSkillLevelProgress = (level: SkillLevel) => {
  switch (level) {
    case SkillLevel.Beginner:
      return 33;
    case SkillLevel.Intermediate:
      return 66;
    case SkillLevel.Advanced:
      return 100;
    default:
      return 0;
  }
};

const getLanguageLevelProgress = (level: LanguageLevel) => {
  switch (level) {
    case LanguageLevel.Beginner:
      return 25;
    case LanguageLevel.Intermediate:
      return 50;
    case LanguageLevel.Advanced:
      return 75;
    case LanguageLevel.Native:
      return 100;
    default:
      return 0;
  }
};

export const ResumeView = ({ resume }: { resume: IResume }) => {
  return (
    <LayoutJobseeker>
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - основная информация */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={resume.photo} alt={formatFullName(resume.fullName)} />
                    <AvatarFallback>
                      {resume.fullName?.firstName?.charAt(0) || ""}
                      {resume.fullName?.lastName?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{formatFullName(resume.fullName)}</h2>
                  <p className="text-muted-foreground">{resume.position}</p>

                  {resume.income && (
                    <Badge variant="outline" className="mt-2">
                      {resume.income.amount.toLocaleString()} ₽
                    </Badge>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  {resume.city && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{resume.city}</span>
                    </div>
                  )}

                  {resume.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${resume.email}`} className="hover:underline">
                        {resume.email}
                      </a>
                    </div>
                  )}

                  {resume.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${resume.phone}`} className="hover:underline">
                        {resume.phone}
                      </a>
                    </div>
                  )}

                  {resume.birthday && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{format(resume.birthday, "dd MMMM yyyy", { locale: ru })}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Навыки */}
            {resume.skills && resume.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Навыки</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resume.skills.map((skill, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {skillLevelLabels[skill.level]}
                          </span>
                        </div>
                        <Progress value={getSkillLevelProgress(skill.level)} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Языки */}
            {resume.languages && resume.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Языки</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resume.languages.map((language, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{language.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {languageLevelLabels[language.level]}
                          </span>
                        </div>
                        <Progress
                          value={getLanguageLevelProgress(language.level)}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Правая колонка - детальная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* О себе */}
            {resume.aboutMe && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">О себе</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{resume.aboutMe}</p>
                </CardContent>
              </Card>
            )}

            {/* Опыт работы */}
            {resume.workExperience && resume.workExperience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Опыт работы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {resume.workExperience.map((experience, index) => (
                      <div
                        key={index}
                        className="relative pl-6 pb-6 border-l border-muted last:pb-0"
                      >
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1" />
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold">{experience.position}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>{experience.company}</span>
                              {experience.employmentType && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>{employmentTypeLabels[experience.employmentType]}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {experience.startDate && formatDate(experience.startDate)}
                              {" — "}
                              {experience.endDate
                                ? formatDate(experience.endDate)
                                : "По настоящее время"}
                            </span>
                          </div>

                          {experience.website && (
                            <div className="flex items-center text-sm">
                              <Globe className="h-3 w-3 mr-1 text-muted-foreground" />
                              <a
                                href={experience.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {experience.website.replace(/^https?:\/\/(www\.)?/, "")}
                              </a>
                            </div>
                          )}

                          {experience.responsibilitiesDescription && (
                            <p className="text-sm mt-2">{experience.responsibilitiesDescription}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Образование */}
            {resume.education && resume.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Образование</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {resume.education.map((edu, index) => (
                      <div
                        key={index}
                        className="relative pl-6 pb-6 border-l border-muted last:pb-0"
                      >
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-1" />
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold">{edu.university}</h3>
                            <div className="text-sm text-muted-foreground">
                              {edu.faculty}, {edu.degree}
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-muted-foreground">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            <span>
                              Выпуск: {edu.graduationDate && formatDate(edu.graduationDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Сертификаты */}
            {resume.certificates && resume.certificates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Сертификаты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resume.certificates.map((cert, index) => (
                      <div key={index} className="border rounded-md p-4 flex items-center">
                        <FileText className="h-8 w-8 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Сертификат #{index + 1}</p>
                          <a
                            href={cert}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Посмотреть сертификат
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Видео-презентация */}
            {resume.video && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Видео-презентация</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Здесь будет отображаться видео-презентация
                    </p>
                    {/* В реальном приложении здесь будет компонент для воспроизведения видео */}
                    {/* <video src={resume.video} controls className="w-full h-full rounded-md" /> */}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </LayoutJobseeker>
  );
};
