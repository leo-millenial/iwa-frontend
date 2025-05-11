import { createStore, sample } from "effector";

import { chatByIdQuery } from "@/shared/api/chat";
import { routes } from "@/shared/routing";
import { IChat } from "@/shared/types/chat.types.ts";

export const currentRoute = routes.company.chat;

export const $chat = createStore<IChat | null>(null).on(
  chatByIdQuery.finished.success,
  (_, { result: chat }) => chat,
);

sample({
  clock: currentRoute.opened,
  source: currentRoute.$params,
  fn: ({ chatId }) => chatId,
  target: chatByIdQuery.start,
});
