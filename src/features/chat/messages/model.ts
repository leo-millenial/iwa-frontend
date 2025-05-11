import { createEvent, sample } from "effector";

import { $activeChatId } from "@/features/chat/select-active/model";

import { messageReceived } from "@/entities/message/model.ts";

import { fetchMessagesFx, sendMessageFx } from "@/shared/api/chat";
import { SendMessageDto } from "@/shared/types/chat.types.ts";

export const sendMessage = createEvent<SendMessageDto>();
export const fetchMessages = createEvent();

sample({
  clock: sendMessage,
  target: sendMessageFx,
});

sample({
  clock: sendMessageFx.done,
  source: $activeChatId,
  filter: Boolean,
  fn: (chatId) => ({ chatId }),
  target: fetchMessagesFx,
});

sample({
  clock: fetchMessages,
  source: $activeChatId,
  filter: Boolean,
  fn: (chatId) => ({ chatId }),
  target: fetchMessagesFx,
});

sample({
  clock: messageReceived,
  source: $activeChatId,
  filter: (chatId, msg): chatId is string => chatId !== null && msg.chatId === chatId,
  fn: (chatId) => ({ chatId: chatId as string }),
  target: fetchMessagesFx,
});
