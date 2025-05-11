import { Eye } from "lucide-react";

import { ChatStatus, IChat } from "@/shared/types/chat.types.ts";

interface Props {
  chats: IChat[];
  pending: boolean;
  onChatOpen: (companyId: string, chatId: string) => void;
}

export const ChatList = ({ chats, pending, onChatOpen }: Props) => {
  if (pending) return <div className="p-4">🔄 Загрузка чатов...</div>;
  if (!chats?.length) return <div className="p-4">📭 Чатов нет</div>;

  return (
    <ul className="space-y-4">
      {chats.map((chat) => (
        <li
          key={chat._id}
          className="border rounded p-4 flex justify-between items-center hover:bg-gray-50"
        >
          <div>
            <div className="text-sm text-gray-600">
              {chat.status === ChatStatus.PENDING && "⏳ Ожидает подтверждения"}
              {chat.status === ChatStatus.ACTIVE && "✅ Активен"}
              {chat.status === ChatStatus.ARCHIVED && "🗃️ В архиве"}
            </div>
            <div className="text-sm text-gray-800 mt-1">
              {chat.lastMessage?.content || <em>Без сообщений</em>}
            </div>
          </div>

          <button
            onClick={() => onChatOpen(chat.companyId, chat._id)}
            className="text-blue-600 flex items-center gap-1 text-sm"
          >
            <Eye size={16} /> Открыть
          </button>
        </li>
      ))}
    </ul>
  );
};
