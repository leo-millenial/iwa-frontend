import { useUnit } from "effector-react";
import { useState } from "react";

import { initiateChatMutation } from "@/shared/api/chat/initiate";
import { IResume } from "@/shared/types/resume.interface";
import { UserRole } from "@/shared/types/user.interface.ts";

import { formSubmitted } from "./model";

interface Props {
  jobseekerId: string;
  resumes: IResume[];
  vacancyId: string;
  companyId: string;
  onSuccess?: () => void;
}

export const JobseekerInitiateChatForm = ({
  jobseekerId,
  resumes,
  vacancyId,
  companyId,
  onSuccess,
}: Props) => {
  const [message, setMessage] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(resumes[0]?._id ?? null);

  const send = useUnit(formSubmitted);
  const pending = useUnit(initiateChatMutation.$pending);

  const handleSend = () => {
    if (!message.trim() || !selectedResumeId) return;

    send({
      jobseekerId,
      companyId,
      vacancyId,
      resumeId: selectedResumeId,
      initialMessage: message,
      initiator: UserRole.Jobseeker,
    });

    setMessage("");
    onSuccess?.();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Выберите резюме:</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedResumeId ?? ""}
          onChange={(e) => setSelectedResumeId(e.target.value)}
        >
          {resumes.map((r) => (
            <option key={r._id} value={r._id}>
              {r.position}
            </option>
          ))}
        </select>
      </div>

      <textarea
        placeholder="Сопроводительное сообщение"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleSend}
        disabled={pending || !selectedResumeId}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {pending ? "Отправка..." : "Откликнуться"}
      </button>
    </div>
  );
};

/*
<JobseekerInitiateChatForm
  jobseekerId={viewer.jobseeker?._id}
  resumes={viewer.jobseeker?.resumes ?? []}
  vacancyId={vacancy._id}
  companyId={vacancy.companyId}
  onSuccess={() => toast.success('Запрос отправлен')}
/>
 */
