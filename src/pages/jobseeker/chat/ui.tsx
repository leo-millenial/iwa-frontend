import { useUnit } from "effector-react";

import { ChatBox } from "@/widgets/chat-box";

import { $accessToken } from "@/shared/tokens";
import { UserRole } from "@/shared/types/user.interface";
import { $viewer } from "@/shared/viewer";

import { $chat } from "./model.ts";

export const CompanyChatPage = () => {
  const token = useUnit($accessToken);

  const chat = useUnit($chat);

  const viewer = useUnit($viewer);

  if (!chat || !token || viewer === null) {
    return <div className="p-6">🔄 Загрузка профиля...</div>;
  }

  if (viewer.user.role !== UserRole.Jobseeker) {
    return <div className="p-6 text-red-600">❌ Доступ запрещён</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-6  rounded shadow-2xl">
      <ChatBox
        chatId={chat._id}
        token={token}
        userId={chat.jobseekerId}
        recipientId={chat.companyId}
      />
    </div>
  );
};
