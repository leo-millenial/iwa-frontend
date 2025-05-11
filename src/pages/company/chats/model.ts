import { createEvent, createStore, sample } from "effector";

import { chatListQuery } from "@/shared/api/chat";
import { routes } from "@/shared/routing";
import { ChatStatus, IChat } from "@/shared/types/chat.types.ts";

export const currentRoute = routes.company.chats;

export const statusChanged = createEvent<ChatStatus>();
export const chatOpenClicked = createEvent<{ companyId: string; chatId: string }>();
export const $chats = createStore<IChat[]>([]).on(chatListQuery.$data, (_, chats) =>
  chats ? chats : [],
);
export const $selectedStatus = createStore<ChatStatus>(ChatStatus.ACTIVE).on(
  statusChanged,
  (_, status) => status,
);

export const $pending = chatListQuery.$pending;

sample({
  clock: currentRoute.opened,
  source: $selectedStatus,
  target: chatListQuery.start,
});

sample({
  clock: statusChanged,
  target: chatListQuery.start,
});

sample({
  clock: chatOpenClicked,
  fn: ({ companyId, chatId }) => ({ params: { companyId, chatId } }),
  target: routes.company.chat.open,
});
