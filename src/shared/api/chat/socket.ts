import { createEffect } from "effector";

import { getSocket } from "@/shared/lib/socket";
import { SendMessageDto } from "@/shared/types/chat.types.ts";

export const sendMessageFx = createEffect<SendMessageDto, void>((dto) => {
  const socket = getSocket();
  if (!socket?.connected) throw new Error("❌ Socket не подключён");

  socket.emit("sendMessage", dto);
});

export const fetchMessagesFx = createEffect<{ chatId: string }, void>(({ chatId }) => {
  const socket = getSocket();
  if (!socket?.connected) throw new Error("❌ Socket не подключён");
  socket.emit("fetchMessages", { chatId });
});

export const joinChatFx = createEffect<{ chatId: string }, void>(({ chatId }) => {
  const socket = getSocket();
  if (!socket?.connected) throw new Error("❌ Socket не подключён");
  socket.emit("joinChat", { chatId });
});
