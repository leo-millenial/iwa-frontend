import { Link } from "@argon-router/react";
import { useUnit } from "effector-react";
import { Briefcase, Edit, Eye, Plus, Trash2 } from "lucide-react";

import { routes } from "@/shared/routing";
import { IResume } from "@/shared/types/resume.interface.ts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card.tsx";
import { $viewer } from "@/shared/viewer";

import { formatDate } from "./lib/format-date";
import {
  $error,
  $isDeleteDialogOpen,
  $isLoading,
  $resumeToDelete,
  $resumes,
  cancelDeleteClicked,
  confirmDeleteClicked,
  deleteResumeClicked,
  editResumeClicked,
  resumeCardClicked,
} from "./model.ts";

interface RecumeCardProps {
  resume: IResume;
  onView: (resumeId: string) => void;
  onEdit: (resumeId: string) => void;
  onDelete: (resumeId: string) => void;
}

// Компонент карточки резюме
const ResumeCard = ({ resume, onView, onEdit, onDelete }: RecumeCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="mr-2 h-5 w-5" />
          {resume.position}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{resume.city}</p>
          {resume.income && (
            <p className="font-medium">{resume.income.amount.toLocaleString()} ₽</p>
          )}
          {resume.workExperience && resume.workExperience.length > 0 && (
            <p className="text-sm">Последнее место работы: {resume.workExperience[0].company}</p>
          )}
          {resume.createdAt && (
            <p className="text-xs text-muted-foreground">Создано: {formatDate(resume.createdAt)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={() => onView(resume._id)}>
          <Eye className="h-4 w-4 mr-1" /> Просмотр
        </Button>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(resume._id);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(resume._id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Основной компонент страницы профиля соискателя
export const JobseekerProfilePage = () => {
  const viewer = useUnit($viewer);

  const jobseekerId = viewer?.jobseeker?._id || "";

  const [
    resumes,
    isLoading,
    error,
    isDeleteDialogOpen,
    resumeToDelete,
    handleResumeCardClick,
    handleEditResumeClick,
    handleDeleteResumeClick,
    handleConfirmDelete,
    handleCancelDelete,
  ] = useUnit([
    $resumes,
    $isLoading,
    $error,
    $isDeleteDialogOpen,
    $resumeToDelete,
    resumeCardClicked,
    editResumeClicked,
    deleteResumeClicked,
    confirmDeleteClicked,
    cancelDeleteClicked,
  ]);

  return (
    <>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Мои резюме</h1>
          <Button asChild>
            <Link to={routes.jobseeker.resume.create} params={{ jobseekerId }}>
              <Plus className="h-4 w-4 mr-2" /> Создать резюме
            </Link>
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">{error}</div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onView={handleResumeCardClick}
                onEdit={handleEditResumeClick}
                onDelete={handleDeleteResumeClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">У вас пока нет резюме</h2>
            <p className="mt-2 text-muted-foreground">
              Создайте свое первое резюме, чтобы начать поиск работы
            </p>
            <Button className="mt-4" asChild>
              <Link to={routes.jobseeker.resume.create} params={{ jobseekerId }}>
                <Plus className="h-4 w-4 mr-2" /> Создать резюме
              </Link>
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить резюме?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Резюме будет удалено навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
