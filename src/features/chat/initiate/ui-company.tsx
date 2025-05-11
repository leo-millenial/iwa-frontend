import { useUnit } from "effector-react";
import { useState } from "react";

import { initiateChatMutation } from "@/shared/api/chat/initiate";
import { UserRole } from "@/shared/types/user.interface.ts";

import { formSubmitted } from "./model";

interface Props {
  jobseekerId: string;
  companyId: string;
  resumeId: string;
  vacancyId: string;
  initiator: UserRole;
  onSuccess?: () => void;
}

export const CompanyInitiateChatForm = ({
  jobseekerId,
  companyId,
  resumeId,
  vacancyId,
  initiator,
  onSuccess,
}: Props) => {
  const [message, setMessage] = useState("");
  const submit = useUnit(formSubmitted);
  const pending = useUnit(initiateChatMutation.$pending);

  const handleSubmit = () => {
    submit({
      jobseekerId,
      companyId,
      resumeId,
      vacancyId,
      initialMessage: message,
      initiator,
    });
    setMessage("");
    onSuccess?.();
  };

  return (
    <div className="space-y-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сопроводительное сообщение"
        className="w-full border p-2 rounded"
      />
      <button
        onClick={handleSubmit}
        disabled={pending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {pending ? "Отправка..." : "Отправить запрос на чат"}
      </button>
    </div>
  );
};
