import { useUnit } from "effector-react";
import { Trash2 } from "lucide-react";
import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";

import {
  $isModalOpen,
  $pending,
  cancelDeleteClicked,
  confirmDeleteClicked,
  deleteVacancyClicked,
} from "./model";

interface DeleteVacancyProps {
  id?: string;
  companyId?: string;
  /**
   * Показывать ли кнопку удаления
   * @default false
   */
  showButton?: boolean;
  /**
   * Вариант кнопки
   * @default "destructive"
   */
  buttonVariant?: "outline" | "destructive" | "ghost";
  /**
   * Размер кнопки
   * @default "sm"
   */
  buttonSize?: "default" | "sm" | "lg" | "icon";
  /**
   * Дополнительные классы для кнопки
   */
  buttonClassName?: string;
  /**
   * Текст кнопки
   * @default "Удалить"
   */
  buttonText?: string;
}

const DeleteVacancy: React.FC<DeleteVacancyProps> = ({
  id,
  companyId,
  showButton = false,
  buttonVariant = "destructive",
  buttonSize = "sm",
  buttonClassName = "",
  buttonText = "Удалить",
}) => {
  const [isModalOpen, pending, deleteVacancy, cancelDelete, confirmDelete] = useUnit([
    $isModalOpen,
    $pending,
    deleteVacancyClicked,
    cancelDeleteClicked,
    confirmDeleteClicked,
  ]);

  const handleDeleteClick = () => {
    if (id && companyId) {
      deleteVacancy({ id, companyId });
    }
  };

  return (
    <>
      {showButton && (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClassName}
          onClick={handleDeleteClick}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      )}

      <AlertDialog open={isModalOpen} onOpenChange={(open) => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы действительно хотите удалить эту вакансию? Это действие нельзя будет отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} disabled={pending}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={pending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {pending ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

/**
 * Компонент для удаления вакансии без отображения кнопки
 * Используется, когда кнопка удаления реализована отдельно
 */
export const DeleteVacancyDialog: React.FC<Omit<DeleteVacancyProps, "showButton">> = (props) => {
  return <DeleteVacancy {...props} showButton={false} />;
};

/**
 * Компонент для удаления вакансии с отображением кнопки
 */
export const DeleteVacancyButton: React.FC<Omit<DeleteVacancyProps, "showButton">> = (props) => {
  return <DeleteVacancy {...props} showButton={true} />;
};
