import { useUnit } from "effector-react";

import { ChatList } from "@/features/chat/list";

import { ChatStatus } from "@/shared/types/chat.types";
import { Button } from "@/shared/ui/button";

import { $chats, $pending, $selectedStatus, chatOpenClicked, statusChanged } from "./model";

export function ChatsPage() {
  const [status, changeStatus, chats, pending, handleChatOpenClick] = useUnit([
    $selectedStatus,
    statusChanged,
    $chats,
    $pending,
    chatOpenClicked,
  ]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">💬 Мои чаты</h1>

      <div className="flex gap-2 mb-4">
        <Button
          variant={status === ChatStatus.ACTIVE ? "default" : "secondary"}
          onClick={() => changeStatus(ChatStatus.ACTIVE)}
        >
          Активные
        </Button>
        <Button
          variant={status === ChatStatus.PENDING ? "default" : "secondary"}
          onClick={() => changeStatus(ChatStatus.PENDING)}
        >
          В ожидании
        </Button>
        <Button
          variant={status === ChatStatus.ARCHIVED ? "default" : "secondary"}
          onClick={() => changeStatus(ChatStatus.ARCHIVED)}
        >
          Архив
        </Button>
      </div>

      <ChatList
        chats={chats}
        pending={pending}
        onChatOpen={(companyId, chatId) => handleChatOpenClick({ companyId, chatId })}
      />
    </div>
  );
}
