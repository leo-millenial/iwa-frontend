import { useUnit } from "effector-react";

import { IResume } from "@/shared/types/resume.interface.ts";
import { UserRole } from "@/shared/types/user.interface";
import { IVacancy } from "@/shared/types/vacancy.interface.ts";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import {
  $initialMessage,
  $modalIsOpen,
  $selectedId,
  closeModal,
  formSubmitted,
  setInitialMessage,
  setSelectedId,
} from "./model";

interface Props {
  role: UserRole;
  resumes?: IResume[];
  vacancies?: IVacancy[];
}

export const InviteToChatModal = ({ role, resumes = [], vacancies = [] }: Props) => {
  const [isOpen, selectedId, initialMessage] = useUnit([
    $modalIsOpen,
    $selectedId,
    $initialMessage,
  ]);
  const [submit, setId, setMessage, close] = useUnit([
    formSubmitted,
    setSelectedId,
    setInitialMessage,
    closeModal,
  ]);

  const options = role === UserRole.Company ? vacancies : resumes;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📩 Пригласить в чат</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Select onValueChange={setId} value={selectedId}>
            <SelectTrigger>
              <SelectValue
                placeholder={role === UserRole.Company ? "Выберите вакансию" : "Выберите резюме"}
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {"position" in item ? item.position : item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={initialMessage}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Сопроводительное сообщение"
          />

          <Button onClick={submit} disabled={!selectedId || !initialMessage.trim()}>
            Отправить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
